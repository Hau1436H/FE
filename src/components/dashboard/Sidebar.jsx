// Component chứa sidebar menu điều hướng bên trái của trang dashboard.
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { 
  FaHome, FaGraduationCap, FaCode, FaBriefcase, 
  FaBell, FaUser, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

// Đmanager ĐÃ CẬP NHẬT: Import dữ liệu Profile động để đồng bộ thông tin người dùng toàn trang
import { PROFILE_DATA } from '../../data/profileData';

/**
 * COMPONENT: Sidebar
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị logo ứng dụng AICareer và menu điều hướng chính của trang quản lý Dashboard.
 * - Đồng bộ thông tin người dùng (Họ tên, Chức danh, Ảnh đại diện) theo thời gian thực từ PROFILE_DATA.
 * - Tính toán tiến độ mục tiêu số giờ học trong tuần động và kết xuất dưới dạng thanh Progress Bar.
 * - Kiểm tra khớp URL (`location.pathname`) để tự động làm sáng đèn (Active) cho mục Menu tương ứng.
 */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin đường dẫn URL hiện tại của trình duyệt

  // DANH MỤC MENU: Khai báo icon, nhãn chữ và đường dẫn routing tương ứng của từng phân hệ
  const menuItems = [
    { icon: <FaHome />, text: "Tổng quan", path: "/dashboard" },
    { icon: <FaGraduationCap />, text: "Learning Hub", path: "/dashboard/learning" },
    { icon: <FaCode />, text: "Thực hành", path: "/dashboard/practice" },
    { icon: <FaBriefcase />, text: "Career & Jobs", path: "/dashboard/jobs" },
    { icon: <FaBell />, text: "Thông báo", path: "/dashboard/notifications" },
    { icon: <FaUser />, text: "Hồ sơ của tôi", path: "/dashboard/profile" },
  ];

  // LOGIC ĐỒNG BỘ: Bóc tách giờ học thực tế và mục tiêu từ mảng stats của PROFILE_DATA
  const hourStat = PROFILE_DATA.stats.find(s => s.label === "Giờ học");
  // Chuyển đổi chuỗi chữ "47h" thành số nguyên 47 để tính toán toán học
  const currentHours = parseInt(hourStat?.value?.replace(/[^0-9]/g, ''), 10) || 0;
  const targetHours = 100; // Định mức số giờ mục tiêu làm hạn mức (Hoặc lấy từ biến cấu hình)

  // Tính toán tỷ lệ phần trăm hoàn thành mục tiêu học tập trong tuần (Tối đa giới hạn 100%)
  const goalPercentage = Math.min(100, Math.round((currentHours / targetHours) * 100));

  return (
    <div className="d-flex flex-column p-3 text-white flex-shrink-0" style={{ width: '260px', backgroundColor: '#06060c', minHeight: '100vh', borderRight: '1px solid #1e1e2f' }}>
      
      {/* 1. KHỐI BRAND LOGO */}
      <Navbar.Brand as={Link} to="/" className="fw-bold text-white fs-4 mb-4">
        <span style={{
          background: 'linear-gradient(to right, var(--accent) 0%, var(--accent) 30%, #ffffff 70%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          fontWeight: '900',
          fontSize: '1.25rem'
        }}>
          AICareer
        </span>
      </Navbar.Brand>

      {/* 2. KHỐI USER PROFILE (Đã kết nối đồng bộ động hoàn toàn với profileData) */}
      <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#111122' }}>
        <div className="d-flex align-items-center gap-3">
          {PROFILE_DATA.user.avatar ? (
            <img 
              src={PROFILE_DATA.user.avatar} 
              alt={PROFILE_DATA.user.name} 
              className="rounded-circle" 
              style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
            />
          ) : (
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: '40px', height: '40px' }}>
              {PROFILE_DATA.user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            {/* Tự động lấy tên rút gọn hoặc họ tên từ dữ liệu trung tâm */}
            <div className="fw-semibold small text-white">{PROFILE_DATA.user.name}</div>
            <div className="text-white-50 extra-small" style={{ fontSize: '12px' }}>{PROFILE_DATA.user.role}</div>
          </div>
        </div>
        
        {/* Khối Thanh Tiến độ Mục tiêu tuần */}
        <div className="mt-3">
          <div className="d-flex justify-content-between text-white-50 small mb-1" style={{ fontSize: '11.5px' }}>
            <span>Mục tiêu tuần này</span>
            <span className="text-success fw-semibold">{currentHours}h / {targetHours}h</span>
          </div>
          <div className="progress" style={{ height: '6px', backgroundColor: '#22223b' }}>
            <div className="progress-bar bg-success" style={{ width: `${goalPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* 3. KHỐI MAIN NAVIGATION MENU */}
      <div className="small text-white mb-2 px-2 uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>MENU</div>
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {menuItems.map((item, index) => {
          // KIỂM TRA ĐỘNG: Định danh nút bấm sáng đèn dựa trên trùng khớp URL trình duyệt hiện tại
          const isItemActive = location.pathname === item.path;

          return (
            <li key={index}>
              <button 
                type="button"
                className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 ${
                  isItemActive ? ' fw-semibold' : 'bg-transparent text-white-50'
                }`}
                style={isItemActive ? { color: '#fff', backgroundColor: 'color-mix(in srgb, var(--accent) 25%, transparent) !important' } : {}}
                // ĐIỀU HƯỚNG ĐỘNG: Nhấn vào dòng nào tự nhảy URL sang module phân hệ đó
                onClick={() => navigate(item.path)} 
              >
                <span className={isItemActive ? 'text-white' : 'text-white-50 d-flex align-items-center'}>
                  {item.icon}
                </span>
                <span className={isItemActive ? 'text-white' : 'text-white'}>
                  {item.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <hr style={{ backgroundColor: '#22223b' }} />

      {/* 4. KHỐI CÀI ĐẶT & ĐĂNG XUẤT TÀI KHOẢN */}
      <ul className="nav nav-pills flex-column gap-1">
        <li>
          <button 
            type="button"
            className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 border-0 ${location.pathname === '/dashboard/setting' ? 'bg-success bg-opacity-10 fw-semibold' : 'bg-transparent text-white-50'}`}
            onClick={() => navigate('/dashboard/setting')}
          >
            <FaCog className={location.pathname === '/dashboard/setting' ? 'text-white' : 'text-white-50'} /> 
            <span className={location.pathname === '/dashboard/setting' ? 'text-white' : 'text-white'}>Cài đặt</span>
          </button>
        </li>
        <li>
          <button 
            type="button"
            className="nav-link w-100 text-start text-danger d-flex align-items-center gap-3 px-3 py-2 border-0 bg-transparent"
            onClick={() => {
              localStorage.removeItem('token'); // Xóa token bảo mật ra khỏi bộ nhớ máy khi thoát
              navigate('/login');
            }}
          >
            <FaSignOutAlt /> Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
