import React from 'react';
import { FaStar, FaCalendarAlt } from 'react-icons/fa';
import { AiFillCheckCircle } from 'react-icons/ai';
import { FiGlobe } from 'react-icons/fi';

function MentorCard({ mentor = {} }) { // Thêm default fallback object rỗng
  const next5Days = [
    { date: 6, dayText: 'T7' },
    { date: 7, dayText: 'CN' },
    { date: 8, dayText: 'T2' },
    { date: 9, dayText: 'T3' },
    { date: 10, dayText: 'T4' }
  ];

  return (
    <div className="card h-100 text-white rounded-4 border-0 p-4" style={{ backgroundColor: '#131520' }}>
      
      {/* 1. Phần Đầu Card */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex gap-3">
          <div className="position-relative">
            {mentor.avatarUrl ? (
              <img 
                src={mentor.avatarUrl} 
                alt={mentor.name || 'Mentor'} 
                className="rounded-circle object-cover"
                style={{ width: '56px', height: '56px' }}
              />
            ) : (
              <div className="rounded-circle bg-secondary bg-opacity-20 d-flex align-items-center justify-content-center fs-4" style={{ width: '56px', height: '56px' }}>
                {mentor.avatar || "👤"}
              </div>
            )}
            <AiFillCheckCircle 
              className="position-absolute bottom-0 end-0 text-success" 
              size={18} 
              style={{ backgroundColor: '#131520', borderRadius: '50%' }}
            />
          </div>

          <div>
            <h6 className="fw-bold text-white mb-0 fs-6">{mentor.name || 'Tên Mentor'}</h6>
            <span className="text-white-50 extra-small d-block mt-0.5" style={{ fontSize: '12.5px' }}>
              {mentor.role || 'Chuyên gia IT'}
            </span>
            <div className="d-flex align-items-center gap-1 mt-0.5" style={{ fontSize: '11.5px' }}>
              <span className="fw-bold text-white-50">{mentor.companyShort || "VN"}</span>
              <span className="text-white-50 opacity-60">{mentor.company || 'Tech Company'}</span>
            </div>
          </div>
        </div>

        <div className="text-end">
          <div className="fw-bold text-white" style={{ fontSize: '16px' }}>{mentor.price || 'Free'}</div>
          <div className="text-white-50 extra-small" style={{ fontSize: '11.5px' }}>/buổi {mentor.duration || '60p'}</div>
        </div>
      </div>

      {/* 2. Đánh giá sao số */}
      <div className="d-flex align-items-center gap-1 mb-3.5 text-warning" style={{ fontSize: '12px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} className={i < Math.floor(mentor.rating || 0) ? "text-warning" : "opacity-20"} size={13} />
        ))}
        <span className="text-white ms-1 fw-bold" style={{ fontSize: '12.5px' }}>{mentor.rating || '5.0'}</span>
        <span className="text-white-50 ms-auto" style={{ fontSize: '11.5px' }}>{mentor.reviewsCount || 0} đánh giá</span>
      </div>

      {/* 3. Khối 3 thông số */}
      <div className="d-flex justify-content-between align-items-center mb-3.5 px-2">
        <div className="text-center">
          <div className="fw-bold text-white mb-0" style={{ fontSize: '15px' }}>{mentor.experience || 0} năm</div>
          <div className="text-white-50 extra-small" style={{ fontSize: '11px' }}>năm KN</div>
        </div>
        <div className="text-center">
          <div className="fw-bold text-white mb-0" style={{ fontSize: '15px' }}>{mentor.students || 0}</div>
          <div className="text-white-50 extra-small" style={{ fontSize: '11px' }}>học viên</div>
        </div>
        <div className="text-center">
          <div className="fw-bold text-success mb-0" style={{ fontSize: '15px', color: '#10b981 !important' }}>{mentor.responseTime || 'Nhanh'}</div>
          <div className="text-white-50 extra-small" style={{ fontSize: '11px' }}>phản hồi</div>
        </div>
      </div>

      <p className="text-white-50 mb-3.5" style={{ fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '38px', lineHeight: '1.45' }}>
        {mentor.bio || 'Chuyên gia hỗ trợ định hướng lộ trình công nghệ.'}
      </p>

      {/* 5. Vùng tag Chuyên môn (Dùng ?.map an toàn) */}
      <div className="d-flex flex-wrap gap-1.5 mb-4">
        {mentor.tags?.map((tag, idx) => (
          <span key={idx} className="badge rounded-pill bg-secondary bg-opacity-20 text-white-50 fw-normal px-2.5 py-1.5" style={{ fontSize: '12px' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* 6. Vùng Lịch Rảnh & Ngôn Ngữ */}
      <div className="mb-4">
        <div className="text-white-50 extra-small mb-2" style={{ fontSize: '12px' }}>Lịch rảnh 5 ngày tới</div>
        
        <div className="d-flex gap-2 mb-3">
          {next5Days.map(item => {
            const isAvailable = mentor.availableDays?.includes(item.date); // Dùng ?. an toàn
            return (
              <div key={item.date} className="d-flex flex-column align-items-center gap-1">
                <div 
                  className="rounded-3 d-flex align-items-center justify-content-center fw-medium"
                  style={{
                    width: '32px', height: '32px', fontSize: '13px',
                    backgroundColor: isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: isAvailable ? '#10b981' : 'rgba(255,255,255,0.2)',
                    border: isAvailable ? '1px solid rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                >
                  {item.date}
                </div>
                <span className="text-white-50" style={{ fontSize: '10px', opacity: isAvailable ? 0.8 : 0.4 }}>
                  {item.dayText}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="text-white-50 d-flex align-items-center gap-1.5" style={{ fontSize: '12px' }}>
          <FiGlobe size={14} className="opacity-75" />
          <span>{mentor.languages || 'Tiếng Việt'}</span>
        </div>
      </div>

      {/* 7. Buttons */}
      <div className="d-flex gap-2 border-top border-secondary border-opacity-10 pt-3 mt-auto">
        <button className="btn btn-sm flex-grow-1 py-2 text-dark bg-white border-0 fw-medium rounded-3" style={{ fontSize: '13px', minHeight: '38px' }}>
          💬 Nhắn tin
        </button>
        <button className="btn btn-sm flex-grow-1 py-2 fw-medium text-white border-0 d-flex align-items-center justify-content-center gap-1.5 rounded-3" style={{ backgroundColor: '#0d9488', fontSize: '13px', minHeight: '38px' }}>
          <FaCalendarAlt size={12} /> Đặt lịch
        </button>
      </div>

    </div>
  );
}

export default MentorCard;