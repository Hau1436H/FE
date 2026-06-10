// .\src\pages\dashboard\PracticeWorkspace.jsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import Sidebar from '../../components/dashboard/Sidebar';

function PracticeWorkspace() {
  const [language, setLanguage] = useState('javascript');
  const [consoleLogs, setConsoleLogs] = useState([]); 
  const [activeConsoleTab, setActiveConsoleTab] = useState('console'); 
  const [isRunning, setIsRunning] = useState(false);

  const [code, setCode] = useState(`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Viết code của bạn ở đây và return kết quả
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
};`);

  const testCases = [
    { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
    { nums: [3, 2, 4], target: 6, expected: [1, 2] },
    { nums: [3, 3], target: 6, expected: [0, 1] }
  ];

  const handleRunCode = () => {
    setIsRunning(true);
    setActiveConsoleTab('results'); 
    const logs = [];

    if (language !== 'javascript') {
      setConsoleLogs([`⚠️ Hiện tại trình chạy code Client-side chỉ hỗ trợ JavaScript. Python/TypeScript cần API Backend trong tương lai.`]);
      setIsRunning(false);
      return;
    }

    try {
      const runnerScript = `
        ${code}
        return twoSum(nums, target);
      `;
      
      const runUserCode = new Function('nums', 'target', runnerScript);

      testCases.forEach((tc, index) => {
        try {
          const userResult = runUserCode(tc.nums, tc.target);
          const isCorrect = JSON.stringify(userResult) === JSON.stringify(tc.expected);
          
          logs.push(
            `▶️ Test Case ${index + 1}: nums = [${tc.nums.join(', ')}], target = ${tc.target}\n` +
            `   • Kết quả của bạn: ${JSON.stringify(userResult)}\n` +
            `   • Kết quả mong đợi: ${JSON.stringify(tc.expected)}\n` +
            `   ➔ Trạng thái: ${isCorrect ? '✅ ĐÚNG (Passed)' : '❌ SAI (Failed)'}`
          );
        } catch (err) {
          logs.push(`❌ Test Case ${index + 1}: Bị lỗi runtime - ${err.message}`);
        }
      });

      setConsoleLogs(logs);
    } catch (error) {
      setConsoleLogs([`🚨 Lỗi cú pháp (Syntax Error):\n${error.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Xin chào! Mình là AI Tutor. Mình đang xem bài "Two Sum" cùng bạn. Bạn có thể hỏi mình về thuật toán, gợi ý cách tiếp cận hoặc debug code nhé!',
      time: '13:53'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput('');
  };

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#020205', color: '#e3e4ed', fontFamily: 'system-ui' }}>
      
      {/* ==================== THANH SIDEBAR BÊN TRÁI (ĐÃ TỐI ƯU TRÀN VIỀN) ==================== */}
      <Sidebar />

      {/* ==================== VÙNG WORKSPACE CHÍNH BÊN PHẢI ==================== */}
      <div className="d-flex flex-column flex-grow-1 h-100 overflow-hidden" style={{ backgroundColor: '#07080f' }}>
        
        {/* 1. Sub-Header (Thanh công cụ phía trên) */}
        <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom border-secondary border-opacity-10" style={{ backgroundColor: '#0b0c16', height: '50px' }}>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-bold text-white fs-6">Two Sum</span>
            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 font-monospace" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Easy</span>
            <span className="text-white-50 small">49.3% accepted</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-dark text-white-50 border border-secondary border-opacity-25 font-monospace" style={{ fontSize: '0.8rem' }} onClick={() => setConsoleLogs([])}>Xóa Logs</button>
            <button 
              className="btn btn-sm btn-dark text-white-50 border border-secondary border-opacity-25 font-monospace" 
              style={{ fontSize: '0.8rem' }}
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? 'Đang chạy...' : 'Chạy'}
            </button>
            <button className="btn btn-sm btn-success px-3 fw-medium font-monospace shadow-sm" style={{ backgroundColor: '#198754', borderColor: '#198754', fontSize: '0.8rem' }}>Nộp bài</button>
          </div>
        </div>

        {/* 2. Layout 3 Cột Workspace (Thêm khoảng cách đệm p-2 để tạo cảm giác các khối nổi) */}
        <div className="d-flex flex-grow-1 overflow-hidden p-2 gap-2">
          
          {/* CỘT 1: Đề bài (Bo góc nhẹ, màu nền tương phản tinh tế) */}
          <div className="col-3 d-flex flex-column h-100 overflow-auto p-4 rounded-3 border border-secondary border-opacity-10" style={{ backgroundColor: '#0b0c16' }}>
            <div className="d-flex gap-3 mb-3 border-bottom border-secondary border-opacity-10 pb-2">
              <span className="text-white fw-medium pb-2 border-bottom border-success border-2 small" style={{ cursor: 'pointer' }}>Mô tả</span>
            </div>
            <p className="small lh-base text-white-50 mb-4">
              Cho một mảng số nguyên <code className="text-warning bg-dark px-1 rounded">nums</code> và một số nguyên <code className="text-warning bg-dark px-1 rounded">target</code>, trả về chỉ số của hai số sao cho chúng cộng lại bằng <code className="text-warning bg-dark px-1 rounded">target</code>.
            </p>
            <div className="mb-4">
              <h6 className="text-white fw-bold small mb-2">Ví dụ 1:</h6>
              <div className="p-3 rounded-3 border border-secondary border-opacity-10 font-monospace" style={{ backgroundColor: '#07080f', fontSize: '0.8rem' }}>
                <div className="text-white-50"><span className="text-secondary">Input:</span> nums = [2,7,11,15], target = 9</div>
                <div className="text-success mt-1"><span className="text-secondary">Output:</span> [0,1]</div>
              </div>
            </div>
          </div>

          {/* CỘT 2: Monaco Editor & Console (Bọc chung vào 1 khối bo góc liền mạch) */}
          <div className="col-6 d-flex flex-column h-100 rounded-3 border border-secondary border-opacity-10 overflow-hidden" style={{ backgroundColor: '#0b0c16' }}>
            
            {/* Tab chọn ngôn ngữ */}
            <div className="px-3 py-1.5 border-bottom border-secondary border-opacity-10 d-flex gap-1" style={{ backgroundColor: '#0b0c16' }}>
              {['JavaScript', 'TypeScript', 'Python'].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang.toLowerCase())}
                  className={`btn btn-sm font-monospace px-2.5 py-1 ${language === lang.toLowerCase() ? 'bg-secondary bg-opacity-25 text-white fw-medium' : 'text-white-50'}`}
                  style={{ fontSize: '0.75rem', border: 'none' }}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Vùng code chính */}
            <div className="flex-grow-1 overflow-hidden" style={{ backgroundColor: '#1e1e1e' }}>
              <Editor
                height="100%"
                theme="vs-dark"
                language={language === 'python' ? 'python' : 'javascript'}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 13,
                  fontFamily: 'Fira Code, monospace',
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  padding: { top: 12, bottom: 12 },
                  backgroundColor: '#0b0c16'
                }}
              />
            </div>

            {/* Khung Console kết quả */}
            <div className="border-top border-secondary border-opacity-10 d-flex flex-column" style={{ height: '220px', backgroundColor: '#07080f' }}>
              <div className="px-3 py-2 border-bottom border-secondary border-opacity-10 d-flex gap-3 text-white-50 font-monospace" style={{ fontSize: '0.75rem', backgroundColor: '#0b0c16' }}>
                <span className={`${activeConsoleTab === 'console' ? 'text-success border-bottom border-success pb-1 fw-medium' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setActiveConsoleTab('console')}>Console</span>
                <span className={`${activeConsoleTab === 'results' ? 'text-success border-bottom border-success pb-1 fw-medium' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setActiveConsoleTab('results')}>Test Results ({consoleLogs.length})</span>
              </div>
              
              <div className="p-3 font-monospace small flex-grow-1 overflow-auto text-white-50" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {activeConsoleTab === 'console' && (
                  <div className="text-secondary">// Trình biên dịch JavaScript Sandbox sẵn sàng. Viết code và ấn "Chạy".</div>
                )}
                {activeConsoleTab === 'results' && (
                  consoleLogs.length === 0 
                    ? <div className="text-secondary">// Chưa có kết quả chạy. Nhấn nút "Chạy" để quét mã nguồn.</div>
                    : consoleLogs.map((log, idx) => (
                        <div key={idx} className="mb-2 p-2 rounded bg-dark bg-opacity-40 border border-secondary border-opacity-10" style={{ fontSize: '0.78rem' }}>{log}</div>
                      ))
                )}
              </div>
            </div>
          </div>

          {/* CỘT 3: AI Tutor Chatbot (Bo góc độc lập, tinh tế) */}
          <div className="col-3 d-flex flex-column h-100 rounded-3 border border-secondary border-opacity-10 overflow-hidden" style={{ backgroundColor: '#0b0c16' }}>
            <div className="px-3 py-2.5 border-bottom border-secondary border-opacity-10 d-flex align-items-center gap-2">
              <div className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></div>
              <span className="fw-semibold text-white small">AI Tutor</span>
            </div>

            {/* Nội dung khung Chat */}
            <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`d-flex flex-column ${msg.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                  <div className="p-2.5 rounded-3 small lh-base" style={{ maxWidth: '90%', backgroundColor: msg.sender === 'user' ? '#198754' : '#111324', color: '#e3e4ed', fontSize: '0.8rem' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Khung gợi ý nhanh (Quick Actions) */}
            <div className="px-2 pt-2 d-flex flex-wrap gap-1 border-top border-secondary border-opacity-10 py-2 justify-content-center" style={{ backgroundColor: '#07080f' }}>
              {['Gợi ý', 'Cách giải', 'Debug', 'Big-O'].map((action) => (
                <button 
                  key={action}
                  onClick={() => setChatInput(`Hãy giải thích về: ${action}`)}
                  className="btn btn-xs btn-dark text-white-50 border border-secondary border-opacity-25 font-monospace py-1 px-2" 
                  style={{ fontSize: '0.65rem', borderRadius: '4px' }}
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Form nhập nội dung chat */}
            <form onSubmit={handleSendMessage} className="p-2 border-top border-secondary border-opacity-10 d-flex gap-1.5" style={{ backgroundColor: '#0b0c16' }}>
              <input type="text" className="form-control form-control-sm bg-dark border-secondary border-opacity-25 text-white font-monospace py-1.5 px-2" style={{ fontSize: '0.75rem' }} placeholder="Hỏi AI..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
              <button type="submit" className="btn btn-sm btn-success px-2.5" style={{ backgroundColor: '#198754', borderColor: '#198754', fontSize: '0.75rem' }}>Gửi</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PracticeWorkspace;