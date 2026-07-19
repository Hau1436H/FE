// src/pages/dashboard/PracticeWorkspace.jsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import Sidebar from '../../components/dashboard/Sidebar';
import axiosClient from '../../api/axiosClient';

const SUPPORTED_LANGUAGES = [
  { id: 'csharp', label: 'C# (.NET Core)', ext: 'cs' },
  { id: 'javascript', label: 'JavaScript (Node.js)', ext: 'js' },
  { id: 'python', label: 'Python 3', ext: 'py' },
  { id: 'java', label: 'Java', ext: 'java' },
  { id: 'cpp', label: 'C++', ext: 'cpp' }
];

function PracticeWorkspace() {
  // ================= LẤY ID HỌC VIÊN AN TOÀN =================
  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
          base64 += '=';
      }
      
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );

      const payload = JSON.parse(jsonPayload);
      return payload.studentId || payload.StudentId || payload.sub;
    } catch (e) { 
      console.error("Lỗi parse token trong Workspace:", e);
      return null; 
    }
  };

  // ================= QUẢN LÝ TAB FILE CODE =================
  const [tabs, setTabs] = useState([
    { id: 1, name: 'Program.cs', language: 'csharp', code: '' } 
  ]);
  const [activeTabId, setActiveTabId] = useState(1);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleAddTab = () => {
    const newId = Date.now();
    setTabs([...tabs, { id: newId, name: `untitled-${tabs.length + 1}.cs`, language: 'csharp', code: '' }]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (e, id) => {
    e.stopPropagation();
    if (tabs.length === 1) return; 
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) setActiveTabId(newTabs[newTabs.length - 1].id);
  };

  const handleCodeChange = (value) => {
    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, code: value || '' } : t));
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.id === newLang);
    
    setTabs(tabs.map(t => {
      if (t.id === activeTabId) {
        // Tự động đổi đuôi file khi đổi ngôn ngữ (nếu tên file đang là mặc định)
        let newName = t.name;
        if (newName.startsWith('untitled-') || newName.startsWith('Program') || newName.startsWith('main')) {
            newName = newLang === 'csharp' ? 'Program.cs' : newLang === 'java' ? 'Main.java' : `main.${langInfo.ext}`;
        }
        return { ...t, language: newLang, name: newName };
      }
      return t;
    }));
  };

  // ================= CÁC STATE KHÁC =================
  const [consoleLogs, setConsoleLogs] = useState([]); 
  const [activeConsoleTab, setActiveConsoleTab] = useState('console'); 
  const [isRunning, setIsRunning] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  
  // STATE MỚI: Quản lý dữ liệu đầu vào (stdin)
  const [stdin, setStdin] = useState('');

  // ================= TÍCH HỢP API RUN CODE =================
  const handleRunCode = async () => {
    if (!activeTab.code.trim()) {
      setActiveConsoleTab('results');
      setConsoleLogs(['⚠️ Khung code đang trống. Vui lòng viết code trước khi chạy!']);
      return;
    }

    setIsRunning(true);
    setActiveConsoleTab('results'); 
    setConsoleLogs(['🔄 Đang biên dịch và chạy code trên Server...']);

    try {
      const payload = {
        language: activeTab.language,
        sourceCode: activeTab.code,
        stdin: stdin // Truyền dữ liệu đầu vào thực tế
      };

      const response = await axiosClient.post('/api/v1/PracticeWorkspace/run-code', payload);
      const resultData = response.data.data || response.data.Data || response.data; 
      
      if (resultData?.isError || resultData?.IsError) {
        setConsoleLogs([`❌ Lỗi thực thi:\n${resultData?.output || resultData?.Output}`]);
      } else {
        setConsoleLogs([`✅ Output:\n${resultData?.output || resultData?.Output}`]);
      }
    } catch (error) {
      setConsoleLogs([`🚨 Lỗi kết nối Server:\n${error.response?.data?.Error || error.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  // ================= TÍCH HỢP API AI TUTOR =================
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Xin chào! Mình là AI Tutor. Hãy nhập mô tả bài toán của bạn ở cột bên trái và viết code. Mình sẽ dựa vào đó để hỗ trợ bạn!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isAiTyping) return;

    const studentId = getStudentId();
    if (!studentId) {
      alert("Không tìm thấy thông tin đăng nhập. Vui lòng tải lại trang!");
      return;
    }

    const userText = chatInput;
    setChatInput('');
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsAiTyping(true);

    try {
      const payload = {
        studentId: studentId,
        problemDescription: problemDescription.trim() !== '' ? problemDescription : "Người dùng chưa cung cấp mô tả bài toán cụ thể.",
        currentCode: activeTab.code,
        userMessage: userText
      };

      const response = await axiosClient.post('/api/v1/PracticeWorkspace/ai-tutor', payload);
      const aiText = response.data.aiResponse || response.data.AiResponse || response.data;

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: `❌ Lỗi kết nối AI: ${error.response?.data?.Error || error.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    setChatInput(`Hãy giúp mình: ${action}`);
    // Đợi React cập nhật state chatInput xong rồi tự submit
    setTimeout(() => {
        document.getElementById('ai-chat-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#020205', color: '#e3e4ed', fontFamily: 'system-ui' }}>
      
      <Sidebar />

      <div className="d-flex flex-column flex-grow-1 h-100 overflow-hidden" style={{ backgroundColor: '#07080f' }}>
        
        {/* Sub-Header */}
        <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom border-secondary border-opacity-10" style={{ backgroundColor: '#0b0c16', height: '55px' }}>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-bold text-white fs-6">Môi trường tự do</span>
            <span className="badge bg-secondary bg-opacity-25 text-white-50 border border-secondary border-opacity-20 font-monospace" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Sandbox</span>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            {/* BỘ CHỌN NGÔN NGỮ MỚI */}
            <div className="d-flex align-items-center gap-2">
                <span className="text-white-50 small">Ngôn ngữ:</span>
                <select 
                    className="form-select form-select-sm bg-dark text-white border-secondary border-opacity-50 font-monospace"
                    style={{ width: '180px', fontSize: '0.8rem' }}
                    value={activeTab.language}
                    onChange={handleLanguageChange}
                >
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.label}</option>
                    ))}
                </select>
            </div>

            <div className="vr bg-secondary opacity-25 mx-1" style={{ height: '20px' }}></div>

            <button className="btn btn-sm btn-dark text-white-50 border border-secondary border-opacity-25 font-monospace" style={{ fontSize: '0.8rem' }} onClick={() => setConsoleLogs([])}>
              Xóa Logs
            </button>
            <button 
              className="btn btn-sm btn-success text-white fw-bold font-monospace d-flex align-items-center gap-2" 
              style={{ fontSize: '0.85rem' }}
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-play-fill fs-6"></i>}
              {isRunning ? 'Đang chạy...' : 'Run Code'}
            </button>
          </div>
        </div>

        {/* Layout 3 Cột Workspace */}
        <div className="d-flex flex-grow-1 overflow-hidden p-2 gap-2">
          
          {/* CỘT 1: Nhập Mô tả bài toán */}
          <div className="col-3 d-flex flex-column h-100 p-4 rounded-3 border border-secondary border-opacity-10" style={{ backgroundColor: '#0b0c16' }}>
            <div className="d-flex gap-3 mb-3 border-bottom border-secondary border-opacity-10 pb-2">
              <span className="text-white fw-medium pb-2 border-bottom border-success border-2 small">Mô tả bài toán</span>
            </div>
            <p className="text-white-50 small mb-2">Nhập yêu cầu bài toán để AI Tutor có thể hiểu và hỗ trợ bạn tốt nhất:</p>
            <textarea
              className="form-control bg-dark border-secondary border-opacity-25 text-white flex-grow-1 p-3 custom-scrollbar"
              style={{ fontSize: '0.85rem', resize: 'none', backgroundColor: '#07080f' }}
              placeholder="Ví dụ: Viết API ASP.NET Core lấy danh sách người dùng..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
            ></textarea>
          </div>

          {/* CỘT 2: Monaco Editor & Console */}
          <div className="col-6 d-flex flex-column h-100 rounded-3 border border-secondary border-opacity-10 overflow-hidden" style={{ backgroundColor: '#0b0c16' }}>
            
            {/* HỆ THỐNG FILE TABS */}
            <div className="px-2 pt-2 border-bottom border-secondary border-opacity-10 d-flex gap-1" style={{ backgroundColor: '#07080f' }}>
              {tabs.map(tab => (
                <div 
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-3 py-1.5 d-flex align-items-center gap-2 font-monospace ${activeTabId === tab.id ? 'bg-secondary bg-opacity-25 text-white border-top border-success border-2' : 'text-white-50 bg-dark border-top border-dark border-2'}`}
                  style={{ fontSize: '0.75rem', cursor: 'pointer', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', userSelect: 'none' }}
                >
                  {tab.name}
                  {tabs.length > 1 && (
                    <span 
                      onClick={(e) => handleCloseTab(e, tab.id)} 
                      className="text-secondary ms-2 px-1 rounded hover-bg-secondary" 
                      style={{ fontSize: '1rem', lineHeight: '1' }}
                    >
                      &times;
                    </span>
                  )}
                </div>
              ))}
              <button 
                className="btn btn-sm btn-dark text-white-50 py-1 px-2 border-0 ms-1" 
                onClick={handleAddTab}
                style={{ fontSize: '1rem', lineHeight: '1' }}
              >
                +
              </button>
            </div>

            <div className="flex-grow-1 overflow-hidden" style={{ backgroundColor: '#1e1e1e' }}>
              <Editor
                height="100%"
                theme="vs-dark"
                language={activeTab.language} 
                value={activeTab.code}        
                onChange={handleCodeChange}   
                options={{
                  fontSize: 14,
                  fontFamily: 'Fira Code, monospace',
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 12 },
                  backgroundColor: '#0b0c16',
                  renderLineHighlight: 'all',
                  scrollBeyondLastLine: false
                }}
              />
            </div>

            <div className="border-top border-secondary border-opacity-10 d-flex flex-column" style={{ height: '220px', backgroundColor: '#07080f' }}>
              <div className="px-3 py-2 border-bottom border-secondary border-opacity-10 d-flex gap-3 text-white-50 font-monospace" style={{ fontSize: '0.75rem', backgroundColor: '#0b0c16' }}>
                <span className={`${activeConsoleTab === 'console' ? 'text-success border-bottom border-success pb-1 fw-medium' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setActiveConsoleTab('console')}>Console</span>
                
                {/* TAB INPUT MỚI */}
                <span className={`${activeConsoleTab === 'input' ? 'text-success border-bottom border-success pb-1 fw-medium' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setActiveConsoleTab('input')}>Input (stdin)</span>
                
                <span className={`${activeConsoleTab === 'results' ? 'text-success border-bottom border-success pb-1 fw-medium' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setActiveConsoleTab('results')}>Test Results</span>
              </div>
              
              <div className="p-3 font-monospace small flex-grow-1 overflow-auto text-white-50" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {activeConsoleTab === 'console' && (
                  <div className="text-secondary">// Trình biên dịch: Sẵn sàng thực thi mã {SUPPORTED_LANGUAGES.find(l => l.id === activeTab.language)?.label}.</div>
                )}
                
                {/* TEXTAREA ĐỂ NHẬP INPUT */}
                {activeConsoleTab === 'input' && (
                  <textarea
                    className="form-control bg-dark text-white border-secondary border-opacity-25 w-100 h-100 custom-scrollbar"
                    placeholder="Nhập các giá trị đầu vào (mỗi giá trị 1 dòng hoặc cách nhau bằng dấu cách) TRƯỚC KHI bấm Run Code..."
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    style={{ resize: 'none', fontSize: '0.8rem' }}
                  ></textarea>
                )}

                {activeConsoleTab === 'results' && (
                  consoleLogs.length === 0 
                    ? <div className="text-secondary">// Nhấn nút "Run Code" để xem kết quả biên dịch.</div>
                    : consoleLogs.map((log, idx) => (
                        <div key={idx} className={`mb-2 p-2 rounded bg-dark border border-secondary border-opacity-10 ${log.includes('❌') || log.includes('🚨') ? 'text-danger bg-opacity-10 border-danger' : 'text-success bg-opacity-40'}`} style={{ fontSize: '0.78rem' }}>{log}</div>
                      ))
                )}
              </div>
            </div>
          </div>

          {/* CỘT 3: AI Tutor Chatbot */}
          <div className="col-3 d-flex flex-column h-100 rounded-3 border border-secondary border-opacity-10 overflow-hidden" style={{ backgroundColor: '#0b0c16' }}>
            <div className="px-3 py-2.5 border-bottom border-secondary border-opacity-10 d-flex align-items-center gap-2">
              <div className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></div>
              <span className="fw-semibold text-white small">AI Tutor</span>
              {isAiTyping && <span className="spinner-grow spinner-grow-sm text-success ms-auto" style={{ width: '0.7rem', height: '0.7rem' }}></span>}
            </div>

            <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`d-flex flex-column ${msg.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                  <div className="p-2.5 rounded-3 small lh-base" style={{ maxWidth: '90%', backgroundColor: msg.sender === 'user' ? '#198754' : '#111324', color: '#e3e4ed', fontSize: '0.85rem' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-2 pt-2 d-flex flex-wrap gap-1 border-top border-secondary border-opacity-10 py-2 justify-content-center" style={{ backgroundColor: '#07080f' }}>
              {['Gợi ý Logic', 'Debug Code', 'Đánh giá Big-O'].map((action) => (
                <button 
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  className="btn btn-xs btn-dark text-white-50 border border-secondary border-opacity-25 font-monospace py-1 px-2 hover-bg-secondary" 
                  style={{ fontSize: '0.65rem', borderRadius: '4px' }}
                >
                  {action}
                </button>
              ))}
            </div>

            <form id="ai-chat-form" onSubmit={handleSendMessage} className="p-2 border-top border-secondary border-opacity-10 d-flex gap-1.5" style={{ backgroundColor: '#0b0c16' }}>
              <input 
                type="text" 
                className="form-control form-control-sm bg-dark border-secondary border-opacity-25 text-white font-monospace py-1.5 px-2" 
                style={{ fontSize: '0.75rem' }} 
                placeholder="Hỏi AI..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                disabled={isAiTyping}
              />
              <button type="submit" className="btn btn-sm btn-success px-2.5 d-flex align-items-center" style={{ backgroundColor: '#198754', borderColor: '#198754', fontSize: '0.75rem' }} disabled={isAiTyping}>
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PracticeWorkspace;