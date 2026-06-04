// src/components/dashboard/Sidebar.jsx
import React, { useState, useEffect } from 'react'; // 1. Import thêm useEffect để gọi API sau này
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { 
  FaHome, FaGraduationCap, FaCode, FaBriefcase, 
  FaBell, FaUser, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

function Sidebar() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // 2. Khởi tạo State lưu thông tin User Profile động (Có giá trị mặc định để không bị trắng trang)
  const [userProfile, setUserProfile] = useState({
    fullName: "Minh Tú",
    role: "Junior Developer",
    avatarUrl: "https://i.pinimg.com/webp/1200x/c8/7e/65/c87e6591818c49a40ab70b96bd034392.webp", // Để trống nếu dùng ảnh mặc định, điền URL nếu có ảnh mạng
    weeklyGoal: {
      currentHours: 9,
      targetHours: 14
    }
  });

  // 3. Khung sườn chạy API (Khi nào có API thật chỉ cần mở đoạn này ra cấu hình)
  /*
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Thay url này bằng API thật từ dự án API_TechCompass của bạn
        const response = await fetch('https://localhost:7196/api/User/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Nếu API cần token đăng nhập
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            fullName: data.fullName,
            role: data.roleName || "Member",
            avatarUrl: data.avatar,
            weeklyGoal: {
              currentHours: data.currentHours || 0,
              targetHours: data.targetHours || 10
            }
          });
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  */

  // Tính toán phần trăm tiến độ mục tiêu tự động từ dữ liệu động
  const goalPercentage = Math.min(
    100, 
    Math.round((userProfile.weeklyGoal.currentHours / userProfile.weeklyGoal.targetHours) * 100)
  );

  const menuItems = [
    { icon: <FaHome />, text: "Tổng quan" },
    { icon: <FaGraduationCap />, text: "Learning Hub" },
    { icon: <FaCode />, text: "Thực hành" },
    { icon: <FaBriefcase />, text: "Career & Jobs" },
    { icon: <FaBell />, text: "Thông báo" },
    { icon: <FaUser />, text: "Hồ sơ của tôi" },
  ];

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

      {/* User Profile Info - ĐÃ BIẾN THÀNH ĐỘNG */}
      <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#111122' }}>
        <div className="d-flex align-items-center gap-3">
          {userProfile.avatarUrl ? (
            <img 
              src={userProfile.avatarUrl} 
              alt="Avatar" 
              className="rounded-circle" 
              style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
            />
          ) : (
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: '40px', height: '40px' }}>
              {userProfile.fullName.charAt(0).toUpperCase()} {/* Lấy chữ cái đầu của tên làm avatar tạm */}
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
            <span className="text-success fw-semibold">
              {userProfile.weeklyGoal.currentHours}h / {userProfile.weeklyGoal.targetHours}h
            </span>
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
          const isItemActive = index === activeIndex;
          return (
            <li key={index}>
              <button 
                className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 ${
                  isItemActive ? 'bg-success text-success bg-opacity-10 fw-semibold' : ' bg-transparent text-white-50'
                }`}
                style={isItemActive ? { color: '#10b981' } : {}}
                onClick={() => setActiveIndex(index)}
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
          <button className="nav-link w-100 text-start text-white-50 d-flex align-items-center gap-3 px-3 py-2 border-0 bg-transparent">
            <FaCog className="text-white-50" /> <span className="text-white">Cài đặt</span>
          </button>
        </li>
        <li>
          <button 
            className="nav-link w-100 text-start text-danger d-flex align-items-center gap-3 px-3 py-2 border-0 bg-transparent"
            onClick={() => navigate('/login')}
          >
            <FaSignOutAlt /> Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
