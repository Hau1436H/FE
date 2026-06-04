// src/components/dashboard/MarketTrends.jsx
import React, { useState } from 'react';

function MarketTrends() {
  // Khởi tạo State chứa danh sách dữ liệu động xu hướng thị trường
  const [trends, setTrends] = useState([
    {
      id: 1,
      skillName: "React / Next.js",
      growth: 18,
      demandPercentage: 90,
      salaryRange: "18 - 28M/tháng"
    },
    {
      id: 2,
      skillName: "TypeScript",
      growth: 31,
      demandPercentage: 75,
      salaryRange: "20 - 35M/tháng"
    }
  ]);

  return (
    <div className="p-4 rounded-4" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
      <h6 className="fw-bold text-white mb-3">Xu hướng thị trường tuyển dụng</h6>
      <table className="table table-dark table-borderless align-middle mb-0 small">
        <thead>
          <tr className="text-muted" style={{ borderBottom: '1px solid #1e2235' }}>
            <th>Kỹ năng hot</th>
            <th>Nhu cầu</th>
            <th>Mức lương</th>
          </tr>
        </thead>
        <tbody>
          {/* Duyệt qua mảng dữ liệu động bằng vòng lặp .map() */}
          {trends.map((item) => (
            <tr key={item.id}>
              <td className="fw-semibold text-white py-3">
                {item.skillName}{" "}
                <span className="text-success small">
                  +{item.growth}%
                </span>
              </td>
              <td>
                <div className="progress" style={{ width: '80px', height: '4px', backgroundColor: '#22223b' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ 
                      width: `${item.demandPercentage}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  ></div>
                </div>
              </td>
              <td className="text-success fw-medium">
                {item.salaryRange}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarketTrends;
