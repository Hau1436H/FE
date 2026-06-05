//Phân khu quản lý Nhật ký tích lũy điểm thưởng / Gamification (Cột bên phải).

import React from 'react';
import { ACTIVITIES } from '../../../data/notificationData';

function ActivityList() {
  return (
    <div className="rounded-4 p-4 h-100" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-white mb-0" style={{ fontSize: '15px' }}>Hoạt động</h6>
        <button className="btn btn-sm text-white-50 p-0 border-0" style={{ fontSize: '12px' }}>Tháng này</button>
      </div>

      {/* Khối Tổng kết Thống kê XP hàng ngang */}
      <div className="row g-2 mb-3.5 text-center bg-secondary bg-opacity-10 rounded-3 py-2 px-1">
        <div className="col-6 border-end border-secondary border-opacity-10">
          <div className="fw-bold text-success mb-0" style={{ fontSize: '14px', color: '#10b981 !important' }}>+350</div>
          <div className="text-white-50 extra-small" style={{ fontSize: '10px' }}>XP hôm nay</div>
        </div>
        <div className="col-6">
          <div className="fw-bold text-warning mb-0" style={{ fontSize: '14px', color: '#f59e0b !important' }}>930</div>
          <div className="text-white-50 extra-small" style={{ fontSize: '10px' }}>Tổng XP tháng</div>
        </div>
      </div>

      {/* Trục hoạt động nhật ký */}
      <div className="d-flex flex-column gap-3">
        <div className="text-white-50 extra-small text-uppercase fw-bold opacity-40 mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>HÔM NAY</div>
        
        {ACTIVITIES.map((act) => (
          <div key={act.id} className="d-flex justify-content-between align-items-start pb-3 border-bottom border-secondary border-opacity-10 gap-2">
            <div>
              <div className="d-flex align-items-center gap-2 mb-0.5">
                <h6 className="fw-semibold text-white mb-0" style={{ fontSize: '13.5px' }}>{act.title}</h6>
                <span className="text-white-50 opacity-40 extra-small" style={{ fontSize: '11px' }}>{act.time}</span>
              </div>
              <p className="text-white-50 mb-2" style={{ fontSize: '12px', lineHeight: '1.4' }}>{act.desc}</p>
              <div className="d-flex gap-1.5">
                <span className="badge bg-secondary bg-opacity-20 text-white-50 px-2 py-1 rounded-2" style={{ fontSize: '11px' }}>{act.tag}</span>
                <span className="text-white-50 opacity-30 extra-small py-0.5">({act.subTag})</span>
              </div>
            </div>
            
            {/* Điểm số thưởng XP xanh lục nhảy góc phải */}
            <div className="text-success fw-bold font-monospace text-nowrap" style={{ fontSize: '13px', color: '#10b981 !important' }}>
              {act.xp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityList;
