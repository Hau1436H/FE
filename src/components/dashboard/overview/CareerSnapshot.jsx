import React from 'react';

const COLORS = { accentCyan: '#34D399', textSecondary: '#8C8C8C', border: '#232323', bgCard: '#131313' };

export default function CareerSnapshot({ overview }) {
  if (!overview) return null;

  return (
    <div className="row g-4 mb-4">
      {/* Cột 1: Thông số tổng quan */}
      <div className="col-lg-7">
        <div className="p-4 h-100" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.02))', border: `1px solid rgba(52,211,153,0.25)`, borderRadius: '16px' }}>
          <div className="text-white-50 small text-uppercase fw-bold mb-3">VỊ TRÍ MỤC TIÊU</div>
          <h3 className="fw-bold text-white mb-4">{overview.targetRoleName}</h3>
          
          <div className="d-flex flex-column gap-3">
            {[
              { label: 'Readiness', val: overview.readinessScore, color: COLORS.accentCyan },
              { label: 'Roadmap', val: overview.roadmapScore, color: '#3B82F6' },
              { label: 'Market Match', val: overview.marketMatchScore, color: '#F5A623' },
              { label: 'Portfolio', val: overview.portfolioScore, color: '#A855F7' }
            ].map((stat, idx) => (
              <div key={idx} className="d-flex align-items-center gap-3">
                <span className="text-white-50 small" style={{ width: '100px' }}>{stat.label}</span>
                <div className="progress flex-grow-1" style={{ height: '6px', backgroundColor: '#22223b' }}>
                  <div className="progress-bar rounded-pill" style={{ width: `${stat.val}%`, backgroundColor: stat.color }}></div>
                </div>
                <span className="text-white fw-bold small" style={{ width: '40px', textAlign: 'right' }}>{stat.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cột 2: AI Career Fit */}
      <div className="col-lg-5">
        <div className="p-4 h-100" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '16px' }}>
          <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
            <span className="fs-5">🎯</span> AI Career Fit
          </h6>
          
          <div className="d-flex flex-column gap-2 mb-3">
            {overview.careerFits?.map((fit, idx) => (
              <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: idx === 0 ? 'rgba(52,211,153,0.1)' : '#1A1A1A' }}>
                <span className="small text-white" style={{ fontWeight: idx === 0 ? 'bold' : 'normal', color: idx === 0 ? COLORS.accentCyan : 'inherit' }}>{fit.roleName}</span>
                <span className="small fw-bold" style={{ color: idx === 0 ? COLORS.accentCyan : COLORS.textSecondary }}>{fit.matchPercentage}%</span>
              </div>
            ))}
          </div>
          
          <div className="p-2 rounded small text-white-50" style={{ borderLeft: `3px solid ${COLORS.accentCyan}`, backgroundColor: '#1A1A1A', fontStyle: 'italic', fontSize: '12px' }}>
            {overview.aiQuickSummary || "Phân tích dự án cho thấy tư duy hệ thống của bạn rất khớp với Back-end."}
          </div>
        </div>
      </div>
    </div>
  );
}