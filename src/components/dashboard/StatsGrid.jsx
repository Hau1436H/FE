// src/components/dashboard/StatsGrid.jsx
import React from 'react';
import { FaCalendarCheck, FaClock, FaAward, FaStar } from 'react-icons/fa';

function StatsGrid() {
  const stats = [
    { icon: <FaCalendarCheck />, title: "Streak", value: "12 ngày", desc: "Liên tiếp không nghỉ", color: "text-warning", bg: "bg-warning" },
    { icon: <FaClock />, title: "Giờ học", value: "47h", desc: "Trong tuần này", color: "text-info", bg: "bg-info" },
    { icon: <FaAward />, title: "Skills", value: "18", desc: "Kỹ năng hoàn thành", color: "text-success", bg: "bg-success" },
    { icon: <FaStar />, title: "Điểm XP", value: "2,840", desc: "Tổng điểm tích luỹ", color: "text-danger", bg: "bg-danger" },
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((stat, index) => (
        <div className="col-12 col-sm-6 col-xl-3" key={index}>
          <div className="p-3 rounded-4 d-flex align-items-center justify-content-between h-100" 
               style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
            <div>
              <span className="text-muted small" style={{ fontSize: '13px' }}>{stat.title}</span>
              <h3 className="text-white my-1 fw-bold">{stat.value}</h3>
              <span className="text-muted extra-small" style={{ fontSize: '11px' }}>{stat.desc}</span>
            </div>
            {/* Đã sửa lỗi: item.icon chuyển thành stat.icon chuẩn xác */}
            <div className={`p-3 ${stat.bg} bg-opacity-10 ${stat.color} rounded-4 fs-4 d-flex align-items-center justify-content-center`} 
                 style={{ width: '52px', height: '52px' }}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;
