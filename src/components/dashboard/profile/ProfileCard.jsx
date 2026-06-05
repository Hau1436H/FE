import React from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { BiMap } from 'react-icons/bi';
import { HiOutlineCalendar } from 'react-icons/hi';

/**
 * COMPONENT: ProfileCard
 * CHỨC NĂNG CHÍNH: 
 * - Hiển thị ảnh đại diện (Avatar), Họ tên, Chức danh, Địa điểm và Ngày tham gia của người dùng.
 * - Cung cấp nút nhanh để mở tính năng chỉnh sửa hồ sơ tổng quan.
 * - Render danh sách 5 thông số kỹ thuật cốt lõi (XP, Streak, Số kỹ năng, Giờ học, Điểm Test) dạng lưới ngang.
 */
function ProfileCard({ data }) {
  return (
    <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      
      {/* KHỐI TRÊN: Thông tin định danh cá nhân & Nút Chỉnh sửa */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 border-bottom border-secondary border-opacity-10 pb-4 mb-4">
        <div className="d-flex gap-3 align-items-center flex-wrap">
          {/* Ảnh Avatar bo tròn lấy từ link URL data */}
          <img 
            src={data.user.avatar} 
            alt={data.user.name} 
            className="rounded-circle object-cover border border-secondary border-opacity-25"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <div>
            {/* Tên & Badge chức danh công việc */}
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5 className="fw-bold text-white mb-0 fs-5">{data.user.name}</h5>
              <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-2.5 py-0.5 extra-small fw-medium" style={{ fontSize: '11px' }}>
                {data.user.role}
              </span>
            </div>
            {/* Trường đại học và thông tin phụ (Vị trí, ngày tham gia) */}
            <p className="text-white-50 small mb-2" style={{ fontSize: '13px' }}>{data.user.major}</p>
            <div className="d-flex gap-3 text-white-50 extra-small opacity-60" style={{ fontSize: '12px' }}>
              <span className="d-flex align-items-center gap-1"><BiMap size={14} /> {data.user.location}</span>
              <span className="d-flex align-items-center gap-1"><HiOutlineCalendar size={14} /> {data.user.joinDate}</span>
            </div>
          </div>
        </div>
        {/* Nút hành động chỉnh sửa hồ sơ */}
        <button className="btn btn-sm text-white-50 border border-secondary border-opacity-20 rounded-3 px-3 py-1.5 d-flex align-items-center gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.02)', fontSize: '12.5px' }}>
          <FiEdit2 size={12} /> Chỉnh sửa hồ sơ
        </button>
      </div>

      {/* KHỐI DƯỚI: Vòng lặp kết xuất 5 ô chỉ số học tập (Stats Grid) */}
      <div className="row g-3 text-center">
        {data.stats.map((stat, idx) => (
          <div key={idx} className="col-6 col-md-2.4 col-lg">
            <div className="p-2.5 rounded-3 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255,255,255,0.01)' }}>
              {/* Định dạng màu sắc icon riêng biệt theo từng loại stats */}
              <span className="fs-5 mb-1" style={{ color: stat.color }}>{stat.icon}</span>
              <h6 className="fw-bold text-white mb-0.5" style={{ fontSize: '15px' }}>{stat.value}</h6>
              <small className="text-white-50 extra-small opacity-50" style={{ fontSize: '11px' }}>{stat.label}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileCard;
