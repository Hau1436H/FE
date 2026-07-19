// src/pages/dashboard/VirtualMentor.jsx
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Sidebar from '../../components/dashboard/Sidebar';
import axiosClient from '../../api/axiosClient';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function VirtualMentor() {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [connection, setConnection] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  // KẾT NỐI SIGNALR
  useEffect(() => {
    const connectSignalR = async () => {
      try {
        const newConnection = new HubConnectionBuilder()
          .withUrl("https://localhost:7196/hubs/virtualMentor", { 
            accessTokenFactory: () => localStorage.getItem('token') 
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        // Lắng nghe AI trả về từng cụm từ (chunk)
        newConnection.on("ReceiveMessageChunk", (chunk) => {
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.sender === 'ai' && lastMsg.isStreaming) {
              const updatedMessages = [...prev];
              updatedMessages[updatedMessages.length - 1].text += chunk;
              return updatedMessages;
            } else {
              return [...prev, {
                id: Date.now().toString(),
                sender: 'ai',
                text: chunk,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isStreaming: true
              }];
            }
          });
        });

        // Lắng nghe tín hiệu kết thúc câu trả lời
        newConnection.on("EndMessageChunk", () => {
          setIsAiTyping(false);
          setMessages(prev => {
            const updatedMessages = [...prev];
            if (updatedMessages.length > 0) {
              updatedMessages[updatedMessages.length - 1].isStreaming = false;
            }
            return updatedMessages;
          });
        });

        await newConnection.start();
        console.log("Đã kết nối SignalR - Virtual Mentor Hub");
        setConnection(newConnection);
      } catch (error) {
        console.error("Lỗi kết nối SignalR:", error);
      }
    };

    connectSignalR();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Truyền cờ true để báo hiệu đây là lần load đầu tiên
  useEffect(() => {
    fetchSessions(true);
  }, []);

  const fetchSessions = async (isInitialLoad = false) => {
    try {
      const response = await axiosClient.get('/api/v1/VirtualMentor/sessions');
      const responseData = response.data || response;
      const sessionList = responseData.data || responseData.Data || responseData || [];

      if (Array.isArray(sessionList)) {
        setSessions(sessionList);
        // FIX: Mở ô trò chuyện mới thay vì tự động load lịch sử cũ khi vừa vào trang
        if (isInitialLoad) {
          handleNewChat();
        }
      } else {
        console.warn("Dữ liệu trả về không phải là mảng (Array)!", sessionList);
        setSessions([]);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách session:", error);
    }
  };

  const handleSelectSession = async (sessionId) => {
    if (connection && activeSessionId) {
      await connection.invoke("LeaveChatSession", activeSessionId.toString());
    }

    setActiveSessionId(sessionId);
    setIsLoadingHistory(true);
    setMessages([]);

    if (connection && sessionId) {
      await connection.invoke("JoinChatSession", sessionId.toString());
    }

    try {
      const response = await axiosClient.get(`/api/v1/VirtualMentor/chat-history/${sessionId}`); 
      const historyData = response.data.data || response.data.Data || [];
      
      if (historyData.length > 0) {
        const formattedHistory = historyData.map(msg => ({
          id: msg.messageId || msg.MessageId,
          sender: (msg.senderType || msg.SenderType).toLowerCase() === 'student' ? 'user' : 'ai',
          text: msg.messageText || msg.MessageText,
          time: new Date(msg.sentAt || msg.SentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: false
        }));
        setMessages(formattedHistory);
      }
    } catch (error) {
      console.error("Lỗi tải lịch sử chat:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([{
      id: 'welcome-msg',
      sender: 'ai',
      text: 'Xin chào! Mình là AI Career Mentor. Mình có thể giúp gì cho định hướng nghề nghiệp IT của bạn hôm nay?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: false
    }]);
  };

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
        sessionId: activeSessionId,
        userMessage: userText
      };

      const response = await axiosClient.post('/api/v1/VirtualMentor/chat', payload);
      const returnedSessionId = response.data?.sessionId || response.data?.SessionId;

      if (!activeSessionId && returnedSessionId) {
        setActiveSessionId(returnedSessionId);
        if (connection) {
           await connection.invoke("JoinChatSession", returnedSessionId.toString());
        }
        fetchSessions(); 
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `❌ Lỗi kết nối: ${error.response?.data?.Error || error.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: false
      }]);
    } finally {
      // Đảm bảo cờ Typing được tắt nếu request bị lỗi hoặc backend response full mà không gọi EndMessageChunk
      setIsAiTyping(false); 
    }
  };

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#020205', color: '#e3e4ed', fontFamily: 'system-ui' }}>
      
      {/* CSS Nhúng cho hiệu ứng con trỏ nhấp nháy */}
      <style>
        {`
          @keyframes blinkCursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .cursor-blink {
            display: inline-block;
            width: 8px;
            height: 15px;
            background-color: #198754;
            animation: blinkCursor 0.8s step-end infinite;
            vertical-align: text-bottom;
            margin-left: 2px;
          }
        `}
      </style>

      <Sidebar />

      <div className="d-flex flex-grow-1 h-100 overflow-hidden p-3 gap-3" style={{ backgroundColor: '#07080f' }}>
        
        {/* CỘT 1: Lịch sử Chat */}
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
          // Note: Khi dùng ReactMarkdown, bạn có thể cân nhắc bỏ whiteSpace: 'pre-wrap' 
          // nếu thư viện đã tự động xử lý xuống dòng bằng các thẻ <p>
          whiteSpace: 'normal', 
          borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
          borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px'
        }}>
          
          <ReactMarkdown>
            {msg.text}
          </ReactMarkdown>

          {/* Hộp nhấp nháy báo hiệu AI đang type ở chunk cuối */}
          {msg.isStreaming && <span className="cursor-blink"></span>}
          
        </div>
        <span className="text-secondary mt-1" style={{ fontSize: '0.7rem' }}>{msg.time}</span>
      </div>
    ))
  )}
  
  {/* Dấu 3 chấm chỉ hiện lên khi tin nhắn CỦA USER là tin cuối cùng */}
  {isAiTyping && messages[messages.length - 1]?.sender === 'user' && (
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