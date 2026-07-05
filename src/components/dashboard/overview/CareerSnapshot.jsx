import React from 'react';
import { FaBriefcase } from 'react-icons/fa';

const COLORS = { accentCyan: '#34D399', textSecondary: '#8C8C8C' };

export default function CareerSnapshot({ overview }) {
  if (!overview) return null;

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.02))', border: `1px solid rgba(52,211,153,0.25)`, borderRadius: '16px', padding: '24px' }}>
      <div className="row align-items-center gap-3 gap-md-0">
        <div className="col-md-3">
          <div className="text-white-50 small text-uppercase">Vị trí mục tiêu</div>
          <h4 className="fw-bold text-white m-0 d-flex align-items-center gap-2 mt-1">
            <FaBriefcase style={{ color: COLORS.accentCyan }} /> {overview.targetRoleName}
          </h4>
        </div>
        
        <div className="col-md-5">
          <div className="d-flex justify-content-between text-white-50 small mb-1">
            <span>Độ sẵn sàng (Readiness Score)</span>
            <span style={{ color: COLORS.accentCyan, fontWeight: 700 }}>{overview.readinessScore}%</span>
          </div>
          <div className="progress rounded-pill" style={{ height: '8px', backgroundColor: '#22223b' }}>
            <div className="progress-bar rounded-pill" style={{ width: `${overview.readinessScore}%`, backgroundColor: COLORS.accentCyan }}></div>
          </div>
        </div>

        <div className="col-md-4 ps-md-4 border-start border-secondary border-opacity-25">
          <div className="d-flex align-items-start gap-2 small">
            <span className="fs-4">🤖</span>
            <p className="m-0" style={{ color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: '1.5' }}>
              {overview.aiQuickSummary || "Tiếp tục duy trì tiến độ để đạt chuẩn Job Market nhé!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}