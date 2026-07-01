import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DailyChallenge from '../../components/dashboard/DailyChallenge';
import StatsGrid from '../../components/dashboard/StatsGrid';
import LearningPath from '../../components/dashboard/LearningPath';
import MarketTrends from '../../components/dashboard/MarketTrends';
import StudyNext from '../../components/dashboard/Studynext';
import RecentActivity from '../../components/dashboard/RecentActivity';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import axiosClient from '../../api/axiosClient';

function Dashboard() {
  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      // Giải mã an toàn hỗ trợ Base64Url (Fix lỗi atob crash)
      const base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
          base64 += '=';
      }
      
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );

      const payload = JSON.parse(jsonPayload);
      // Đã xóa payload.sub để tránh nhầm lẫn với ID của Admin/Role khác
      return payload.studentId || payload.StudentId;
    } catch (e) { 
      console.error("Lỗi parse token trong Dashboard:", e);
      return null; 
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#000000', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <Sidebar />

      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh' }}>
        <DashboardHeader />

        <div className="row g-4">
          <div className="col-12 col-lg-8 d-flex flex-column gap-4">
            <DailyChallenge />
            <LearningPath studentId={getStudentId()}/>
            <MarketTrends />
          </div>

          <div className="col-12 col-lg-4">
            <StudyNext studentId={getStudentId()} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;