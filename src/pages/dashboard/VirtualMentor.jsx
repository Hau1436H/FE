// src/pages/dashboard/VirtualMentor.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Sidebar from "../../components/dashboard/Sidebar";
import axiosClient from "../../api/axiosClient";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

// --- TECH THEME CONSTANTS ---
const TECH_COLORS = {
  bgBase: "#030712",
  bgSurface: "#0f172a",
  bgPanel: "rgba(15, 23, 42, 0.6)",
  borderSoft: "rgba(148, 163, 184, 0.15)",
  accentBlue: "#3b82f6",
  accentCyan: "#06b6d4",
  textMain: "#f8fafc",
  textMuted: "#94a3b8",
};

function VirtualMentor() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const messagesEndRef = useRef(null);

  const AI_AVATAR =
    "https://img.freepik.com/free-photo/portrait-young-businesswoman-holding-eyeglasses-hand-against-gray-backdrop_23-2148029483.jpg?w=800&t=st=1700000000~exp=1700000000~hmac=123456789";
  const USER_AVATAR =
    "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?w=800&t=st=1700000000~exp=1700000000~hmac=abcdef";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  useEffect(() => {
    fetchSessions(true);
  }, []);

  const fetchSessions = async (isInitialLoad = false) => {
    try {
      const response = await axiosClient.get("/api/v1/VirtualMentor/sessions");
      const sessionList =
        response.data?.data || response.data?.Data || response.data || [];

      if (Array.isArray(sessionList)) {
        setSessions(sessionList);
        if (isInitialLoad) handleNewChat();
      }
    } catch (error) {
      console.error("Lỗi tải danh sách session:", error);
    }
  };

  const handleSelectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    setIsLoadingHistory(true);
    setMessages([]);

    try {
      const response = await axiosClient.get(
        `/api/v1/VirtualMentor/chat-history/${sessionId}`,
      );
      const historyData = response.data?.data || response.data?.Data || [];

      if (historyData.length > 0) {
        const formattedHistory = historyData.map((msg) => ({
          id: msg.messageId || msg.MessageId,
          sender:
            (msg.senderType || msg.SenderType).toLowerCase() === "student"
              ? "user"
              : "ai",
          text: msg.messageText || msg.MessageText,
          time: new Date(msg.sentAt || msg.SentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
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
    setMessages([
      {
        id: "welcome-msg",
        sender: "ai",
        text: "Xin chào! Mình là Cố vấn Hướng nghiệp AI của bạn. Hãy cho mình biết bạn đang quan tâm đến vị trí công việc nào trong ngành IT nhé!",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  // --- HÀM XỬ LÝ XÓA ĐOẠN CHAT ---
  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation(); // Ngăn click nhầm vào chọn session

    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa đoạn chat này không? Mọi dữ liệu sẽ bị mất.",
      )
    ) {
      return;
    }

    try {
      await axiosClient.delete(`/api/v1/VirtualMentor/sessions/${sessionId}`);

      // Xóa thành công khỏi State
      const updatedSessions = sessions.filter((s) => s.sessionId !== sessionId);
      setSessions(updatedSessions);

      // Nếu đang ở màn hình chat bị xóa, quay về màn hình Chat Mới
      if (activeSessionId === sessionId) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Lỗi khi xóa session:", error);
      alert("Xóa thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiTyping) return;

    const userText = chatInput;
    setChatInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: userText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setIsAiTyping(true);

    try {
      const payload = { sessionId: activeSessionId, userMessage: userText };
      const response = await axiosClient.post(
        "/api/v1/VirtualMentor/chat",
        payload,
      );
      const returnedSessionId =
        response.data?.sessionId || response.data?.SessionId;
      const aiResponseText =
        response.data?.aiResponse ||
        response.data?.AiResponse ||
        "Xin lỗi, không lấy được phản hồi.";

      if (!activeSessionId && returnedSessionId) {
        setActiveSessionId(returnedSessionId);
        fetchSessions();
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiResponseText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `❌ Hệ thống đang quá tải. Vui lòng thử lại: ${error.response?.data?.Error || error.message}`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div
      className="d-flex vh-100 overflow-hidden"
      style={{
        backgroundColor: TECH_COLORS.bgBase,
        color: TECH_COLORS.textMain,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <Sidebar />

      <div className="d-flex flex-grow-1 h-100 overflow-hidden p-3 gap-3">
        {/* CỘT 1: Lịch sử Chat */}
        <div
          className="d-flex flex-column rounded-4 overflow-hidden flex-shrink-0 tech-glass-panel"
          style={{ width: "280px" }}
        >
          <div
            className="p-3 border-bottom"
            style={{ borderColor: TECH_COLORS.borderSoft }}
          >
            <button
              onClick={handleNewChat}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill py-2 border-0 text-white shadow-sm"
              style={{
                fontSize: "0.95rem",
                fontWeight: "600",
                backgroundImage: `linear-gradient(135deg, ${TECH_COLORS.accentBlue}, ${TECH_COLORS.accentCyan})`,
              }}
            >
              <i className="bi bi-chat-dots-fill"></i> Đoạn chat mới
            </button>
          </div>

          <div className="flex-grow-1 overflow-auto p-2 custom-scrollbar">
            <div
              className="small px-3 mb-2 mt-2 fw-semibold"
              style={{
                color: TECH_COLORS.accentCyan,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Lịch sử trò chuyện
            </div>

            <ul className="nav nav-pills flex-column gap-1">
              {sessions.length === 0 && (
                <div
                  className="text-center small mt-4"
                  style={{ color: TECH_COLORS.textMuted }}
                >
                  Chưa có dữ liệu
                </div>
              )}

              {sessions.map((session) => (
                <li key={session.sessionId}>
                  <div
                    onClick={() => handleSelectSession(session.sessionId)}
                    className={`d-flex align-items-center justify-content-between w-100 px-3 py-2 rounded-3 border-0 transition-all session-item ${
                      activeSessionId === session.sessionId ? "fw-bold" : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      backgroundColor:
                        activeSessionId === session.sessionId
                          ? "rgba(6, 182, 212, 0.15)"
                          : "transparent",
                      color:
                        activeSessionId === session.sessionId
                          ? TECH_COLORS.accentCyan
                          : TECH_COLORS.textMuted,
                      boxShadow:
                        activeSessionId === session.sessionId
                          ? `inset 3px 0 0 ${TECH_COLORS.accentCyan}`
                          : "none",
                    }}
                  >
                    <div className="d-flex align-items-center text-truncate flex-grow-1 pe-2">
                      <i className="bi bi-chat-left-text me-2 opacity-75"></i>
                      <span className="text-truncate">
                        {session.title || "Tư vấn hướng nghiệp"}
                      </span>
                    </div>

                    {/* NÚT XÓA CHAT */}
                    <button
                      onClick={(e) => handleDeleteSession(e, session.sessionId)}
                      className="btn btn-sm text-danger p-0 delete-btn border-0"
                      style={{
                        opacity:
                          activeSessionId === session.sessionId ? 1 : 0.4,
                      }}
                      title="Xóa đoạn chat này"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CỘT 2: Khu vực Chat chính */}
        <div className="d-flex flex-column flex-grow-1 h-100 rounded-4 overflow-hidden tech-glass-panel shadow-lg">
          {/* Header Chat */}
          <div
            className="px-4 py-3 d-flex align-items-center gap-3 border-bottom"
            style={{
              borderColor: TECH_COLORS.borderSoft,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <div className="position-relative">
              <img
                src={AI_AVATAR}
                alt="AI Avatar"
                className="rounded-circle border border-2"
                style={{
                  width: "48px",
                  height: "48px",
                  objectFit: "cover",
                  borderColor: TECH_COLORS.accentCyan,
                }}
              />
              <span
                className="position-absolute bottom-0 end-0 rounded-circle border border-dark"
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#10b981",
                }}
              ></span>
            </div>
            <div>
              <h5
                className="mb-0 fw-bold"
                style={{ color: TECH_COLORS.textMain }}
              >
                Sarah - AI Tech Mentor
              </h5>
              <span
                className="small d-flex align-items-center gap-1 fw-medium mt-1"
                style={{ color: TECH_COLORS.accentCyan }}
              >
                <span
                  className="spinner-grow"
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: TECH_COLORS.accentCyan,
                  }}
                ></span>
                Đang trực tuyến
              </span>
            </div>
          </div>

          {/* Khung tin nhắn */}
          <div
            className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-4 custom-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {isLoadingHistory ? (
              <div
                className="d-flex h-100 align-items-center justify-content-center flex-column gap-3"
                style={{ color: TECH_COLORS.accentCyan }}
              >
                <div className="spinner-border" role="status"></div>
                <span className="fw-medium">Đang đồng bộ dữ liệu...</span>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`d-flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                  >
                    <img
                      src={isUser ? USER_AVATAR : AI_AVATAR}
                      alt="avatar"
                      className="rounded-circle shadow-sm"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: isUser
                          ? "none"
                          : `1px solid ${TECH_COLORS.accentCyan}`,
                      }}
                    />
                    <div
                      className="d-flex flex-column"
                      style={{
                        maxWidth: "75%",
                        alignItems: isUser ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        className="p-3 shadow-sm markdown-content"
                        style={{
                          backgroundColor: isUser
                            ? "transparent"
                            : "rgba(30, 41, 59, 0.8)",
                          backgroundImage: isUser
                            ? `linear-gradient(135deg, ${TECH_COLORS.accentBlue}, ${TECH_COLORS.accentCyan})`
                            : "none",
                          color: TECH_COLORS.textMain,
                          fontSize: "0.95rem",
                          lineHeight: "1.6",
                          borderRadius: "18px",
                          borderTopRightRadius: isUser ? "4px" : "18px",
                          borderTopLeftRadius: !isUser ? "4px" : "18px",
                          border: !isUser
                            ? `1px solid ${TECH_COLORS.borderSoft}`
                            : "none",
                          backdropFilter: !isUser ? "blur(8px)" : "none",
                        }}
                      >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                      <span
                        className="mt-1"
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          color: TECH_COLORS.textMuted,
                        }}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {isAiTyping && (
              <div className="d-flex gap-3 align-items-end">
                <img
                  src={AI_AVATAR}
                  alt="AI Avatar"
                  className="rounded-circle shadow-sm"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    border: `1px solid ${TECH_COLORS.accentCyan}`,
                  }}
                />
                <div
                  className="p-3 rounded-4 shadow-sm"
                  style={{
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    borderTopLeftRadius: "4px",
                    border: `1px solid ${TECH_COLORS.borderSoft}`,
                  }}
                >
                  <div className="typing-indicator d-flex gap-1">
                    <span
                      className="rounded-circle"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: TECH_COLORS.accentCyan,
                        animation: "bounce 1.4s infinite ease-in-out both",
                      }}
                    ></span>
                    <span
                      className="rounded-circle"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: TECH_COLORS.accentCyan,
                        animation: "bounce 1.4s infinite ease-in-out both",
                        animationDelay: "0.2s",
                      }}
                    ></span>
                    <span
                      className="rounded-circle"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: TECH_COLORS.accentCyan,
                        animation: "bounce 1.4s infinite ease-in-out both",
                        animationDelay: "0.4s",
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập tin nhắn */}
          <div
            className="p-4"
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              borderTop: `1px solid ${TECH_COLORS.borderSoft}`,
            }}
          >
            <form
              onSubmit={handleSendMessage}
              className="d-flex gap-3 mx-auto align-items-center"
              style={{ maxWidth: "850px" }}
            >
              <div className="position-relative flex-grow-1">
                <input
                  type="text"
                  className="form-control text-white py-3 ps-4 pe-5 shadow-sm tech-input"
                  placeholder="Hỏi Sarah về lộ trình, kỹ năng hoặc review CV..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isAiTyping || isLoadingHistory}
                  style={{
                    backgroundColor: "rgba(15, 23, 42, 0.8)",
                    border: `1px solid ${TECH_COLORS.borderSoft}`,
                    borderRadius: "24px",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn rounded-circle shadow d-flex align-items-center justify-content-center text-white tech-btn-glow"
                disabled={isAiTyping || isLoadingHistory || !chatInput.trim()}
                style={{
                  width: "52px",
                  height: "52px",
                  flexShrink: 0,
                  backgroundImage: `linear-gradient(135deg, ${TECH_COLORS.accentBlue}, ${TECH_COLORS.accentCyan})`,
                  border: "none",
                  transition: "all 0.2s",
                }}
              >
                <i className="bi bi-send-fill fs-5"></i>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>
        {`
          .tech-glass-panel {
            background-color: ${TECH_COLORS.bgPanel};
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid ${TECH_COLORS.borderSoft};
          }
          .tech-input:focus {
             box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.3) !important;
             border-color: ${TECH_COLORS.accentCyan} !important;
             background-color: rgba(15, 23, 42, 1) !important;
             color: white;
          }
          .tech-btn-glow:not(:disabled):hover {
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
            transform: translateY(-2px);
          }
          /* Hover effect cho nút xóa */
          .session-item .delete-btn {
            transition: all 0.2s;
          }
          .session-item:hover .delete-btn {
            opacity: 1 !important;
            transform: scale(1.1);
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
          .markdown-content p:last-child { margin-bottom: 0; }
        `}
      </style>
    </div>
  );
}

export default VirtualMentor;
