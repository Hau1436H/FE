import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import PortfolioCard from "./components/PortfolioCard";
import Sidebar from "../../../components/dashboard/Sidebar"; 
import DashboardHeader from "../../../components/dashboard/DashboardHeader";

function MentorDashboard() {
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/mentors/portfolios", {
          params: { pageNumber: 1, pageSize: 10 }
        });
        
        const dataList = response.data.items || response.data.Items || [];
        setPortfolios(dataList);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  // 1. HÀM XỬ LÝ GỬI FEEDBACK CHÍNH THỨC
  const handleSubmitFeedback = async (portfolioId, feedbackData) => {
    try {
      const response = await axiosClient.post(`/api/mentors/portfolios/${portfolioId}/feedbacks`, {
        reviewNotes: feedbackData
      });
      alert("Gửi nhận xét thành công!");
      return true; // Trả về true để Card đóng form
    } catch (error) {
      console.error("Lỗi khi gửi feedback:", error);
      alert("Gửi nhận xét thất bại. Vui lòng thử lại!");
      return false; // Trả về false để giữ nguyên form nếu lỗi
    }
  };

  // 2. HÀM MỚI: GỌI API LẤY GỢI Ý CỦA AI
  const handleGenerateAiFeedback = async (portfolioId) => {
    try {
      const response = await axiosClient.get(`/api/mentors/portfolios/${portfolioId}/ai-suggestion`);
      // Trả về text nháp của AI (dựa theo object Ok(new { suggestion = ... }) bên C#)
      return response.data.suggestion; 
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý AI:", error);
      alert("Lỗi kết nối tới AI. Vui lòng thử lại!");
      return null;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "100vh", backgroundColor: "#0a0a14" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ backgroundColor: "#0a0a14", minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ overflowY: "auto", height: "100vh" }}>
        <DashboardHeader />
        <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
          <h2 className="fw-bold mb-0 text-white">Duyệt E-Portfolio Sinh Viên</h2>
          <span className="badge bg-primary fs-6">{portfolios.length} Hồ sơ chờ duyệt</span>
        </div>

        <div className="row">
          {portfolios.length === 0 ? (
            <div className="col-12 text-center mt-5">
              <p className="text-white-50 fs-5">Hiện tại chưa có Portfolio công khai nào trên hệ thống.</p>
            </div>
          ) : (
            portfolios.map((portfolio) => (
              <PortfolioCard 
                key={portfolio.portfolioId} 
                portfolio={portfolio} 
                onSubmitFeedback={handleSubmitFeedback} 
                onGenerateAiFeedback={handleGenerateAiFeedback} // ĐÃ TRUYỀN HÀM AI XUỐNG ĐÂY
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;