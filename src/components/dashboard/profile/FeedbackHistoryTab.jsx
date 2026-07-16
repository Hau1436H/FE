import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { FaQuoteLeft, FaClock, FaUserTie } from "react-icons/fa";

function FeedbackHistoryTab() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        // Gọi API chúng ta vừa định nghĩa ở trên
        const response = await axiosClient.get("/api/Profile/my-feedbacks");
        setFeedbacks(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải nhận xét:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString + 'Z');
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  };

  if (loading) return <div className="text-info small p-4">Đang tải lịch sử nhận xét...</div>;

  return (
    <div className="mt-4">
      <h5 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
        <FaUserTie className="text-primary" /> Nhận xét từ Mentor
      </h5>
      
      {feedbacks.length === 0 ? (
        <div className="p-4 rounded text-center border border-secondary border-opacity-10" style={{ backgroundColor: "#111122" }}>
          <p className="text-white-50 mb-0">Hồ sơ của bạn chưa có nhận xét nào từ Mentor.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {feedbacks.map((fb) => (
            <div key={fb.sessionId} className="p-4 rounded shadow-sm position-relative" style={{ backgroundColor: "#111122", borderLeft: "4px solid #00d2ff" }}>
              <FaQuoteLeft className="position-absolute top-0 end-0 mt-3 me-3 text-white-50" style={{ opacity: 0.1, fontSize: "2rem" }} />
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="text-info fw-bold mb-0">{fb.mentorName}</h6>
                  <small className="text-white-50">{fb.mentorCompany}</small>
                </div>
                <div className="text-white-50 small d-flex align-items-center gap-1">
                  <FaClock /> {formatDate(fb.scheduledAt)}
                </div>
              </div>
              <div className="text-light mt-3" style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem", lineHeight: "1.6" }}>
                {fb.reviewNotes}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackHistoryTab; 