// Bao gồm thanh tìm kiếm và lời chào.
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function DashboardHeader() {
  // Khởi tạo State động cho thông tin người dùng và số liệu nhanh trên Header
  const [headerData, setHeaderData] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axiosClient.get('/api/Profile/me');
        const result = response.data;

        if (result.data) {
          // Bóc tách dữ liệu theo chuẩn API mới để lấy đúng fullName và role
          const fetchedUser = result.data.user || {};
          const fetchedDetails = result.data.details || {};
          
          setHeaderData({
            ...fetchedUser,
            ...fetchedDetails,
            role: fetchedUser.roleName || fetchedUser.role || ''
          });
        }
      } catch (error) {
        console.error("Lỗi nạp dữ liệu", error);
      }
    }
    fetchUser();
  }, []);

  // Kiểm tra role có phải là Student không
  const isStudent = headerData.role?.toLowerCase() === 'student';

  // Cập nhật lại phần return của DashboardHeader.jsx
return (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h4 className="fw-bold mb-0 text-white">
        Chào mừng {headerData.fullName || "bạn"}!
      </h4>
      
      {/* Chỉ hiện điểm/streak nếu là Student */}
      {isStudent && (
        <span className="text-white-50 small">
          Streak ngày • điểm
        </span>
      )}
      
      {/* Hiển thị chức danh cho Mentor/Counselor */}
      {!isStudent && (
        <span className="text-info small text-uppercase fw-bold">
          {headerData.role === 'mentor' ? "Không gian làm việc Mentor" : 
           headerData.role === 'counselor' ? "Không gian Cố vấn" : 
           headerData.role === 'admin' ? "Quản trị viên" : ""}
        </span>
      )}
    </div>
  </div>
);
}

export default DashboardHeader;