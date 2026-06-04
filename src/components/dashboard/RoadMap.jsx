// src/components/dashboard/RoadMap.jsx
import React from 'react';

function RoadMap() {
  return (
    <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
      <h6 className="fw-bold text-white mb-3">Học tiếp gì?</h6>
      <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: '#161925' }}>
        <span className="badge bg-primary mb-2">Đang học</span>
        <div className="fw-bold mb-1">Data Structures - Trees & Graphs</div>
        <div className="text-muted extra-small mb-3" style={{ fontSize: '12px' }}>Trung cấp • 3h còn lại</div>
        <button className="btn btn-outline-success btn-sm w-100 rounded-2">Tiếp tục học</button>
      </div>
    </div>
  );
}

export default RoadMap;
