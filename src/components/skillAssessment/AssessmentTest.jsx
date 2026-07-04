import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function AssessmentTest({ roleId, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    async function getQuiz() {
      try {
        setLoading(true);
        // GỌI API MỚI DÀNH CHO ROLE ĐỂ LẤY ĐỀ TOÀN DIỆN
        const response = await axiosClient.get(`/api/assessments/quiz/role/${roleId}`);
        const result = response.data;

        if (result && result.Data) {
          const formattedQuestions = result.Data.map(q => {
            const formattedOptions = Object.keys(q.Options).map(key => ({ id: key, text: q.Options[key] }));
            return { id: q.QuestionId, question: q.QuestionText, options: formattedOptions };
          });
          setQuestions(formattedQuestions);
        } else if (result && result.data) {
          const formattedQuestions = result.data.map(q => {
            const formattedOptions = Object.keys(q.options).map(key => ({ id: key, text: q.options[key] }));
            return { id: q.questionId, question: q.questionText, options: formattedOptions };
          });
          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu bài test:", error);
      } finally {
        setLoading(false);
      }
    }
    if (roleId) getQuiz();
  }, [roleId]);

  if (loading) return <div className="text-white text-center p-5"><div className="spinner-border text-success"></div></div>;
  if (questions.length === 0) return <div className="text-white text-center p-5">Không có câu hỏi cho ngành nghề này.</div>;

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (optionId) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: optionId });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const formattedAnswers = Object.keys(selectedAnswers).map(qId => ({
        questionId: parseInt(qId),
        selectedOption: selectedAnswers[qId]
      }));
      onComplete(formattedAnswers);
    }
  };

  return (
    <div className="card border-secondary border-opacity-25 text-white p-4" style={{ backgroundColor: '#0b0c16' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-white-50">Câu hỏi {currentIdx + 1} / {questions.length}</span>
      </div>
      
      <div className="progress mb-4" style={{ height: '6px', backgroundColor: '#1a1d36' }}>
        <div className="progress-bar bg-success" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
      </div>

      <h5 className="mb-4 lh-base" style={{ whiteSpace: 'pre-wrap' }}>
  {currentQuestion.question}
</h5>

      <div className="d-flex flex-column gap-3 mb-4">
        {currentQuestion.options.map((opt) => {
          const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`btn text-start p-3 rounded-3 border transition-all ${isSelected ? 'btn-success border-success text-white shadow' : 'btn-outline-secondary border-secondary border-opacity-25 text-white-50'}`}
              style={{ backgroundColor: isSelected ? '' : '#111324' }}
            >
              <strong className="me-2 text-warning">{opt.id}.</strong> {opt.text}
            </button>
          );
        })}
      </div>

      <div className="d-flex justify-content-end pt-3 border-top border-secondary border-opacity-10">
        <button className="btn btn-success px-4" onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]}>
          {currentIdx === questions.length - 1 ? 'Chốt Đáp Án & Tiếp Tục' : 'Tiếp theo'}
        </button>
      </div>
    </div>
  );
}

export default AssessmentTest;