// Bao gồm thanh tìm kiếm và lời chào.
import React, { useState, useEffect } from 'react';

function DashboardHeader() {
  // Khởi tạo State động cho thông tin người dùng và số liệu nhanh trên Header
  const [headerData, setHeaderData] = useState({
    username: "Minh Tú",
    streakDays: 12,
    totalPoints: 2840
  });

  // Khung sườn chạy API lấy thông tin lời chào (sau này chỉ cần mở ra kết nối)
  /*
  useEffect(() => {
    const fetchHeaderInfo = async () => {
      try {
        const response = await fetch('https://localhost:7196/api/User/header-summary', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHeaderData({
            username: data.username,
            streakDays: data.streakDays || 0,
            totalPoints: data.totalPoints || 0
          });
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin header:", error);
      }
    };
    fetchHeaderInfo();
  }, []);
  */

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      {/* Lời chào động */}
      <div>
        <h4 className="fw-bold mb-0 text-white">Chào buổi chiều, {headerData.username}!</h4>
        <span className="text-white small">
          Streak {headerData.streakDays} ngày • {headerData.totalPoints.toLocaleString()} điểm
        </span>
      </div>

      {/* Ô tìm kiếm */}
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
  );
}

export default DashboardHeader;
