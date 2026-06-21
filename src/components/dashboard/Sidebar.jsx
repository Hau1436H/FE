// Component chứa sidebar menu điều hướng bên trái của trang dashboard.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { 
  FaHome, FaGraduationCap, FaCode, FaBriefcase, 
  FaBell, FaUser, FaCog, FaSignOutAlt, FaHistory, FaRobot, FaChartLine
} from 'react-icons/fa';

import { PROFILE_DATA } from '../../data/profileData';
import axiosClient from '../../api/axiosClient'; 

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});

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

  const studentId = user?.userId || '';  
  // ĐÃ SỬA LỖI TRÙNG LẶP: Không fallback về /dashboard nữa
  const historyPath = studentId 
    ? `/dashboard/assessment-history/${studentId}` 
    : `#`;

  const menuItems = [
    { icon: <FaHome />, text: "Tổng quan", path: "/dashboard" },
    { icon: <FaGraduationCap />, text: "Learning Hub", path: "/dashboard/learning" },
    { icon: <FaCode />, text: "Thực hành", path: "/dashboard/practice" },
    { icon: <FaBriefcase />, text: "Career & Jobs", path: "/dashboard/jobs" },
    { icon: <FaRobot />, text: "Cố vấn AI", path: "/dashboard/virtual-mentor" },
    { icon: <FaBell />, text: "Thông báo", path: "/dashboard/notifications" },
    { icon: <FaHistory />, text: "Lịch sử đánh giá", path: historyPath },
    { icon: <FaChartLine />, text: "Admin Stats", path: "/dashboard/admin" },
    { icon: <FaUser />, text: "Hồ sơ của tôi", path: "/dashboard/profile" },
  ];

  const hourStat = PROFILE_DATA.stats.find(s => s.label === "Giờ học");
  const currentHours = parseInt(hourStat?.value?.replace(/[^0-9]/g, ''), 10) || 0;
  const targetHours = 100; 

  const goalPercentage = Math.min(100, Math.round((currentHours / targetHours) * 100));

  return (
    <div className="d-flex flex-column p-3 text-white flex-shrink-0" style={{ width: '260px', backgroundColor: '#06060c', minHeight: '100vh', borderRight: '1px solid #1e1e2f' }}>
      
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
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.fullName} 
              className="rounded-circle" 
              style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
            />
          ) : (
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: '40px', height: '40px' }}>
             {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <div className="fw-semibold small text-white">{user.fullName}</div>
            <div className="text-white-50 extra-small" style={{ fontSize: '12px' }}>{user.email}</div>
          </div>
        </div>
        
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

      <div className="small text-white mb-2 px-2 uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>MENU</div>
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {menuItems.map((item, index) => {
          
          // ĐÃ SỬA LOGIC SO SÁNH: Chặn lỗi nhận diện nhầm nút Active
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
                // Không cho bấm nếu đang load ID (link '#')
                onClick={() => item.path !== '#' && navigate(item.path)} 
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
              localStorage.removeItem('token'); 
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