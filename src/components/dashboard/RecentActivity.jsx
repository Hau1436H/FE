// src/components/dashboard/RecentActivity.jsx
import React from 'react';

function RecentActivity() {
  return (
    <div className="p-4 rounded-4" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
      <h6 className="fw-bold text-white mb-3">Hoạt động gần đây</h6>
      <div className="d-flex flex-column gap-3 small">
        <div className="d-flex justify-content-between">
          <span className="text-white-50">Hoàn thành bài: Git Merge vs Rebase</span>
          <span className="text-success fw-medium">+50 XP</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-white-50">Làm bài test JavaScript - Đạt 87%</span>
          <span className="text-success fw-medium">+120 XP</span>
        </div>
      </div>
    </div>
  );
}

export default RecentActivity;
