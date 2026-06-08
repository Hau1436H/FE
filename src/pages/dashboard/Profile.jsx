import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ProfileCard from '../../components/dashboard/profile/ProfileCard';
import ProfileNav from '../../components/dashboard/profile/ProfileNav';
import Badges from '../../components/dashboard/profile/Badges';
import InfoForm from '../../components/dashboard/profile/InfoForm';
import Education from '../../components/dashboard/profile/Education';
import SocialLinks from '../../components/dashboard/profile/SocialLinks';

// Import kho lưu trữ dữ liệu thô
import { PROFILE_DATA } from '../../data/profileData';

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
              <Badges badges={PROFILE_DATA.badges} />

              {/* Form chứa thông tin cá nhân liên hệ (Đã đổi p-3 và gap-3 outline) */}
              <InfoForm info={PROFILE_DATA.personalInfo} />

              {/* Thông tin Trường đào tạo */}
              <Education edu={PROFILE_DATA.education} />

              {/* Hệ thống Link Social */}
              <SocialLinks socials={PROFILE_DATA.socials} />
            </>
          ) : (
            // Trạng thái dự phòng trống (Empty State) khi người dùng chọn các mục chưa kết nối database
            <div className="text-center text-white-50 py-5 bg-secondary bg-opacity-5 rounded-4 border border-secondary border-opacity-10">
              Nội dung tab "{activeTab}" đang được đồng bộ dữ liệu hệ thống...
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
