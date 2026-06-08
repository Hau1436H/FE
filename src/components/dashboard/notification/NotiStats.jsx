import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';


function NotiStats({ stats }) {
  return (
    <div className="row g-3 mb-4">
      {stats.map((stat) => (
        <div key={stat.id} className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4 d-flex align-items-center gap-3" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
            {/* Vùng icon màu sắc */}
            <div 
              className="fs-4 p-2 rounded-3 d-flex align-items-center justify-content-center" 
              style={{ backgroundColor: stat.bg, color: stat.color, width: '46px', height: '46px' }}
            >
              <i className={stat.icon} style={{ color: stat.color, fontSize: '20px' }}></i>
            </div>
            
            {/* Vùng số liệu đếm tự động */}
            <div>
              <div className="d-flex align-items-baseline gap-1.5">
                <h5 className="fw-bold text-white mb-0" style={{ fontSize: '18px' }}>{stat.count}</h5>
                <small className="text-success extra-small fw-medium" style={{ fontSize: '11px' }}>{stat.desc}</small>
              </div>
              <small className="text-white-50 text-nowrap d-block mt-0.5" style={{ fontSize: '12px' }}>{stat.label}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotiStats;
