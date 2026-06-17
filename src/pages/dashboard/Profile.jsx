// src/pages/dashboard/Profile.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ProfileCard from '../../components/dashboard/profile/ProfileCard';
import ProfileNav from '../../components/dashboard/profile/ProfileNav';
import Badges from '../../components/dashboard/profile/Badges';
import InfoForm from '../../components/dashboard/profile/InfoForm';
import Education from '../../components/dashboard/profile/Education';
import SocialLinks from '../../components/dashboard/profile/SocialLinks';

// Import Component E-Portfolio Github vừa tạo
import GithubPortfolioSync from '../../components/dashboard/profile/GithubPortfolioSync';

// Import kho lưu trữ dữ liệu thô
import { PROFILE_DATA } from '../../data/profileData';
import axiosClient from '../../api/axiosClient';

/**
 * COMPONENT CHÍNH: Profile (Page Component)
 * CHỨC NĂNG CHÍNH:
 * - Là bộ khung xương tổng kết hợp lắp ráp toàn bộ các component phụ thành trang Hồ sơ hoàn chỉnh.
 * - Quản lý State điều phối chuyển trang `activeTab` để render động nội dung (Hồ sơ, Kiểm tra, Cài đặt).
 * - Tích hợp cấu trúc Sidebar và Header tổng của bảng điều khiển để giữ bố cục chung.
 */
function Profile() {
  // State quản lý xem tab nào đang được người dùng lựa chọn để hiển thị thông tin
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({});

  // Hàm giải mã Token để lấy StudentId an toàn
  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.studentId || payload.StudentId || payload.sub;
    } catch (e) { 
      return null; 
    }
  };

  const studentId = getStudentId();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axiosClient.get('/api/Profile/me');
        const result = response.data;

        if (result.data) {
          setUser(result.data);
        }
      } catch (error) {
        console.error("Lỗi nạp dữ liệu", error);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      {/* 1. Gọi thanh điều hướng Sidebar bên trái */}
      <Sidebar />

      {/* 2. Vùng hiển thị Viewport nội dung chi tiết bên phải */}
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />
        
        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>
          
          {/* Card thông số thống kê đầu trang */}
          <ProfileCard data={PROFILE_DATA} />

          {/* Menu chuyển đổi danh mục sub-tab */}
          <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Cơ chế kiểm tra Render động: Chỉ hiển thị dữ liệu chi tiết khi chọn trúng tab 'profile' */}
          {activeTab === 'profile' ? (
            <>
              {/* Thống kê Huy chương */}
              {/* <Badges /> */}

              {/* Form chứa thông tin cá nhân liên hệ */}
              <InfoForm info={user} />

              {/* MODULE E-PORTFOLIO TÍCH HỢP AI */}
              {studentId ? (
                <GithubPortfolioSync studentId={studentId} />
              ) : (
                <div className="alert alert-warning mt-4 text-center border-0 bg-warning bg-opacity-10 text-warning">
                  Đang tải thông tin định danh để đồng bộ GitHub...
                </div>
              )}

              {/* Thông tin Trường đào tạo */}
              {/* <Education edu={PROFILE_DATA.education} /> */}

              {/* Hệ thống Link Social */}
              {/* <SocialLinks socials={PROFILE_DATA.socials} /> */}
            </>
          ) : (
            // Trạng thái dự phòng trống (Empty State) khi người dùng chọn các mục chưa kết nối database
            <div className="text-center text-white-50 py-5 bg-secondary bg-opacity-5 rounded-4 border border-secondary border-opacity-10 mt-4">
              Nội dung tab "{activeTab}" đang được đồng bộ dữ liệu hệ thống...
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;