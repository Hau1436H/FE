import React from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = { bgCard: '#131313', border: '#232323', borderSoft: '#1A1A1A', accentCyan: '#34D399', accentAmber: '#F5A623', accentAmberDim: 'rgba(245,166,35,0.12)', textSecondary: '#8C8C8C' };

export default function TopSkillGaps({ topGaps }) {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="m-0 text-white fw-bold">Kỹ năng thiếu hụt (Gap)</h6>
        
        {/* SỬA LỖI Ở ĐÂY: Trỏ về đúng URL /dashboard/jobs */}
        <button onClick={() => navigate('/dashboard/jobs')} className="btn btn-link p-0 text-decoration-none" style={{ color: COLORS.accentCyan, fontSize: '12px' }}>
          Chi tiết
        </button>
      </div>
      
      {topGaps.length > 0 ? (
        <div className="d-flex flex-column gap-2">
          {topGaps.map((gap, idx) => (
            <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: COLORS.borderSoft }}>
              <span className="text-white font-monospace small">{gap.subject}</span>
              <span className="badge" style={{ backgroundColor: gap.gapSize > 40 ? COLORS.accentAmberDim : 'rgba(138,146,163,0.15)', color: gap.gapSize > 40 ? COLORS.accentAmber : COLORS.textSecondary, fontSize: '10px' }}>
                {gap.gapSize > 40 ? 'ƯU TIÊN CAO' : 'TRUNG BÌNH'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted small text-center">Không phát hiện lỗ hổng lớn.</div>
      )}
    </div>
  );
}