// src/components/dashboard/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 1. Thêm hook useLocation
import { Navbar } from 'react-bootstrap';
import { 
  FaHome, FaGraduationCap, FaCode, FaBriefcase, 
  FaBell, FaUser, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Lấy thông tin URL hiện tại của trình duyệt

  const [userProfile, setUserProfile] = useState({
    fullName: "Minh Tú",
    role: "Junior Developer",
    avatarUrl: "https://i.pinimg.com/webp/1200x/c8/7e/65/c87e6591818c49a40ab70b96bd034392.webp",
    weeklyGoal: { currentHours: 9, targetHours: 14 }
  });

  // 3. THÊM ĐƯỜNG DẪN (path) cho từng mục để chuẩn bị định tuyến trang
  const menuItems = [
    { icon: <FaHome />, text: "Tổng quan", path: "/dashboard" },
    { icon: <FaGraduationCap />, text: "Learning Hub", path: "/dashboard/learning" },
    { icon: <FaCode />, text: "Thực hành", path: "/dashboard/practice" },
    { icon: <FaBriefcase />, text: "Career & Jobs", path: "/dashboard/jobs" },
    { icon: <FaBell />, text: "Thông báo", path: "/dashboard/notifications" },
    { icon: <FaUser />, text: "Hồ sơ của tôi", path: "/dashboard/profile" },
  ];

  const goalPercentage = Math.min(
    100, 
    Math.round((userProfile.weeklyGoal.currentHours / userProfile.weeklyGoal.targetHours) * 100)
  );

  return (
    <div className="d-flex flex-column p-3 text-white" style={{ width: '260px', backgroundColor: '#06060c', minHeight: '100vh', borderRight: '1px solid #1e1e2f' }}>
      {/* Brand Logo */}
      <Navbar.Brand as={Link} to="/" className="fw-bold text-white fs-4 mb-4">
          <span style={{
            background: 'linear-gradient(to right, #00bfa5 0%, #00bfa5 30%, #ffffff 70%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            fontWeight: '900',
            fontSize: '1.25rem'
          }}>
            AICareer
          </span>
      </Navbar.Brand>

      {/* User Profile Info */}
      <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#111122' }}>
        <div className="d-flex align-items-center gap-3">
          {userProfile.avatarUrl ? (
            <img src={userProfile.avatarUrl} alt="Avatar" className="rounded-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
          ) : (
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: '40px', height: '40px' }}>
              {userProfile.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="fw-semibold small">{userProfile.fullName}</div>
            <div className="text-white extra-small" style={{ fontSize: '12px' }}>{userProfile.role}</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="d-flex justify-content-between text-white-50 small mb-1">
            <span>Mục tiêu tuần này</span>
            <span className="text-success fw-semibold">{userProfile.weeklyGoal.currentHours}h / {userProfile.weeklyGoal.targetHours}h</span>
          </div>
          <div className="progress" style={{ height: '6px', backgroundColor: '#22223b' }}>
            <div className="progress-bar bg-success" style={{ width: `${goalPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="small text-white mb-2 px-2 uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>MENU</div>
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {menuItems.map((item, index) => {
          // 4. KIỂM TRA ĐỘNG: Tự động sáng đèn dựa trên URL hiện tại thay vì dùng index
          const isItemActive = location.pathname === item.path;

          return (
            <li key={index}>
              <button 
                className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 ${
                  isItemActive ? 'bg-success text-success bg-opacity-10 fw-semibold' : 'bg-transparent text-white-50'
                }`}
                style={isItemActive ? { color: '#10b981' } : {}}
                // 5. ĐIỀU HƯỚNG ĐỘNG: Nhấn vào đâu sẽ tự động chuyển URL đến trang đó
                onClick={() => navigate(item.path)} 
              >
                <span className={isItemActive ? 'text-success' : 'text-white-50 d-flex align-items-center'}>
                  {item.icon}
                </span>
                <span className={isItemActive ? 'text-success' : 'text-white'}>
                  {item.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <hr style={{ backgroundColor: '#22223b' }} />

      {/* Settings & Logout */}
      <ul className="nav nav-pills flex-column gap-1">
        <li>
          <button 
            className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 border-0 ${location.pathname === '/settings' ? 'bg-success bg-opacity-10 text-success fw-semibold' : 'bg-transparent text-white-50'}`}
            onClick={() => navigate('/settings')}
          >
            <FaCog className={location.pathname === '/settings' ? 'text-success' : 'text-white-50'} /> 
            <span className={location.pathname === '/settings' ? 'text-success' : 'text-white'}>Cài đặt</span>
          </button>
        </li>
        <li>
          <button 
            className="nav-link w-100 text-start text-danger d-flex align-items-center gap-3 px-3 py-2 border-0 bg-transparent"
            onClick={() => {
              localStorage.removeItem('token'); // Xóa token khi đăng xuất
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
