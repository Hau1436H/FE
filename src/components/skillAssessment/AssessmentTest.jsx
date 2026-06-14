import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Đảm bảo đúng đường dẫn axiosClient của bạn

// Thêm prop skillNodeId từ component cha truyền vào (Ví dụ: skillNodeId={1})
function AssessmentTest({ skillNodeId = 1, onComplete }) {
  const [questions, setQuestions] = useState([]); // Khởi tạo mảng câu hỏi rỗng từ API
  const [loading, setLoading] = useState(true);     // Trạng thái chờ tải dữ liệu
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  // 1. GỌI API VÀ BIẾN ĐỔI CẤU TRÚC DỮ LIỆU
  useEffect(() => {
    async function getQuiz() {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/api/Assessments/quiz/${skillNodeId}`);
        const result = response.data;

        if (result && result.data) {
          // Biến đổi cấu trúc options từ Object {A: '...', B: '...'} thành mảng [{id: 'A', text: '...'}, ...]
          const formattedQuestions = result.data.map(q => {
            const formattedOptions = Object.keys(q.options).map(key => ({
              id: key,
              text: q.options[key]
            }));

            return {
              id: q.questionId,
              question: q.questionText,
              options: formattedOptions,
              correctAnswer: "A" // Lưu ý: Hiện tại API Swagger chưa trả về đáp án đúng (correctAnswer), tạm thời mock cố định là "A" để tính điểm
            };
          });

          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu bài test từ API:", error);
      } finally {
        setLoading(false);
      }
    }
    getQuiz();
  }, [skillNodeId]);

  // Khóa bảo vệ: Khi đang load dữ liệu từ API
  if (loading) {
    return (
      <div className="card border-secondary border-opacity-25 text-white p-5 text-center" style={{ backgroundColor: '#0b0c16' }}>
        <div className="spinner-border text-success mb-3" role="status"></div>
        <div>Đang nạp bộ câu hỏi đánh giá hệ thống...</div>
      </div>
    );
  }

  // Khóa bảo vệ: Trường hợp node ID này không có câu hỏi nào trả về
  if (questions.length === 0) {
    return (
      <div className="card border-secondary border-opacity-25 text-white p-5 text-center" style={{ backgroundColor: '#0b0c16' }}>
        <p className="text-white-50">Không tìm thấy câu hỏi nào cho kỹ năng này.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (optionId) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: optionId });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const finalScore = calculateScore();
      setShowResult(true);
      if (onComplete) {
        onComplete(finalScore, questions.length);
      }
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  return (
    <div className="card border-secondary border-opacity-25 text-white p-4" style={{ backgroundColor: '#0b0c16' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-white-50">Câu hỏi {currentIdx + 1} / {questions.length}</span>
        <span className="badge bg-secondary">Chủ đề: Kỹ năng #{skillNodeId}</span>
      </div>
      
      <div className="progress mb-4" style={{ height: '6px', backgroundColor: '#1a1d36' }}>
        <div className="progress-bar bg-success" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
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
          {currentIdx === questions.length - 1 ? 'Nộp bài' : 'Tiếp theo'}
        </button>
      </div>
    </div>
  );
}

export default AssessmentTest;
