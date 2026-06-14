// Bao gồm thanh tìm kiếm và lời chào.
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function DashboardHeader() {
  // Khởi tạo State động cho thông tin người dùng và số liệu nhanh trên Header
  const [headerData, setHeaderData] = useState({
  });

  useEffect(() => {
    async function fetchUser() {
      try{
        const respone = await axiosClient.get('/api/Profile/me');
        const result = respone.data;

        if (result.data){
          setHeaderData(result.data);
        }
      }
      catch(error){
        console.error("Lỗi nạp dữ liệu", error);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      {/* Lời chào động */}
      <div>
        <h4 className="fw-bold mb-0 text-white">Chào mừng {headerData.fullName}!</h4>
        <span className="text-white small">
          Streak ngày • điểm
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
