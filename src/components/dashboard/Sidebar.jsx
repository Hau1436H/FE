// src/components/dashboard/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { 
  FaHome, FaGraduationCap, FaCode, FaBriefcase, 
  FaBell, FaUser, FaCog, FaSignOutAlt, FaHistory, FaRobot, FaChartLine, FaPlusCircle, FaSlidersH
} from 'react-icons/fa';

import { PROFILE_DATA } from '../../data/profileData';
import axiosClient from '../../api/axiosClient'; 

function decodeToken(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('Không thể giải mã token:', e);
    return null;
  }
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUser() {
      // Luôn lấy role/thông tin cơ bản từ token trước - không phụ thuộc API
      const token = localStorage.getItem('token');
      const payload = decodeToken(token);
      const tokenRole = payload?.role || payload?.Role || localStorage.getItem('role') || '';
      const tokenFallback = {
        fullName: payload?.fullName || payload?.name || payload?.unique_name || '',
        email: payload?.email || payload?.sub || '',
        avatar: null,
        role: tokenRole,
      };
 
      try {
        const response = await axiosClient.get('/api/Profile/me');
        const result = response.data;
        if (result.data) {
          // Ghép role từ token vào nếu API không trả field role
          // result.data chứa format mới { user: {...}, details: {...} } nếu đã cập nhật backend/API Client
          // Phải bóc tách an toàn:
          const fetchedUser = result.data.user || result.data;
          const fetchedDetails = result.data.details || {};
          
          setUser({ 
              ...fetchedUser, 
              ...fetchedDetails,
              role: fetchedUser.roleName || fetchedUser.role || tokenRole 
          });
        } else {
          setUser(tokenFallback);
        }
      } catch (error) {
        console.warn('Không tải được /api/Profile/me, dùng dữ liệu cơ bản từ token:', error?.message);
        setUser(tokenFallback);
      }
    }
    fetchUser();
  }, []);

  const studentId = user?.userId || user?.studentId || '';  
  const historyPath = studentId ? `/dashboard/assessment-history/${studentId}` : '#';

  // 1. Nhóm Menu dành cho Học viên
  const baseMenuItems = [
    { icon: <FaHome />, text: "Tổng quan", path: "/dashboard" },
    { icon: <FaGraduationCap />, text: "Learning Hub", path: "/dashboard/learning" },
    { icon: <FaCode />, text: "Thực hành", path: "/dashboard/practice" },
    { icon: <FaBriefcase />, text: "Career & Jobs", path: "/dashboard/jobs" },
    { icon: <FaRobot />, text: "Cố vấn AI", path: "/dashboard/virtual-mentor" },
    { icon: <FaBell />, text: "AI Insight Center", path: "/dashboard/insights" },
    { icon: <FaHistory />, text: "Lịch sử đánh giá", path: historyPath },
    { icon: <FaUser />, text: "Hồ sơ của tôi", path: "/dashboard/profile" },
  ];

  // 2. Nhóm Menu chỉ hiển thị khi tài khoản đăng nhập có Role là Admin
  const adminMenuItems = [
    { icon: <FaChartLine />, text: "Admin Stats", path: "/dashboard/admin" },
    { icon: <FaSlidersH />, text: "Quản lý hệ thống", path: "/dashboard/admin/management" },
    { icon: <FaPlusCircle />, text: "Tạo khoá học", path: "/dashboard/admin/create-course" },
  ];

  // Kiểm tra xem user hiện tại có phải là Admin hay không
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const hourStat = PROFILE_DATA.stats.find(s => s.label === "Giờ học");
  const currentHours = parseInt(hourStat?.value?.replace(/[^0-9]/g, ''), 10) || 0;
  const targetHours = 100; 
  const goalPercentage = Math.min(100, Math.round((currentHours / targetHours) * 100));

  const renderMenuItem = (item, index) => {
    const isItemActive = item.text === "Lịch sử đánh giá"
      ? location.pathname.includes('/assessment-history') 
      : location.pathname === item.path && item.path !== '#';

    return (
      <li key={index}>
        <button 
          type="button"
          className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 ${
            isItemActive ? ' fw-semibold' : 'bg-transparent text-white-50'
          }`}
          style={isItemActive ? { color: '#fff', backgroundColor: 'color-mix(in srgb, var(--accent) 25%, transparent) !important' } : {}}
          onClick={() => item.path !== '#' && navigate(item.path)} 
        >
          <span className={isItemActive ? 'text-white' : 'text-white-50 d-flex align-items-center'}>
            {item.icon}
          </span>
          <span className="text-white">
            {item.text}
          </span>
        </button>
      </li>
    );
  };

  return (
    <div className="d-flex flex-column p-3 text-white flex-shrink-0" style={{ width: '260px', backgroundColor: '#06060c', minHeight: '100vh', borderRight: '1px solid #1e1e2f' }}>
      
      {/* ĐÃ SỬA: Thay đổi to="/" để luôn quay về trang chủ gốc */}
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

      <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#111122' }}>
        <div className="d-flex align-items-center gap-3">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.fullName || "User"} 
              className="rounded-circle" 
              style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
            />
          ) : (
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: '40px', height: '40px' }}>
             {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <div className="fw-semibold small text-white">{user?.fullName || "Người dùng"}</div>
            <div className="text-white-50 extra-small" style={{ fontSize: '12px' }}>{user?.email || "Email chưa cập nhật"}</div>
          </div>
        </div>
        
        {/* Đã sửa: Chỉ hiển thị khối mục tiêu giờ học nếu KHÔNG PHẢI là Admin */}
        {!isAdmin && (
          <div className="mt-3">
            <div className="d-flex justify-content-between text-white-50 small mb-1" style={{ fontSize: '11.5px' }}>
              <span>Mục tiêu tuần này</span>
              <span className="text-success fw-semibold">{currentHours}h / {targetHours}h</span>
            </div>
            <div className="progress" style={{ height: '6px', backgroundColor: '#22223b' }}>
              <div className="progress-bar bg-success" style={{ width: `${goalPercentage}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Đã sửa: KHỐI MENU CHÍNH CHUNG (Chỉ hiển thị nếu KHÔNG PHẢI Admin) */}
      {!isAdmin && (
        <>
          <div className="small text-white mb-2 px-2 uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>MENU THÀNH VIÊN</div>
          <ul className="nav nav-pills flex-column gap-1 mb-3">
            {baseMenuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </>
      )}

      {/* KHỐI MENU QUẢN TRỊ (Chỉ hiển thị nếu là Admin) */}
      {isAdmin && (
        <>
          <div className="small text-white mb-2 px-2 uppercase fw-bold mt-2" style={{ fontSize: '11px', letterSpacing: '1px', color: '#10b981' }}>QUẢN TRỊ VIÊN</div>
          <ul className="nav nav-pills flex-column gap-1 mb-auto">
            {adminMenuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </>
      )}

      {!isAdmin && <div className="mb-auto"></div>}

      <hr style={{ backgroundColor: '#22223b' }} />

      <ul className="nav nav-pills flex-column gap-1">
        <li>
          <button 
            type="button"
            className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 border-0 ${location.pathname === '/dashboard/setting' ? 'bg-success bg-opacity-10 fw-semibold' : 'bg-transparent text-white-50'}`}
            onClick={() => navigate('/dashboard/setting')}
          >
            <FaCog className={location.pathname === '/dashboard/setting' ? 'text-white' : 'text-white-50'} /> 
            <span className="text-white">Cài đặt</span>
          </button>
        </li>
        <li>
          <button 
            type="button"
            className="nav-link w-100 text-start text-danger d-flex align-items-center gap-3 px-3 py-2 border-0 bg-transparent"
            onClick={() => {
              localStorage.removeItem('token'); 
              localStorage.removeItem('user'); 
              localStorage.removeItem('role'); 
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