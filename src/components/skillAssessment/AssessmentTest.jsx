// .\src\components\skillAssessment\AssessmentTest.jsx
import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS } from '../../data/assessmentData';

// Thêm prop onComplete
function AssessmentTest({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIdx];

  const handleSelectOption = (optionId) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: optionId });
  };

  const calculateScore = () => {
    let score = 0;
    ASSESSMENT_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const handleNext = () => {
    if (currentIdx < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const finalScore = calculateScore();
      setShowResult(true);
      // Nếu có prop callback thì gửi dữ liệu lên cha quản lý
      if (onComplete) {
        onComplete(finalScore, ASSESSMENT_QUESTIONS.length);
      }
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  return (
    <div className="card border-secondary border-opacity-25 text-white p-4" style={{ backgroundColor: '#0b0c16' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-white-50">Câu hỏi {currentIdx + 1} / {ASSESSMENT_QUESTIONS.length}</span>
        <span className="badge bg-secondary">Chủ đề: Frontend Dev</span>
      </div>
      
      <div className="progress mb-4" style={{ height: '6px', backgroundColor: '#1a1d36' }}>
        <div className="progress-bar bg-success" style={{ width: `${((currentIdx + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}></div>
      </div>

      <h5 className="mb-4 lh-base">{currentQuestion.question}</h5>

      <div className="d-flex flex-column gap-3 mb-4">
        {currentQuestion.options.map((opt) => {
          const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`btn text-start p-3 rounded-3 border transition-all ${
                isSelected ? 'btn-success border-success text-white shadow' : 'btn-outline-secondary border-secondary border-opacity-25 text-white-50'
              }`}
              style={{ backgroundColor: isSelected ? '' : '#111324' }}
            >
              <strong className="me-2 text-warning">{opt.id}.</strong> {opt.text}
            </button>
          );
        })}
      </div>

      <div className="d-flex justify-content-between pt-3 border-top border-secondary border-opacity-10">
        <button className="btn btn-outline-secondary text-white px-4" onClick={handleBack} disabled={currentIdx === 0}>
          Quay lại
        </button>
        <button className="btn btn-success px-4" onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]}>
          {currentIdx === ASSESSMENT_QUESTIONS.length - 1 ? 'Nộp bài' : 'Tiếp theo'}
        </button>
      </div>
    </div>
  );
}

export default AssessmentTest;