// src/components/dashboard/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap'
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
    <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-2 mb-4 px-2 text-decoration-none">
        <div className="rounded bg-success d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <span className="fw-bold text-dark">Ai</span>
        </div>
        <span className="fs-5 fw-bold text-success">AiCareer</span>
    </Nav.Link>

      {/* User Profile Info */}
      <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#111122' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle bg-secondary" style={{ width: '40px', height: '40px' }}></div>
          <div>
            <div className="fw-semibold small">Minh Tú</div>
            <div className="text-muted extra-small" style={{ fontSize: '12px' }}>Junior Developer</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="d-flex justify-content-between text-muted small mb-1">
            <span>Mục tiêu tuần này</span>
            <span className="text-success fw-semibold">9h / 14h</span>
          </div>
          <div className="progress" style={{ height: '6px', backgroundColor: '#22223b' }}>
            <div className="progress-bar bg-success" style={{ width: '64%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="small text-muted mb-2 px-2 uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>MENU</div>
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <a href="#" className={`nav-link text-white d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${item.active ? 'bg-success bg-opacity-10 text-success fw-semibold' : 'opacity-75'}`}
               style={item.active ? { color: '#10b981 !important' } : {}}>
              <span className={item.active ? 'text-success' : 'text-muted'}>{item.icon}</span>
              {item.text}
            </a>
          </li>
        ))}
      </ul>

      <hr style={{ backgroundColor: '#22223b' }} />

      {/* Settings & Logout */}
      <ul className="nav nav-pills flex-column gap-1">
        <li>
          <a href="#" className="nav-link text-white opacity-75 d-flex align-items-center gap-3 px-3 py-2">
            <FaCog className="text-muted" /> Cài đặt
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
