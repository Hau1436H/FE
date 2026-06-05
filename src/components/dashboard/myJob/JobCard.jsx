import React from 'react';
import { BiMap } from 'react-icons/bi';
import { FiBookmark } from 'react-icons/fi';

function JobCard({ job }) {
  // Tách tag vị trí từ mảng tags nếu có
  const locationText = job.tags?.find(t => t.includes('📍'))?.replace('📍 ', '') || 'Toàn quốc';

  return (
    <div className="card h-100 text-white rounded-4 border-0 p-4" style={{ backgroundColor: '#131520' }}>
      
      {/* 1. Phần Đầu Card: Ảnh Logo URL, Tiêu đề & Match Score */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex gap-3">
          {/* Thẻ <img> hiển thị Logo thực tế từ URL */}
          <img 
            src={job.companyLogo} 
            alt={job.companyName} 
            className="rounded-3 object-cover shadow-sm"
            style={{ width: '56px', height: '56px', objectFit: 'cover' }}
            onError={(e) => {
              // Khử lỗi hiển thị khi link ảnh die, đổi thành màu nền xám kèm chữ cái đầu
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Khối dự phòng (Fallback) khi ảnh lỗi */}
          <div 
            className="rounded-3 align-items-center justify-content-center fw-bold text-white shadow-sm"
            style={{ width: '56px', height: '56px', backgroundColor: '#2d3142', fontSize: '14px', display: 'none' }}
          >
            {job.companyName.charAt(0)}
          </div>

          <div>
            <h6 className="fw-bold text-white mb-1 fs-6" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {job.title}
            </h6>
            <span className="text-white-50 extra-small d-block" style={{ fontSize: '12px' }}>
              {job.companyName}
            </span>
          </div>
        </div>

        {/* Vòng tròn Match % góc phải */}
        <div className="text-end">
          <div 
            className="rounded-circle d-flex flex-column align-items-center justify-content-center text-success border border-success border-opacity-25" 
            style={{ width: '54px', height: '54px', backgroundColor: 'rgba(16, 185, 129, 0.05)', lineHeight: '1.1' }}
          >
            <span className="fw-bold" style={{ fontSize: '14px' }}>{job.match}%</span>
            <span className="text-success opacity-75" style={{ fontSize: '9px' }}>match</span>
          </div>
        </div>
      </div>

      {/* 2. Hàng Badge thông tin cơ bản */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="badge bg-secondary bg-opacity-20 text-white-50 fw-normal px-2.5 py-1.5 rounded-2" style={{ fontSize: '12px' }}>
          🗄️ {job.type}
        </span>
        <span className="badge bg-secondary bg-opacity-20 text-white-50 fw-normal px-2.5 py-1.5 rounded-2" style={{ fontSize: '12px' }}>
          {job.level}
        </span>
        <span className="badge bg-secondary bg-opacity-20 text-white-50 fw-normal px-2.5 py-1.5 rounded-2 d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
          <BiMap size={14} /> {locationText}
        </span>
      </div>

      {/* 3. Hiển thị Mức Lương */}
      <div className="text-success fw-bold mb-3 d-flex align-items-center gap-1.5" style={{ fontSize: '18px' }}>
        💵 {job.salary} <span className="text-white-50 fw-normal" style={{ fontSize: '13px' }}>/tháng (gross)</span>
      </div>

      {/* 4. Đoạn mô tả ngắn */}
      <p className="text-white-50 mb-4" style={{ fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '38px', lineHeight: '1.5' }}>
        {job.description}
      </p>

      {/* 5. Vùng kỹ năng phù hợp */}
      <div className="mb-3">
        <div className="text-white-50 extra-small mb-2" style={{ fontSize: '12px' }}>Kỹ năng phù hợp</div>
        <div className="d-flex flex-wrap gap-2">
          {job.skills.map((skill, idx) => (
            <span 
              key={idx} 
              className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-2.5 py-1.5 rounded-pill fw-medium" 
              style={{ fontSize: '12px' }}
            >
              ✓ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 6. Chế độ phúc lợi phụ */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {['Đào tạo nội bộ', 'Lộ trình thăng tiến rõ ràng', 'ESOP'].map((benefit, idx) => (
          <span key={idx} className="text-white-50 extra-small bg-secondary bg-opacity-10 px-2 py-1 rounded-2" style={{ fontSize: '11px' }}>
            {benefit}
          </span>
        ))}
        <span className="text-white-50 extra-small py-1" style={{ fontSize: '11px' }}>+1 khác</span>
      </div>

      {/* 7. Phần Chân Card */}
      <div className="mt-auto pt-3 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
        <span className="text-white-50 extra-small" style={{ fontSize: '12px' }}>3 ngày trước</span>
        
        <div className="d-flex gap-2">
          <button 
            className="btn p-2 d-flex align-items-center justify-content-center rounded-3 border border-secondary border-opacity-20 text-white-50" 
            style={{ width: '38px', height: '38px', backgroundColor: 'transparent' }}
          >
            <FiBookmark size={18} />
          </button>
          
          <button 
            className="btn px-3 py-2 fw-medium rounded-3 text-white d-flex align-items-center gap-2 transition-all" 
            style={{ backgroundColor: '#1c1e2d', border: '1px solid #2d3142', fontSize: '13.5px' }}
          >
            Ứng tuyển ngay →
          </button>
        </div>
      </div>

    </div>
  );
}

export default JobCard;
