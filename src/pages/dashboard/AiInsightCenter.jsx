import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

// ĐÃ SỬA: Thay thế /notification/ bằng /insights/ theo đúng cây thư mục thực tế của bạn
import InsightMetrics from '../../components/dashboard/insights/InsightMetrics';
import InsightTimeline from '../../components/dashboard/insights/InsightTimeline';
import WeeklyReport from '../../components/dashboard/insights/WeeklyReport';

import axiosClient from '../../api/axiosClient';
function AiInsightCenter() {
  const [histories, setHistories] = useState([]);
  const [aiAdvice, setAiAdvice] = useState("");
  // Giả sử bạn lấy studentId từ Context/Auth Token. Ở đây gán tạm hoặc truyền vào
  const studentId = "82acf25e-ae72-4bee-b3aa-724f224374fc"; 

  useEffect(() => {
    axiosClient.get(`/api/Portfolios/${studentId}/insights`)
      .then(res => {
        setHistories(res.data.histories);
        setAiAdvice(res.data.aiWeeklyAdvice); // Đừng quên truyền biến này xuống <WeeklyReport /> nhé
      })
      .catch(err => console.error("Lỗi tải Insights:", err));
  }, [studentId]);

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />
        
        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>
          <div className="mb-4">
            <h4 className="fw-bold text-white mb-1 fs-4">AI Insight Center</h4>
            <p className="text-white-50 extra-small mb-0" style={{ fontSize: '13px' }}>
              Trung tâm phân tích dữ liệu, theo dõi sự kiện hệ thống và báo cáo lộ trình cá nhân hóa.
            </p>
          </div>

          {/* ĐÃ MỞ COMMENT VÀ ĐƯA RA NGOÀI: Đặt thanh Metrics chạy ngang độc lập phía trên */}
          <InsightMetrics histories={histories} />

          <div className="row g-4 mt-2">
            <div className="col-12 col-lg-7 d-flex flex-column">
              {/* Cột trái chỉ chứa dòng thời gian sự kiện */}
              <InsightTimeline histories={histories} />
            </div>

            <div className="col-12 col-lg-5">
              {/* Cột phải chứa báo cáo hiệu suất tuần */}
              <WeeklyReport histories={histories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiInsightCenter;