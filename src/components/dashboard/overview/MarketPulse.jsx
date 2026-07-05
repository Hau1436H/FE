import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaChartBar } from 'react-icons/fa';

const COLORS = {
  bgCard: '#131313',
  border: '#232323',
  textSecondary: '#8C8C8C',
  accentCyan: '#34D399',
  accentCyanDim: 'rgba(52,211,153,0.08)',
};

export default function MarketPulse({ topTrends, aiPulseSummary }) {
  const navigate = useNavigate();

  // Tìm kỹ năng hot nhất trong danh sách để tạo câu khuyên thông minh tự động (nếu backend chưa kịp truyền summary xuống)
  const highestTrendSkill = topTrends && topTrends.length > 0 ? topTrends[0].name : "Infrastructure as Code";

  const defaultAiAdvice = `Thị trường đang khát nhân sự nắm vững tư duy ${highestTrendSkill}. Ưu tiên tập trung nâng cao kỹ năng này vào lộ trình học sẽ giúp CV của bạn lọt Top 10% ứng viên tiềm năng săn đón hàng đầu.`;

  return (
    <div style={{ 
      backgroundColor: COLORS.bgCard, 
      border: `1px solid ${COLORS.border}`, 
      borderRadius: '14px', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Header điều phối hành động nhanh */}
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="m-0 text-white fw-bold d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
          Trending Skills
        </h6>
        
        {/* Nút Xem biểu đồ mờ kết nối sang trang Career & Jobs */}
        <button 
          onClick={() => navigate('/dashboard/jobs')}
          className="btn btn-link p-0 text-decoration-none border-0 bg-transparent font-monospace"
          style={{ 
            color: COLORS.textSecondary, 
            fontSize: '11px',
            transition: 'color 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = COLORS.accentCyan}
          onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textSecondary}
        >
          [Xem biểu đồ]
        </button>
      </div>

      {/* Danh sách xu hướng thị trường thu gọn */}
      <div className="d-flex flex-column gap-2">
        {topTrends?.length > 0 ? topTrends.map((trend, idx) => (
          <div key={idx} className="d-flex justify-content-between align-items-center small">
            <span style={{ color: COLORS.textSecondary, fontSize: '13px' }}>{trend.name}</span>
            <span className="text-success fw-bold d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
              <FaArrowUp style={{ fontSize: '10px' }} /> {trend.demand}%
            </span>
          </div>
        )) : (
          <div className="text-muted small text-center py-2">Chưa có dữ liệu thị trường mới.</div>
        )}
      </div>

      {/* Khối Gia vị AI - Lời khuyên định hướng từ AI Mentor */}
      <div 
        className="p-2.5 rounded-3 small mt-1" 
        style={{ 
          backgroundColor: COLORS.accentCyanDim, 
          color: COLORS.accentCyan, 
          fontSize: '11.5px', 
          lineHeight: '1.45',
          border: '1px solid rgba(52,211,153,0.12)'
        }}
      >
        <div style={{ fontWeight: '700', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>💡</span> Tình báo AI Mentor:
        </div>
        <div style={{ opacity: 0.9, fontStyle: 'italic' }}>
          {aiPulseSummary || defaultAiAdvice}
        </div>
      </div>
    </div>
  );
}