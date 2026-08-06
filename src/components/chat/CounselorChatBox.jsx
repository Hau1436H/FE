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

  useEffect(() => {
    let isMounted = true;
    let newConnection = null;

    const initializeChat = async () => {
      try {
        setIsLoading(true);

        // 1. Lấy Session
        const sessionRes = await axiosClient.post(
          `/api/CounselorChat/session?studentId=${studentId}&counselorId=${counselorId}`,
        );
        const currentSessionId =
          sessionRes.data?.sessionId || sessionRes.data?.SessionId;

        if (!isMounted) return;
        setSessionId(currentSessionId);

        // 2. Lấy Lịch sử
        if (currentSessionId) {
          const historyRes = await axiosClient.get(
            `/api/CounselorChat/history/${currentSessionId}`,
          );
          if (isMounted) {
            // Bao gồm mọi format trả về của axios
            const historyData = historyRes.data?.data || historyRes.data || [];
            setMessages(historyData);
          }
        }

        // 3. Kết nối SignalR
        if (currentSessionId) {
          const token = localStorage.getItem("token");
          const baseUrl =
            import.meta.env.VITE_API_URL || "https://localhost:7196";
          const hubUrl = `${baseUrl.replace(/\/$/, "")}/hubs/counselorChat`;

          newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl, { accessTokenFactory: () => token })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

          // Lắng nghe sự kiện
          newConnection.on("ReceiveMessage", (message) => {
            if (isMounted) {
              setMessages((prev) => [...prev, message]);
            }
          });

          await newConnection.start();

          if (isMounted) {
            await newConnection.invoke(
              "JoinSession",
              currentSessionId.toString().toLowerCase(),
            );
            setConnection(newConnection);
          } else {
            newConnection.stop();
          }
        }
      } catch (error) {
        console.error("Lỗi khởi tạo chat:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (studentId && counselorId) {
      initializeChat();
    }

    return () => {
      isMounted = false;
      if (newConnection) {
        newConnection.off("ReceiveMessage");
        newConnection.stop();
      }
    };
  }, [studentId, counselorId]);

  // Phân loại tin nhắn của mình hay của đối phương thông qua senderType
  const checkIsMyMessage = (msg) => {
    if (!msg || !msg.senderType) return false;
    const fromStudent = msg.senderType.toLowerCase() === "student";
    return isStudent ? fromStudent : !fromStudent;
  };

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
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  if (isLoading)
    return (
      <div className="d-flex justify-content-center p-5 text-info">
        <div className="spinner-border me-2"></div> Đang tải phòng chat...
      </div>
    );

  return (
    <div className="card d-flex flex-column h-100 bg-dark border-secondary">
      <div className="card-header bg-black text-info border-bottom border-secondary d-flex align-items-center">
        <h6 className="mb-0 fw-bold">
          <i className="bi bi-chat-dots me-2"></i>Khung Chat Hỗ Trợ
        </h6>
      </div>

      <div
        className="card-body overflow-auto p-3 custom-scrollbar"
        style={{ backgroundColor: "#0f172a", minHeight: "400px" }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-white-50 mt-4 small">
            Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMyMessage = checkIsMyMessage(msg);

            return (
              <div
                key={index}
                className={`d-flex mb-3 ${isMyMessage ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className={`p-3 rounded-4 shadow-sm ${isMyMessage ? "text-white" : "bg-black text-light border border-secondary border-opacity-25"}`}
                  style={{
                    maxWidth: "80%",
                    backgroundColor: isMyMessage ? "#0ea5e9" : "#1e293b",
                    borderBottomRightRadius: isMyMessage ? "4px" : "16px",
                    borderBottomLeftRadius: !isMyMessage ? "4px" : "16px",
                  }}
                >
                  {/* CHỈ CẦN GỌI ĐÚNG BIẾN messageText */}
                  <div style={{ fontSize: "0.95rem" }}>{msg.messageText}</div>

                  <div
                    className={`mt-1 text-end ${isMyMessage ? "text-white-50" : "text-muted"}`}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {new Date(msg.sentAt || new Date()).toLocaleTimeString([], {
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

      <div className="card-footer bg-black border-top border-secondary">
        <form onSubmit={handleSendMessage} className="d-flex gap-2">
          <input
            type="text"
            className="form-control bg-dark text-white border-secondary rounded-pill"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
