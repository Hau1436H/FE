// src/pages/dashboard/VirtualMentor.jsx
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import axiosClient from '../../api/axiosClient';

function VirtualMentor() {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // States mới cho UI giống Gemini
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  // 1. Sửa lại hàm fetchSessions (Dòng 27)
  // 1. Sửa lại hàm fetchSessions để có Console.log
  const fetchSessions = async () => {
    try {
      const response = await axiosClient.get('/api/v1/VirtualMentor/sessions');
      
      // 👉 IN RA CONSOLE ĐỂ BẮT BỆNH:
      console.log("1. Nguyên bản Response từ Backend:", response);

      // Cách bóc tách dữ liệu chống trượt mọi trường hợp:
      const responseData = response.data || response;
      const sessionList = responseData.data || responseData.Data || responseData || [];

      console.log("2. Danh sách Session lấy được:", sessionList);

      if (Array.isArray(sessionList)) {
        setSessions(sessionList);
        
        if (sessionList.length > 0 && !activeSessionId) {
          handleSelectSession(sessionList[0].sessionId || sessionList[0].SessionId);
        }
      } else {
        console.warn("Dữ liệu trả về không phải là mảng (Array)!", sessionList);
        setSessions([]);
      }

    } catch (error) {
      console.error("Lỗi tải danh sách session:", error);
    }
  };

  // 2. Sửa lại hàm handleSelectSession (Dòng 44)
  const handleSelectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    setIsLoadingHistory(true);
    setMessages([]);

    try {
      // SỬA Ở ĐÂY: Truyền biến ${sessionId} vào cuối URL
      const response = await axiosClient.get(`/api/v1/VirtualMentor/chat-history/${sessionId}`); 
      
      // SỬA Ở ĐÂY: Thêm chữ d viết thường
      const historyData = response.data.data || response.data.Data || [];
      
      if (historyData.length > 0) {
        const formattedHistory = historyData.map(msg => ({
          id: msg.messageId || msg.MessageId,
          sender: (msg.senderType || msg.SenderType).toLowerCase() === 'student' ? 'user' : 'ai',
          text: msg.messageText || msg.MessageText,
          time: new Date(msg.sentAt || msg.SentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(formattedHistory);
      }
    } catch (error) {
      console.error("Lỗi tải lịch sử chat:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 3. Xử lý nút "Đoạn chat mới"
  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([{
      id: 'welcome-msg',
      sender: 'ai',
      text: 'Xin chào! Mình là AI Career Mentor. Mình có thể giúp gì cho định hướng nghề nghiệp IT của bạn hôm nay?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  // 4. Xử lý gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiTyping) return;

    const userText = chatInput;
    setChatInput('');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setIsAiTyping(true);

    try {
      const payload = {
        sessionId: activeSessionId, // Gửi ID lên. Nếu null, Backend sẽ tạo Session mới
        userMessage: userText
      };

      const response = await axiosClient.post('/api/v1/VirtualMentor/chat', payload);
      const aiText = response.data.aiResponse || response.data.AiResponse;
      const returnedSessionId = response.data.sessionId || response.data.SessionId;

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Nếu đây là chat mới, Backend sẽ trả về ID mới. Ta cập nhật lại danh sách Sidebar
      if (!activeSessionId && returnedSessionId) {
        setActiveSessionId(returnedSessionId);
        fetchSessions(); // Refresh lại Sidebar để hiện tên cuộc trò chuyện mới
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `❌ Lỗi kết nối: ${error.response?.data?.Error || error.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#020205', color: '#e3e4ed', fontFamily: 'system-ui' }}>
      <Sidebar />

      {/* Main Container chia 2 cột */}
      <div className="d-flex flex-grow-1 h-100 overflow-hidden p-3 gap-3" style={{ backgroundColor: '#07080f' }}>
        
        {/* CỘT 1: Lịch sử Chat (Clone UI của Gemini/ChatGPT) */}
        <div className="d-flex flex-column rounded-4 border border-secondary border-opacity-10 overflow-hidden flex-shrink-0" 
             style={{ backgroundColor: '#0b0c16', width: '280px' }}>
          
          <div className="p-3 border-bottom border-secondary border-opacity-10">
            <button 
              onClick={handleNewChat}
              className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill py-2"
              style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              <span className="fs-5">+</span> Đoạn chat mới
            </button>
          </div>

          <div className="flex-grow-1 overflow-auto p-2 custom-scrollbar">
            <div className="small text-white-50 px-3 mb-2 mt-2 fw-semibold" style={{ fontSize: '0.75rem' }}>GẦN ĐÂY</div>
            
            <ul className="nav nav-pills flex-column gap-1">
              {sessions.length === 0 && <div className="text-center text-white-50 small mt-3">Chưa có lịch sử</div>}
              
              {sessions.map(session => (
                <li key={session.sessionId}>
                  <button 
                    onClick={() => handleSelectSession(session.sessionId)}
                    className={`nav-link w-100 text-start text-truncate px-3 py-2 rounded-3 border-0 small ${
                      activeSessionId === session.sessionId ? 'bg-secondary bg-opacity-25 text-white fw-medium' : 'bg-transparent text-white-50'
                    }`}
                    style={{ fontSize: '0.85rem' }}
                  >
                    💬 {session.title || "Cuộc trò chuyện mới"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CỘT 2: Khu vực Chat chính */}
        <div className="d-flex flex-column flex-grow-1 h-100 rounded-4 border border-secondary border-opacity-10 overflow-hidden" 
             style={{ backgroundColor: '#0b0c16' }}>
          
          {/* Header Phòng Tư vấn */}
          <div className="px-4 py-3 border-bottom border-secondary border-opacity-10 d-flex align-items-center gap-3">
            <div className="rounded-circle bg-success d-flex align-items-center justify-content-center fs-5" style={{ width: '42px', height: '42px' }}>
              ✨
            </div>
            <div>
              <h6 className="mb-0 text-white fw-bold">Trợ lý Cố vấn Công nghệ (AI)</h6>
              <span className="text-success small d-flex align-items-center gap-1">
                <span className="spinner-grow bg-success" style={{width: '6px', height: '6px'}}></span> 
                Sẵn sàng
              </span>
            </div>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
            {isLoadingHistory ? (
              <div className="d-flex h-100 align-items-center justify-content-center flex-column gap-3 text-white-50">
                <div className="spinner-border text-success" role="status"></div>
                <span>Đang tải lịch sử...</span>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`d-flex flex-column ${msg.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                  <div className="p-3 rounded-4 shadow-sm" style={{ 
                    maxWidth: '80%', 
                    backgroundColor: msg.sender === 'user' ? '#198754' : '#1e1e24', 
                    color: '#e3e4ed', 
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px'
                  }}>
                    {msg.text}
                  </div>
                  <span className="text-secondary mt-1" style={{ fontSize: '0.7rem' }}>{msg.time}</span>
                </div>
              ))
            )}
            
            {isAiTyping && (
              <div className="d-flex align-items-start">
                <div className="p-3 rounded-4" style={{ backgroundColor: '#1e1e24', borderBottomLeftRadius: '4px' }}>
                  <span className="spinner-grow spinner-grow-sm text-success me-1" style={{ width: '0.5rem', height: '0.5rem' }}></span>
                  <span className="spinner-grow spinner-grow-sm text-success me-1" style={{ width: '0.5rem', height: '0.5rem', animationDelay: '0.2s' }}></span>
                  <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '0.5rem', height: '0.5rem', animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Khu vực nhập liệu */}
          <div className="p-4 border-top border-secondary border-opacity-10" style={{ backgroundColor: '#07080f' }}>
            <form onSubmit={handleSendMessage} className="d-flex gap-2 mx-auto" style={{ maxWidth: '800px' }}>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary border-opacity-25 text-white py-3 px-4 rounded-pill shadow-sm" 
                placeholder="Nhập câu hỏi để bắt đầu thảo luận..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                disabled={isAiTyping || isLoadingHistory}
              />
              <button 
                type="submit" 
                className="btn btn-success rounded-pill px-4 shadow-sm d-flex align-items-center justify-content-center" 
                disabled={isAiTyping || isLoadingHistory || !chatInput.trim()}
                style={{ width: '60px' }}
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default VirtualMentor;