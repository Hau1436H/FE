import React, { useState } from "react";
import { FaExternalLinkAlt, FaCommentDots, FaSpinner, FaMagic } from "react-icons/fa"; // Thêm FaMagic
import { Link } from "react-router-dom";

// Thêm prop onGenerateAiFeedback từ component cha truyền xuống
function PortfolioCard({ portfolio, onSubmitFeedback, onGenerateAiFeedback }) {
  const [isReplying, setIsReplying] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State quản lý trạng thái loading của AI
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmitFeedback(portfolio.portfolioId, feedbackText);
    setIsSubmitting(false);

    if (success) {
      setFeedbackText("");
      setIsReplying(false);
    }
  };

  // Hàm gọi AI
  const handleAiSuggestion = async () => {
    if (!onGenerateAiFeedback) {
      alert("Chưa tích hợp API gọi AI!");
      return;
    }
    
    setIsGeneratingAi(true);
    try {
      // Gọi hàm fetch API truyền từ component cha (MentorDashboard)
      const aiDraft = await onGenerateAiFeedback(portfolio.portfolioId);
      if (aiDraft) {
        setFeedbackText(aiDraft); // Đổ dữ liệu AI sinh ra vào textarea
      }
    } catch (error) {
      console.error("Lỗi khi tạo nhận xét bằng AI:", error);
      // Có thể thêm toast.error() ở đây
    } finally {
      setIsGeneratingAi(false);
    }
  };

  let localPath = "#";
  if (portfolio.shareableUrl) {
    if (portfolio.shareableUrl.includes("/p/")) {
      const slug = portfolio.shareableUrl.split("/p/")[1];
      localPath = `/p/${slug}`;
    } else {
      localPath = `/p/${portfolio.shareableUrl}`;
    }
  }

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="p-4 rounded-3 h-100 d-flex flex-column shadow-sm" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
        
        <div className="mb-3">
          <h5 className="fw-bold text-info mb-1">{portfolio.studentName || "Sinh viên ẩn danh"}</h5>
          <p className="text-white-50 small mb-2">Định hướng: <span className="text-light">{portfolio.targetRole || "Chưa rõ"}</span></p>
          
          {portfolio.aiProfileSummary && (
            <p className="text-white-50 mt-2" style={{ fontSize: "13px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {portfolio.aiProfileSummary}
            </p>
          )}
        </div>
        
        <Link 
          to={localPath} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline-info btn-sm mb-auto d-inline-flex align-items-center gap-2 w-100 justify-content-center"
        >
          <FaExternalLinkAlt /> Xem E-Portfolio
        </Link>

        <hr style={{ borderColor: "#22223b", margin: "1rem 0" }}/>

        {isReplying ? (
          <form onSubmit={handleSubmit}>
            {/* Header của form chứa nút AI */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="text-white-50 small mb-0">Nhận xét của bạn:</label>
              <button 
                type="button" 
                className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                onClick={handleAiSuggestion}
                disabled={isGeneratingAi || isSubmitting}
                style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
              >
                {isGeneratingAi ? <FaSpinner className="fa-spin" /> : <FaMagic />}
                {isGeneratingAi ? "Đang viết..." : "AI Gợi ý"}
              </button>
            </div>

            <textarea 
              className="form-control form-control-sm mb-2 text-white" 
              style={{ backgroundColor: "#06060c", border: "1px solid #22223b" }}
              rows="4" // Tăng rows lên 4 để dễ đọc đoạn AI sinh ra
              placeholder="Nhận xét về kỹ năng, dự án, code pattern..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
              disabled={isSubmitting || isGeneratingAi}
            ></textarea>

            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary btn-sm flex-grow-1 d-flex justify-content-center align-items-center gap-2"
                disabled={isSubmitting || isGeneratingAi}
              >
                {isSubmitting ? <FaSpinner className="fa-spin" /> : "Gửi nhận xét"}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => setIsReplying(false)}
                disabled={isSubmitting || isGeneratingAi}
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <button 
            className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2 w-100"
            onClick={() => setIsReplying(true)}
          >
            <FaCommentDots /> Khám bệnh & Góp ý
          </button>
        )}
      </div>
    </div>
  );
}

export default PortfolioCard;