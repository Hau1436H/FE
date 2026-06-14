// src/components/skillAssessment/AssessmentTest.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; 

function AssessmentTest({ skillNodeId = 1, onComplete }) {
  const [questions, setQuestions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);    
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    async function getQuiz() {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/api/assessments/quiz/${skillNodeId}`);
        const result = response.data;

        if (result && result.data) {
          const formattedQuestions = result.data.map(q => {
            const formattedOptions = Object.keys(q.options).map(key => ({
              id: key,
              text: q.options[key]
            }));

            return {
              id: q.questionId,
              question: q.questionText,
              options: formattedOptions
            };
          });

          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu bài test:", error);
      } finally {
        setLoading(false);
      }
    }
    getQuiz();
  }, [skillNodeId]);

  if (loading) {
    return (
      <div className="card border-secondary border-opacity-25 text-white p-5 text-center" style={{ backgroundColor: '#0b0c16' }}>
        <div className="spinner-border text-success mb-3" role="status"></div>
        <div>Đang nạp bộ câu hỏi từ Server...</div>
      </div>
    );
  }

  if (questions.length === 0) return <div className="text-white text-center">Không có câu hỏi.</div>;

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (optionId) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: optionId });
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsSubmitting(true);
      try {
        // LẤY ID ĐỘNG TỪ LOCAL STORAGE
        // --- TRICK: BÓC TÁCH ID TRỰC TIẾP TỪ TOKEN ---
        let studentId = '';
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            // THÊM DÒNG NÀY ĐỂ XEM C# TRẢ VỀ GÌ TRONG TOKEN:
            console.log("🔍 CHI TIẾT TOKEN TỪ C#:", payload);

            studentId = payload.studentId || payload.StudentId || payload.userId || payload.UserId || payload.sub || payload.nameid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || '';
            
            // NẾU VẪN KHÔNG LẤY ĐƯỢC, TẠM THỜI GÁN CỨNG ĐỂ TEST BÀI (Thay bằng ID thật trong SQL của bạn):
            if (!studentId) {
                 studentId = '123e4567-e89b-12d3-a456-426614174000'; // Dán ID thật của bạn vào đây để học tiếp luồng Code!
            }
            
          } catch (e) {
            console.error("Không thể giải mã Token");
          }
        }

        if (!studentId) {
          alert("Lỗi: Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại!");
          setIsSubmitting(false);
          return;
        }

        const submissionPayload = {
          studentId: studentId, // Dữ liệu ID thật
          skillNodeId: skillNodeId,
          answers: Object.keys(selectedAnswers).map(qId => ({
            questionId: parseInt(qId),
            selectedOption: selectedAnswers[qId]
          }))
        };

        const response = await axiosClient.post('/api/assessments/submit', submissionPayload);
        
        const { score, feedback } = response.data;
        
        if (onComplete) {
          onComplete(score, questions.length, feedback);
        }
      } catch (error) {
        console.error("Lỗi nộp bài:", error);
        alert("Có lỗi xảy ra khi chấm bài!");
      } finally {
        setIsSubmitting(false);
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
        <span className="badge bg-secondary">Kỹ năng #{skillNodeId}</span>
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
        <button className="btn btn-outline-secondary text-white px-4" onClick={handleBack} disabled={currentIdx === 0 || isSubmitting}>
          Quay lại
        </button>
        <button className="btn btn-success px-4" onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id] || isSubmitting}>
          {isSubmitting ? <span className="spinner-border spinner-border-sm"></span> : (currentIdx === questions.length - 1 ? 'Nộp bài' : 'Tiếp theo')}
        </button>
      </div>
    </div>
  );
}

export default AssessmentTest;