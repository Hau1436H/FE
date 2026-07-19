// src/components/dashboard/profile/ProfileCard.jsx
import { FiMail, FiShield, FiHash, FiGithub } from 'react-icons/fi';

function ProfileCard({ user }) {
  // 1. Tránh lỗi Cannot read properties of undefined khi user chưa load xong
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="rounded-4 p-4 mb-4 text-center text-white-50" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
        <span className="spinner-border spinner-border-sm me-2"></span> Đang nạp dữ liệu định danh...
      </div>
    );
  }

  // Lấy chữ cái đầu của tên làm Avatar mặc định
  const getInitials = (name) => {
    if (!name) return 'Dev';
    const parts = name.split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  };

  return (
    <div className="rounded-4 p-4 mb-4 position-relative overflow-hidden" style={{ backgroundColor: '#0d0e15', border: '1px solid #1e2235' }}>
      
      {/* Background decoration */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" style={{
        background: 'radial-gradient(circle at 10% 20%, rgba(100, 255, 218, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>

      <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4 position-relative z-1">
        
        {/* Avatar phong cách Tech/Console */}
        <div 
          className="rounded-3 d-flex align-items-center justify-content-center fw-bold fs-2 shadow"
          style={{ 
            width: '100px', 
            height: '100px', 
            backgroundColor: '#131520', 
            color: '#64ffda', // Mã màu Cyan chuẩn IDE
            border: '2px solid #1e2235',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.1)'
          }}
        >
          {getInitials(user.fullName)}
        </div>

        {/* Thông tin User (Lấy 100% từ API thật) */}
        <div className="text-center text-md-start flex-grow-1">
          <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
            <h3 className="mb-0 fw-bold text-white tracking-tight">{user.fullName || 'Người dùng hệ thống'}</h3>
            {user.roleName === 'Student' && (
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-1" style={{ fontSize: '11px' }}>
                PRO
              </span>
            )}
          </div>
          
          <div className="text-white-50 font-monospace small mb-3">
            Hệ thống phân tích năng lực lõi AI
          </div>

          {/* Các tags thông tin */}
          <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mt-2 font-monospace" style={{ fontSize: '13px' }}>
            <div className="d-flex align-items-center gap-2 text-light p-2 rounded bg-dark border border-secondary border-opacity-25">
              <FiMail className="text-info" /> 
              <span className="opacity-75">{user.email || 'Awaiting_Email'}</span>
            </div>
            
            <div className="d-flex align-items-center gap-2 text-light p-2 rounded bg-dark border border-secondary border-opacity-25">
              <FiShield className="text-warning" /> 
              <span className="opacity-75">Quyền: {user.roleName || 'Unknown'}</span>
            </div>

            <div className="d-flex align-items-center gap-2 text-light p-2 rounded bg-dark border border-secondary border-opacity-25">
              <FiHash className="text-danger" /> 
              <span className="opacity-75">
                UID: {user.userId ? user.userId.substring(0, 8) + '...' : 'Loading'}
              </span>
            </div>
          </div>
        </div>

        {/* Khối bên phải (Đồng bộ GitHub) */}
        <div className="d-none d-lg-flex flex-column align-items-end justify-content-center">
           <div className="text-success font-monospace mb-2 d-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
             <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '8px', height: '8px' }}></span>
             System Online
           </div>
           <button className="btn btn-outline-secondary btn-sm font-monospace d-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
             <FiGithub /> Khớp nối GitHub
           </button>
        </div>

      </div>
    </div>
  );
}

export default ProfileCard;