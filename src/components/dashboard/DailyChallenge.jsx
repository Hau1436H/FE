// src/components/dashboard/DailyChallenge.jsx
import React from 'react';
import { FaFire } from 'react-icons/fa';

function DailyChallenge() {
  return (
    <div className="p-3 rounded-4 mb-4 d-flex justify-content-between align-items-center position-relative overflow-hidden" 
         style={{ 
           background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', 
           border: '1px solid #1e293b' 
         }}>
      <div className="d-flex align-items-center gap-3">
        <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-3 fs-4 d-flex align-items-center justify-content-center">
          <FaFire />
        </div>
        <div>
          <div className="text-warning fw-semibold small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
            ⚡ DAILY CHALLENGE
          </div>
          <h5 className="text-white mb-1 fw-bold mt-1">Giải bài Leetcode #724 – Find Pivot Index</h5>
          <p className="text-white mb-0 small">
            Còn <span className="text-white fw-medium">6h 23m</span> • <span className="text-success fw-medium">+150 XP</span> khi hoàn thành
          </p>
        </div>
      </div>
      <button className="btn btn-success px-4 py-2 fw-semibold rounded-3 text-dark" style={{ backgroundColor: '#10b981', border: 'none' }}>
        Thử ngay
      </button>
    </div>
  );
}

export default DailyChallenge;
