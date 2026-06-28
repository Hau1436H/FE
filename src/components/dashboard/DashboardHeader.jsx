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

    </div>
  );
}

export default DashboardHeader;
