import React from 'react';
import { FiEdit2, FiUser, FiMail, FiPhone, FiMapPin, FiInfo } from 'react-icons/fi';

/**
 * COMPONENT: InfoForm
 * CHỨC NĂNG CHÍNH:
 * - Trình diễn chi tiết các thông tin liên hệ bao gồm: Họ tên, Email, Số điện thoại, Khu vực cư trú.
 * - Hiển thị đoạn văn giới thiệu bản thân (Bio) trọn hàng ở dưới cùng.
 * - Thay thế toàn bộ emoji thô thành các icon Vector outline tinh gọn, chuyên nghiệp (`gap-3` và `p-3`).
 */
function InfoForm({ info }) {
  return (
    <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      
      {/* TIÊU ĐỀ KHỐI & NÚT HÀNH ĐỘNG */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="fw-bold text-white mb-0" style={{ fontSize: '15px' }}>
          Thông tin cá nhân
        </h6>
        <button 
          className="btn btn-sm text-white-50 border border-secondary border-opacity-20 rounded-3 px-3 py-1.5 d-flex align-items-center gap-1.5 transition-all" 
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', fontSize: '12px' }}
        >
          <FiEdit2 size={12} /> Chỉnh sửa
        </button>
      </div>

      {/* HÀNG 1: Ô Họ và tên & Ô Địa chỉ Email */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Họ và tên</label>
          <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiUser size={15} className="opacity-50" />
            <span className="text-white">{info.fullName}</span>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Email</label>
          <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiMail size={15} className="opacity-50" />
            <span className="text-white">{info.email}</span>
          </div>
        </div>
      </div>

      {/* HÀNG 2: Ô Số điện thoại & Ô Thành phố / Khu vực */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Số điện thoại</label>
          <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiPhone size={15} className="opacity-50" />
            <span className="text-white">{info.phone}</span>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Thành phố / Khu vực</label>
          <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiMapPin size={15} className="opacity-50" />
            <span className="text-white">{info.location}</span>
          </div>
        </div>
      </div>

      {/* HÀNG 3: Vùng thông tin Giới thiệu bản thân (Bio text) rộng trọn dòng */}
      <div>
        <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Giới thiệu bản thân</label>
        <div className="p-3 rounded-3 text-white-50 d-flex align-items-start gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px', lineHeight: '1.5' }}>
          <FiInfo size={15} className="opacity-50 mt-1" style={{ minWidth: '15px' }} />
          <span className="text-white">{info.bio}</span>
        </div>
      </div>

    </div>
  );
}

export default InfoForm;
