import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaPlayCircle } from 'react-icons/fa';

const COLORS = { 
  bgCard: '#131313', 
  border: '#232323', 
  accentCyan: '#34D399', 
  accentCyanDim: 'rgba(52,211,153,0.08)', // Thêm tone màu nền AI
  accentAmber: '#F5A623', 
  textPrimary: '#ECECEC',
  textSecondary: '#8C8C8C' 
};

export default function NextAction({ nextAction, timeLeftStr }) {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column gap-4">
      {/* KHỐI 1: NHIỆM VỤ ƯU TIÊN */}
      <div style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '24px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge text-dark fw-bold px-2 py-1" style={{ backgroundColor: COLORS.accentAmber, fontSize: '11px' }}>
            <FaFire className="me-1" style={{ marginBottom: '2px' }}/> NHIỆM VỤ ƯU TIÊN
          </span>
          <span className="font-monospace small text-danger fw-semibold">
            ⏱️ Hết hạn: {timeLeftStr}
          </span>
        </div>

        <h2 className="text-white fw-bold mb-3">{nextAction?.nodeName || "Đang tải dữ liệu..."}</h2>
        
        <div className="d-flex flex-wrap gap-4 text-white-50 small mb-4">
          <div>Ước tính: <b className="text-white">{nextAction?.estimatedHours || 2} giờ</b></div>
          <div>Thưởng: <b style={{ color: COLORS.accentCyan }}>+ Tăng Readiness Score</b></div>
        </div>

        <button 
          onClick={() => navigate(`/dashboard/learning?skill=${encodeURIComponent(nextAction?.nodeName)}`)}
          className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2 fw-bold border-0"
          style={{ 
            backgroundColor: COLORS.accentCyan, 
            color: '#06060c', 
            fontSize: '15px', 
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <FaPlayCircle className="fs-5" /> BẮT ĐẦU HỌC NGAY
        </button>
      </div>

      {/* KHỐI 2: EXPLAINABLE AI (GIAO DIỆN MỚI NỔI BẬT HƠN) */}
      <div style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '20px' }}>
        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: COLORS.textPrimary }}>
          <span className="fs-5">🧠</span> Tại sao AI đề xuất kỹ năng này?
        </h6>
        
        <div 
          className="p-3 rounded-3 small" 
          style={{ 
            backgroundColor: COLORS.accentCyanDim, 
            border: `1px solid rgba(52,211,153,0.15)`, // Viền mờ bao quanh box
            borderLeft: `4px solid ${COLORS.accentCyan}`, // Viền trái nhấn mạnh
            color: 'rgba(255,255,255,0.85)', // Chữ sáng hơn textSecondary cũ
            lineHeight: '1.6',
            fontSize: '13px'
          }}
        >
          {nextAction?.aiReasoning || "Hệ thống phân tích lộ trình học tập của bạn và nhận thấy đây là kỹ năng nền tảng bắt buộc để mở khóa các bước tiếp theo."}
        </div>
      </div>
    </div>
  );
}