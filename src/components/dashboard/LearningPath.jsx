// src/components/dashboard/LearningPath.jsx
import React from 'react';

function LearningPath() {
  return (
    <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-white mb-0">Lộ trình của tôi</h6>
        <span className="text-success small fw-medium">53% tổng tiến độ</span>
      </div>
      
      <div className="p-3 rounded-3" style={{ backgroundColor: '#161925', borderLeft: '4px solid #10b981' }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold">Nền tảng Lập trình</span>
          <span className="text-success fw-bold">68%</span>
        </div>
        <div className="progress" style={{ height: '6px', backgroundColor: '#22223b' }}>
          <div className="progress-bar bg-success" style={{ width: '68%' }}></div>
        </div>
      </div>
      
      <div className="mt-3 d-flex flex-column gap-2 small text-muted">
        <div className="d-flex align-items-center gap-2 text-white opacity-75">🟢 HTML5 & CSS3 nâng cao</div>
        <div className="d-flex align-items-center gap-2 text-white opacity-75">🟢 JavaScript ES2024</div>
        <div className="d-flex align-items-center gap-2 text-white opacity-75">🟡 Data Structures cơ bản (60%)</div>
      </div>
    </div>
  );
}

export default LearningPath;
