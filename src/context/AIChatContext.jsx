import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";

const AIChatContext = createContext();

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error("useAIChat must be used within AIChatProvider");
  }
  return context;
};

const STORAGE_KEY = "global-ai-chat-messages";

export const AIChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Lưu messages vào localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Tải lịch sử chat từ backend
  const loadChatHistory = useCallback(async (sessionId) => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const response = await axiosClient.get(
        `/api/v1/VirtualMentor/chat-history/${sessionId}`
      );
      const historyData = response.data?.data || response.data?.Data || [];

      if (historyData.length > 0) {
        const formattedHistory = historyData.map((msg) => ({
          id: msg.messageId || msg.MessageId || Date.now(),
          sender:
            (msg.senderType || msg.SenderType || "").toLowerCase() === "student"
              ? "user"
              : "ai",
          text: msg.messageText || msg.MessageText || "",
          time: new Date(msg.sentAt || msg.SentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          syncedWithBackend: true,
        }));
        setMessages(formattedHistory);
        setActiveSessionId(sessionId);
      }
    } catch (error) {
      console.error("Lỗi tải lịch sử chat:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Thêm tin nhắn user
  const addUserMessage = useCallback((text) => {
    const message = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      syncedWithBackend: false,
    };
    setMessages((prev) => [...prev, message]);
    return message;
  }, []);

  // Thêm tin nhắn AI
  const addAIMessage = useCallback((text) => {
    const message = {
      id: Date.now() + 1,
      sender: "ai",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      syncedWithBackend: false,
    };
    setMessages((prev) => [...prev, message]);
    return message;
  }, []);

  // Gửi tin nhắn đến backend
  const sendMessageToBackend = useCallback(
    async (userMessage) => {
      setIsSyncing(true);
      try {
        const payload = {
          sessionId: activeSessionId,
          userMessage,
        };
        const response = await axiosClient.post(
          "/api/v1/VirtualMentor/chat",
          payload
        );

        const returnedSessionId =
          response.data?.sessionId || response.data?.SessionId;
        const aiResponseText =
          response.data?.aiResponse ||
          response.data?.AiResponse ||
          "Xin lỗi, không lấy được phản hồi.";

        if (!activeSessionId && returnedSessionId) {
          setActiveSessionId(returnedSessionId);
        }

        // Thêm phản hồi AI
        const aiMessage = {
          id: Date.now() + 2,
          sender: "ai",
          text: aiResponseText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          syncedWithBackend: true,
        };
        setMessages((prev) => [...prev, aiMessage]);
        return aiMessage;
      } catch (error) {
        const errorMessage = {
          id: Date.now() + 2,
          sender: "ai",
          text: `❌ Lỗi: ${error.response?.data?.Error || error.message}`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          syncedWithBackend: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [activeSessionId]
  );

  // Xóa session
  const deleteSession = useCallback(async (sessionId) => {
    try {
      await axiosClient.delete(`/api/v1/VirtualMentor/sessions/${sessionId}`);
      if (activeSessionId === sessionId) {
        setMessages([]);
        setActiveSessionId(null);
      }
    } catch (error) {
      console.error("Lỗi xóa session:", error);
      throw error;
    }
  }, [activeSessionId]);

  // Tạo chat mới
  const createNewChat = useCallback(() => {
    setMessages([]);
    setActiveSessionId(null);
  }, []);

  // Xóa tất cả tin nhắn
  const clearAllMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value = {
    messages,
    activeSessionId,
    isLoading,
    isSyncing,
    loadChatHistory,
    addUserMessage,
    addAIMessage,
    sendMessageToBackend,
    deleteSession,
    createNewChat,
    clearAllMessages,
  };

  return (
    <AIChatContext.Provider value={value}>{children}</AIChatContext.Provider>
  );
};
