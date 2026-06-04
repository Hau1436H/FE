// src/pages/Dashboard.jsx
import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DailyChallenge from '../../components/dashboard/DailyChallenge';
import StatsGrid from '../../components/dashboard/StatsGrid';
import LearningPath from '../../components/dashboard/LearningPath';
import MarketTrends from '../../components/dashboard/MarketTrends';
import StudyNext from '../../components/dashboard/Studynext';
import RecentActivity from '../../components/dashboard/RecentActivity';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

function Dashboard() {
  return (
    <div className="d-flex" style={{ backgroundColor: '#020205', minHeight: '100vh', fontFamily: 'system-ui' }}>
      {/* Cột cố định Menu trái */}
      <Sidebar />

      {/* Khu vực nội dung hiển thị chính */}
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh' }}>
        
        {/* Thanh tìm kiếm */}
        <DashboardHeader />

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
