import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import axiosClient from "../../api/axiosClient";

const CounselorChatBox = ({
  studentId,
  counselorId,
  currentUserId,
  isStudent,
}) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Khởi tạo Chat: Lấy Session và Lịch sử
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        // 1. Lấy hoặc tạo Session
        const sessionRes = await axiosClient.post(
          `/api/v1/CounselorChat/session?studentId=${studentId}&counselorId=${counselorId}`,
        );
        const currentSessionId =
          sessionRes.data?.SessionId || sessionRes.data?.sessionId;
        setSessionId(currentSessionId);

        if (currentSessionId) {
          // 2. Lấy lịch sử chat
          const historyRes = await axiosClient.get(
            `/api/v1/CounselorChat/history/${currentSessionId}`,
          );
          setMessages(historyRes.data?.Data || historyRes.data?.data || []);
        }

        // 3. Khởi tạo SignalR Connection
        const token = localStorage.getItem("token");
        const hubUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/hubs/counselorChat`
          : "https://localhost:7196/hubs/counselorChat";

        const newConnection = new HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: () => token,
          })
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        setConnection(newConnection);
      } catch (error) {
        console.error("Lỗi khởi tạo chat cố vấn:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId && counselorId) {
      initializeChat();
    }
  }, [studentId, counselorId]);

  // Lắng nghe sự kiện SignalR
  useEffect(() => {
    if (connection && sessionId) {
      connection
        .start()
        .then(() => {
          console.log("Đã kết nối SignalR Chat Cố vấn!");
          connection.invoke("JoinSession", sessionId);

          connection.on("ReceiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
          });
        })
        .catch((e) => console.log("Lỗi kết nối SignalR: ", e));
    }

    return () => {
      if (connection) {
        connection.off("ReceiveMessage");
        connection.stop();
      }
    };
  }, [connection, sessionId]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !connection || !sessionId) return;

    try {
      await connection.invoke(
        "SendMessage",
        sessionId,
        currentUserId,
        newMessage,
        isStudent,
      );
      setNewMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  if (isLoading)
    return (
      <div className="d-flex justify-content-center align-items-center h-100 p-5 text-info">
        <div className="spinner-border me-2" role="status"></div> Đang tải phòng
        chat...
      </div>
    );

  return (
    <div className="d-flex flex-column h-100">
      {/* Khu vực hiển thị tin nhắn */}
      <div
        className="flex-grow-1 overflow-auto p-3 custom-scrollbar"
        style={{ backgroundColor: "#0f172a", minHeight: "350px" }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-white-50 mt-4 small">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMyMessage =
              msg.SenderId === currentUserId || msg.senderId === currentUserId;

            return (
              <div
                key={index}
                className={`d-flex mb-3 ${isMyMessage ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className={`p-3 rounded-4 shadow-sm ${isMyMessage ? "text-white" : "bg-dark text-light border border-secondary border-opacity-25"}`}
                  style={{
                    maxWidth: "80%",
                    backgroundColor: isMyMessage ? "#0ea5e9" : "#1e293b",
                    borderBottomRightRadius: isMyMessage ? "4px" : "16px",
                    borderBottomLeftRadius: !isMyMessage ? "4px" : "16px",
                  }}
                >
                  <div style={{ fontSize: "0.95rem" }}>
                    {msg.MessageText || msg.Content || msg.content}
                  </div>
                  <div
                    className={`mt-1 text-end ${isMyMessage ? "text-white-50" : "text-muted"}`}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {new Date(
                      msg.SentAt ||
                        msg.Timestamp ||
                        msg.timestamp ||
                        new Date(),
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Khu vực nhập tin nhắn */}
      <div
        className="p-3"
        style={{
          backgroundColor: "#020617",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <form onSubmit={handleSendMessage} className="d-flex gap-2">
          <input
            type="text"
            className="form-control text-white border-secondary bg-dark"
            placeholder="Nhập tin nhắn hỗ trợ..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ borderRadius: "20px" }}
          />
          <button
            type="submit"
            className="btn btn-info rounded-circle d-flex align-items-center justify-content-center"
            disabled={!newMessage.trim()}
            style={{ width: "40px", height: "40px" }}
          >
            <i className="bi bi-send-fill text-dark"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CounselorChatBox;
