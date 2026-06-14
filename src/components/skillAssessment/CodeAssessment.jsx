// src/components/skillAssessment/CodeAssessment.jsx
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axiosClient from '../../api/axiosClient';

function CodeAssessment({ skillNodeId, onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isAskingAi, setIsAskingAi] = useState(false);
  
  const [output, setOutput] = useState('');
  const [aiChat, setAiChat] = useState([]);

  // Hàm lấy StudentId từ Token JWT (đã có trong payload JWT của bạn)
  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Ưu tiên lấy theo key "StudentId" đã thêm vào Claim trong C#
      return payload.StudentId || payload.studentId || payload.sub;
    } catch (e) {
      return null;
    }
  };

  const [code, setCode] = useState(`using System;

public class Solution {
    public static void Main() {
        Console.WriteLine("Hello TechCompass!");
    }
}`);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Đang biên dịch code...');
    try {
      const payload = { language: "csharp", sourceCode: code, stdin: "" };
      const response = await axiosClient.post('/api/v1/PracticeWorkspace/run-code', payload);
      setOutput(response.data.data.output);
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
    setAiChat(prev => [...prev, { sender: 'Student', text: 'Hãy cho tôi một gợi ý để tối ưu đoạn code này.' }]);
    
    try {
      const payload = {
        studentId: studentId,
        problemDescription: "Tối ưu hóa thuật toán C#",
        currentCode: code,
        userMessage: "Hãy cho tôi một gợi ý để tối ưu đoạn code này."
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
      const payload = {
        studentId: studentId,
        skillNodeId: skillNodeId,
        language: "csharp",
        sourceCode: code
      };
      const response = await axiosClient.post('/api/assessments/submit-code', payload);
      if (onComplete) {
        onComplete(response.data.score, 1, response.data.aiReview);
      }
    } catch (error) {
      alert("Lỗi khi nộp bài!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row g-3 text-white">
      <div className="col-lg-8">
        <div className="card border-secondary border-opacity-25 p-0 overflow-hidden h-100" style={{ backgroundColor: '#0b0c16' }}>
          <div className="bg-dark bg-opacity-50 p-2 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
            <span className="fw-bold ms-2">💻 Không gian thực hành (C#)</span>
            <button className="btn btn-sm btn-outline-warning" onClick={handleAskAi} disabled={isAskingAi}>
              {isAskingAi ? '🤖 AI Đang gõ...' : '🤖 Xin gợi ý từ AI'}
            </button>
          </div>
          
          <div style={{ height: '400px' }}>
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

      <div className="col-lg-4">
        <div className="card border-secondary border-opacity-25 p-0 h-100 d-flex flex-column" style={{ backgroundColor: '#0b0c16' }}>
          <div className="p-3 border-bottom border-secondary border-opacity-25" style={{ minHeight: '150px' }}>
            <h6 className="text-success fw-bold font-monospace mb-2">Terminal Output</h6>
            <pre className="text-white-50 small mb-0" style={{ whiteSpace: 'pre-wrap' }}>{output || "Chưa có kết quả chạy code..."}</pre>
          </div>

          <div className="p-3 flex-grow-1 overflow-auto">
            <h6 className="text-info fw-bold mb-3">💬 AI Tutor Chat</h6>
            {aiChat.length === 0 ? <p className="text-white-50 small">Hãy bấm "Xin gợi ý từ AI" để bắt đầu.</p> : (
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