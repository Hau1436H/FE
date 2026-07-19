import React from 'react';
import { FiTerminal, FiTarget, FiActivity } from 'react-icons/fi';

/**
 * COMPONENT: TechIdentity (Thay thế Education)
 * CHỨC NĂNG CHÍNH:
 * - Trình bày định danh của sinh viên IT dựa trên DỮ LIỆU THẬT từ API.
 * - Giao diện Dark theme, phong cách Terminal/IDE (Sử dụng font monospace cho dữ liệu).
 */
function TechIdentity({ user }) {
  // Helper: Format thời gian thành dạng log hệ thống (VD: 14/04/2026 15:30:00 SYS_TIME)
  const formatSystemDate = (dateString) => {
    if (!dateString) return 'Awaiting_Sync...';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) + ' SYS_OK';
  };

  // Helper: Map TargetRoleId thành tên vị trí (Giả định theo logic thường dùng, bạn có thể chỉnh sửa ID cho khớp DB của bạn)
  const getTargetRoleName = (roleId) => {
    const roles = {
      1: "Frontend Developer",
      2: "Backend Developer",
      3: "Fullstack Developer",
      4: "Data Engineer",
      5: "AI/ML Engineer"
    };
    return roles[roleId] || "Chưa thiết lập định hướng";
  };

  return (
    <div className="rounded-4 p-4 mb-4 position-relative overflow-hidden" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      {/* Background Icon mờ để tạo cảm giác Tech */}
      <div className="position-absolute top-0 end-0 p-3 opacity-10" style={{ pointerEvents: 'none' }}>
        <FiTerminal size={140} style={{ transform: 'rotate(-10deg) translateY(-20px)' }} />
      </div>

      <div className="text-white-50 text-uppercase fw-bold mb-4 d-flex align-items-center gap-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
        <FiTerminal className="text-info" size={14} /> Định danh Học thuật & Kỹ năng
      </div>

      <div className="row g-4 position-relative z-1">
        
        {/* Cột 1: Mã số sinh viên (Style Terminal Prompt) */}
        <div className="col-12 col-md-4">
          <label className="text-white-50 d-block mb-2 font-monospace" style={{ fontSize: '11px', opacity: 0.7 }}>
            {'// sys.user.student_id'}
          </label>
          <div className="p-3 rounded-3 text-info d-flex align-items-center gap-3 font-monospace" style={{ backgroundColor: '#0a0b10', border: '1px solid #1e2235', fontSize: '14px' }}>
            <span className="opacity-50">root@techcompass:~#</span>
            <span className="fw-bold text-white">{user?.studentCode || 'NULL'}</span>
          </div>
        </div>

        {/* Cột 2: Định hướng nghề nghiệp (Target Role) */}
        <div className="col-12 col-md-4">
          <label className="text-white-50 d-block mb-2 font-monospace" style={{ fontSize: '11px', opacity: 0.7 }}>
            {'// sys.career.target_role'}
          </label>
          <div className="p-3 rounded-3 text-white d-flex align-items-center gap-3" style={{ backgroundColor: '#0a0b10', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiTarget size={16} className="text-warning" />
            <span className="fw-bold font-monospace" style={{ color: '#e2e8f0' }}>
              {getTargetRoleName(user?.targetRoleId)}
            </span>
          </div>
        </div>

        {/* Cột 3: Trạng thái cập nhật hệ thống */}
        <div className="col-12 col-md-4">
          <label className="text-white-50 d-block mb-2 font-monospace" style={{ fontSize: '11px', opacity: 0.7 }}>
            {'// sys.profile.last_sync'}
          </label>
          <div className="p-3 rounded-3 d-flex align-items-center gap-3 font-monospace" style={{ backgroundColor: '#0a0b10', border: '1px solid #1e2235', fontSize: '12px' }}>
            <FiActivity size={16} className={user?.updatedAt ? "text-success" : "text-secondary"} />
            <span className={user?.updatedAt ? "text-success" : "text-white-50"}>
              {formatSystemDate(user?.updatedAt)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TechIdentity;