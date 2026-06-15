// src/components/skillAssessment/CodeAssessment.jsx
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axiosClient from '../../api/axiosClient';

function CodeAssessment({ skillNodeId, onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(true);
  
  const [output, setOutput] = useState('');
  const [aiChat, setAiChat] = useState([]);
  
  // State lưu thông tin đề bài lấy từ API
  const [exerciseData, setExerciseData] = useState(null);
  const [code, setCode] = useState('');

  // Hàm lấy StudentId từ Token JWT
  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.StudentId || payload.studentId || payload.sub;
    } catch (e) {
      return null;
    }
  };

  // GỌI API LẤY/SINH ĐỀ BÀI NGAY KHI MỞ TAB
  useEffect(() => {
    const fetchOrGenerateExercise = async () => {
      try {
        setLoadingProblem(true);
        // Gọi API sinh đề bài từ Backend (AI sẽ xử lý nếu chưa có)
        const response = await axiosClient.post(`/api/assessments/generate-exercise/${skillNodeId}`);
        const exercise = response.data.data || response.data;
        
        if (exercise) {
          setExerciseData(exercise);
          // Gán code mẫu từ đề bài vào Editor
          setCode(exercise.defaultCodeTemplate || exercise.DefaultCodeTemplate || '// Viết code của bạn ở đây...');
        }
      } catch (error) {
        console.error("Lỗi lấy đề bài code:", error);
        setOutput("Không thể tải đề bài. Vui lòng thử lại sau.");
      } finally {
        setLoadingProblem(false);
      }
    };

    if (skillNodeId) {
      fetchOrGenerateExercise();
    }
  }, [skillNodeId]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Đang biên dịch code...');
    try {
      // Khi chạy thử, truyền cả TestStdin và ExpectedOutput (nếu có) để BE gọi Judge0
      const payload = { 
        language: "csharp", 
        sourceCode: code, 
        stdin: exerciseData?.testStdin || exerciseData?.TestStdin || "",
        expectedOutput: exerciseData?.expectedOutput || exerciseData?.ExpectedOutput || ""
      };
      // Giả sử PracticeWorkspaceService của bạn có hàm chạy code
      const response = await axiosClient.post('/api/v1/PracticeWorkspace/run-code', payload);
      setOutput(response.data.data?.output || response.data.data?.stdout || "Biên dịch thành công, không có kết quả in ra màn hình.");
    } catch (error) {
      setOutput("Lỗi hệ thống khi kết nối Server biên dịch.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleAskAi = async () => {
    const studentId = getStudentId();
    if (!studentId) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setIsAskingAi(true);
    setAiChat(prev => [...prev, { sender: 'Student', text: 'Xin hãy cho tôi gợi ý về bài tập này.' }]);
    
    try {
      const payload = {
        studentId: studentId,
        problemDescription: exerciseData?.problemDescription || exerciseData?.ProblemDescription || "Yêu cầu bài toán",
        currentCode: code,
        userMessage: "Xin hãy cho tôi gợi ý về bài tập này."
      };
      const response = await axiosClient.post('/api/v1/PracticeWorkspace/ai-tutor', payload);
      setAiChat(prev => [...prev, { sender: 'AI', text: response.data.aiResponse }]);
    } catch (error) {
      setAiChat(prev => [...prev, { sender: 'AI', text: "Lỗi kết nối đến AI Tutor." }]);
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleSubmitFinal = async () => {
    const studentId = getStudentId();
    if (!studentId) {
      alert("Lỗi: Không tìm thấy ID sinh viên. Vui lòng đăng nhập lại!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Khi nộp bài chính thức, gửi đủ thông tin để BE gọi Judge0 chấm điểm và AI Review
      const payload = {
        studentId: studentId,
        skillNodeId: skillNodeId,
        language: "csharp",
        sourceCode: code,
        problemDescription: exerciseData?.problemDescription || exerciseData?.ProblemDescription || "Yêu cầu bài toán",
        stdin: exerciseData?.testStdin || exerciseData?.TestStdin || "",
        expectedOutput: exerciseData?.expectedOutput || exerciseData?.ExpectedOutput || ""
      };
      
      const response = await axiosClient.post('/api/assessments/submit-code', payload);
      if (onComplete) {
        // Kiểm tra undefined tường minh thay vì dùng toán tử ||
        const finalScore = response.data.score !== undefined ? response.data.score : (response.data.Score || 0);
        const finalReview = response.data.aiReview || response.data.AiReview || "Không có nhận xét.";
        
        // Truyền 10 làm tổng điểm (thay vì 1) vì hệ thống chấm trên thang điểm 10
        onComplete(finalScore, 10, finalReview);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi nộp bài!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProblem) {
    return (
      <div className="card border-secondary border-opacity-25 text-white p-5 text-center" style={{ backgroundColor: '#0b0c16' }}>
        <div className="spinner-border text-warning mb-3" role="status"></div>
        <div>Hệ thống AI đang khởi tạo đề bài lập trình dành riêng cho bạn. Vui lòng đợi...</div>
      </div>
    );
  }

  return (
    <div className="row g-3 text-white">
      {/* Cột trái: Editor và Đề bài */}
      <div className="col-lg-8">
        <div className="card border-secondary border-opacity-25 p-0 overflow-hidden h-100 d-flex flex-column" style={{ backgroundColor: '#0b0c16' }}>
          <div className="bg-dark bg-opacity-50 p-2 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
            <span className="fw-bold ms-2 text-warning">💻 Thực hành Code: {exerciseData?.title || exerciseData?.Title || "Không rõ tên bài"}</span>
            <span className="badge bg-secondary">Độ khó: {exerciseData?.difficultyLevel || exerciseData?.DifficultyLevel || "Tùy biến"}</span>
          </div>
          
          {/* Vùng hiển thị đề bài do AI sinh */}
          <div className="p-3 bg-secondary bg-opacity-10 border-bottom border-secondary border-opacity-25 small" style={{ maxHeight: '150px', overflowY: 'auto' }}>
            <strong className="text-info">📝 Yêu cầu:</strong>
            <p className="mt-1 mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {exerciseData?.problemDescription || exerciseData?.ProblemDescription || "Chưa có nội dung đề bài."}
            </p>
          </div>

          <div className="flex-grow-1" style={{ minHeight: '350px' }}>
            <Editor
              height="100%"
              defaultLanguage="csharp"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          <div className="p-3 border-top border-secondary border-opacity-25 d-flex justify-content-between bg-dark bg-opacity-25">
            <button className="btn btn-secondary px-4" onClick={handleRunCode} disabled={isRunning}>
              {isRunning ? 'Đang chạy...' : '▶ Chạy thử Code'}
            </button>
            <button className="btn btn-success px-4" onClick={handleSubmitFinal} disabled={isSubmitting}>
              {isSubmitting ? 'Đang nộp...' : 'Nộp bài & Chuyển bước'}
            </button>
          </div>
        </div>
      </div>

      {/* Cột phải: Terminal Output & AI Chat */}
      <div className="col-lg-4">
        <div className="card border-secondary border-opacity-25 p-0 h-100 d-flex flex-column" style={{ backgroundColor: '#0b0c16' }}>
          
          <div className="bg-dark bg-opacity-50 p-2 border-bottom border-secondary border-opacity-25 text-end">
             <button className="btn btn-sm btn-outline-warning" onClick={handleAskAi} disabled={isAskingAi}>
              {isAskingAi ? '🤖 AI Đang gõ...' : '🤖 Xin gợi ý từ AI Tutor'}
            </button>
          </div>

          <div className="p-3 border-bottom border-secondary border-opacity-25" style={{ minHeight: '150px', maxHeight: '250px', overflowY: 'auto' }}>
            <h6 className="text-success fw-bold font-monospace mb-2">Terminal Output</h6>
            <pre className="text-white-50 small mb-0" style={{ whiteSpace: 'pre-wrap' }}>{output || "Chưa có kết quả chạy code..."}</pre>
          </div>

          <div className="p-3 flex-grow-1 overflow-auto">
            <h6 className="text-info fw-bold mb-3">💬 AI Tutor Chat</h6>
            {aiChat.length === 0 ? <p className="text-white-50 small">Nếu bí ý tưởng, hãy bấm "Xin gợi ý từ AI Tutor" ở góc trên.</p> : (
              <div className="d-flex flex-column gap-2">
                {aiChat.map((msg, idx) => (
                  <div key={idx} className={`p-2 rounded-3 small ${msg.sender === 'Student' ? 'bg-secondary bg-opacity-25 align-self-end text-end' : 'bg-primary bg-opacity-10 border border-primary border-opacity-25 align-self-start'}`} style={{ maxWidth: '90%' }}>
                    <strong className={msg.sender === 'Student' ? 'text-white' : 'text-info'}>{msg.sender}: </strong>
                    <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeAssessment;