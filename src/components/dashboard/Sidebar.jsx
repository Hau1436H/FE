// src/components/dashboard/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap'
import { 
  FaHome, FaGraduationCap, FaCode, FaBriefcase, 
  FaBell, FaUser, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

function Sidebar() {
    const navigate = useNavigate();
  const menuItems = [
    { icon: <FaHome />, text: "Tổng quan", active: true },
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

      {/* User Profile Info */}
      <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#111122' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle bg-secondary" style={{ width: '40px', height: '40px' }}></div>
          <div>
            <div className="fw-semibold small">Minh Tú</div>
            <div className="text-white extra-small" style={{ fontSize: '12px' }}>Junior Developer</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="d-flex justify-content-between text-white-50 small mb-1">
            <span>Mục tiêu tuần này</span>
            <span className="text-success fw-semibold">9h / 14h</span>
          </div>
          <div className="progress" style={{ height: '6px', backgroundColor: '#22223b' }}>
            <div className="progress-bar bg-success" style={{ width: '64%' }}></div>
          </div>
        </div>
      </div>


      {/* Main Navigation Menu */}
      <div className="small text-white mb-2 px-2 uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>MENU</div>
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <a 
              href="#" 
              className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${
                item.active ? 'bg-success text-success bg-opacity-10 text-success fw-semibold' : ' text-white'
              }`}
            >
              {/* ĐÃ SỬA: Đổi text-muted thành text-white-50 hoặc giữ text-white để ăn theo opacity của thẻ cha <a> */}
              <span className={item.active ? 'text-success' : 'text-white d-flex align-items-center'}>
                {item.icon}
              </span>
              {item.text}
            </a>
          </li>
        ))}
      </ul>

      <hr style={{ backgroundColor: '#22223b' }} />

      {/* Settings & Logout */}
      <ul className="nav nav-pills flex-column gap-1">
        <li>
          <a href="#" className="nav-link text-white d-flex align-items-center gap-3 px-3 py-2">
            <FaCog className="text-white" /> Cài đặt
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-danger d-flex align-items-center gap-3 px-3 py-2">
            <FaSignOutAlt /> Đăng xuất
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
