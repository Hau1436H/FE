import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import axiosClient from "../../api/axiosClient"; // Đường dẫn import có thể thay đổi tùy vị trí file

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

  // Tự động cuộn xuống tin nhắn mới nhất
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
          `/api/counselorchat/session?studentId=${studentId}&counselorId=${counselorId}`,
        );
        const currentSessionId =
          sessionRes.data.SessionId || sessionRes.data.sessionId;
        setSessionId(currentSessionId);

        // 2. Lấy lịch sử chat
        const historyRes = await axiosClient.get(
          `/api/counselorchat/history/${currentSessionId}`,
        );
        setMessages(historyRes.data || historyRes.data.data);

        // 3. Khởi tạo SignalR Connection
        // Lấy token từ localStorage (hoặc nơi bạn đang lưu) để SignalR xác thực
        const token = localStorage.getItem("token");

        // Đảm bảo URL này khớp với domain C# Backend của bạn
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
        console.error("Lỗi khởi tạo chat:", error);
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
          console.log("Đã kết nối SignalR!");
          // Xin join vào phòng chat (Group) theo SessionId
          connection.invoke("JoinSession", sessionId);

          // Lắng nghe tin nhắn mới từ Server
          connection.on("ReceiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
          });
        })
        .catch((e) => console.log("Lỗi kết nối SignalR: ", e));
    }

    // Cleanup function khi component unmount
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
      // Gửi qua SignalR
      // Các tham số: sessionId, senderId, content, isFromStudent
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
    return <div className="p-4 text-center">Đang tải phòng chat...</div>;

  return (
    <div className="card d-flex flex-column" style={{ height: "500px" }}>
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Khung Chat Hỗ Trợ</h5>
      </div>

      {/* Khu vực hiển thị tin nhắn */}
      <div
        className="card-body overflow-auto"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        {messages.map((msg, index) => {
          // Kiểm tra xem tin nhắn này là của user đang đăng nhập hay của người kia
          const isMyMessage =
            msg.SenderId === currentUserId || msg.senderId === currentUserId;

          return (
            <div
              key={index}
              className={`d-flex mb-3 ${isMyMessage ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={`p-3 rounded-3 ${isMyMessage ? "bg-primary text-white" : "bg-white border"}`}
                style={{ maxWidth: "75%" }}
              >
                <div>{msg.MessageText || msg.Content || msg.content}</div>
                <small
                  className={
                    isMyMessage ? "text-light opacity-75" : "text-muted"
                  }
                  style={{ fontSize: "0.7rem" }}
                >
                  {new Date(
                    msg.SentAt || msg.Timestamp || msg.timestamp,
                  ).toLocaleTimeString()}
                </small>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Khu vực nhập tin nhắn */}
      <div className="card-footer bg-white">
        <form onSubmit={handleSendMessage} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newMessage.trim()}
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default CounselorChatBox;
