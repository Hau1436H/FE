// src/pages/Dashboard.jsx
import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DailyChallenge from '../../components/dashboard/DailyChallenge';
import StatsGrid from '../../components/dashboard/StatsGrid';
import LearningPath from '../../components/dashboard/LearningPath';
import MarketTrends from '../../components/dashboard/MarketTrends';
import StudyNext from '../../components/dashboard/Studynext';
import RecentActivity from '../../components/dashboard/RecentActivity';

function Dashboard() {
  return (
    <div className="d-flex" style={{ backgroundColor: '#020205', minHeight: '100vh', fontFamily: 'system-ui' }}>
      {/* Cột cố định Menu trái */}
      <Sidebar />

      {/* Khu vực nội dung hiển thị chính */}
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh' }}>
        
        {/* Thanh tìm kiếm và lời chào trên cùng */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0 text-white">Chào buổi chiều, Minh Tú!</h4>
            <span className="text-white small">Streak 12 ngày • 2,840 điểm</span>
          </div>
          <div style={{ width: '300px' }}>
            <input 
              type="text" 
              placeholder="Tìm kỹ năng, bài học..." 
              className="form-control border-0 text-white py-2 px-3 small rounded-3" 
              style={{ 
                backgroundColor: '#0f111a',
                fontSize: '14px', 
                border: '1px solid #1e2235'
              }} 
            />
            <style>{`
              .form-control::placeholder {
                color: rgba(255, 255, 255, 0.5) !important;
              }
            `}</style>
          </div>
        </div>

        {/* Khối thử thách hàng ngày */}
        <DailyChallenge />

        {/* Khối 4 thẻ thông số */}
        <StatsGrid />

        {/* Khối chia 2 Cột Layout Phía Dưới */}
        <div className="row g-4">
          {/* Cột Bên Trái */}
          <div className="col-12 col-lg-8">
            <LearningPath />
            <MarketTrends />
          </div>

          {/* Cột Bên Phải */}
          <div className="col-12 col-lg-4">
            <StudyNext />
            <RecentActivity />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
