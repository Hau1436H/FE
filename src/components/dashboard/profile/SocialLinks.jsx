import React from 'react';
import { FiGithub, FiLinkedin, FiGlobe } from 'react-icons/fi';

/**
 * COMPONENT: SocialLinks
 * CHỨC NĂNG CHÍNH:
 * - Quản lý và liên kết các tài khoản mạng xã hội lập trình viên chuyên nghiệp phục vụ tuyển dụng.
 * - Trình bày hệ thống link dẫn ra 3 kênh phổ biến: GitHub, LinkedIn và Website cá nhân (Portfolio).
 * - Sử dụng các icon outline chuẩn xác của hệ thống Feather Icons giúp giao diện đồng nhất tuyệt đối.
 */
function SocialLinks({ socials }) {
  return (
    <div className="rounded-4 p-4 mb-2" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      <div className="text-white-50 text-uppercase fw-bold mb-4" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
        🔗 Liên kết mạng xã hội
      </div>
      <div className="row g-4">
        {/* Cột 1: Đường dẫn kho mã nguồn GitHub */}
        <div className="col-12 col-md-4">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>GitHub</label>
          <div className="p-3 rounded-3 text-white d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiGithub size={15} className="opacity-50" />
            <span>{socials.github}</span>
          </div>
        </div>
        {/* Cột 2: Đường dẫn mạng lưới tuyển dụng LinkedIn */}
        <div className="col-12 col-md-4">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>LinkedIn</label>
          <div className="p-3 rounded-3 text-white d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiLinkedin size={15} className="opacity-50" />
            <span>{socials.linkedin}</span>
          </div>
        </div>
        {/* Cột 3: Trang Portfolio / Dự án cá nhân */}
        <div className="col-12 col-md-4">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Website / Portfolio</label>
          <div className="p-3 rounded-3 text-white d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiGlobe size={15} className="opacity-50" />
            <span>{socials.portfolio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialLinks;
