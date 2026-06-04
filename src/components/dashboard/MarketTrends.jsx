// src/components/dashboard/MarketTrends.jsx
import React from 'react';

function MarketTrends() {
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
          <tr>
            <td className="fw-semibold text-white py-3">React / Next.js <span className="text-success small">+18%</span></td>
            <td><div className="progress" style={{ width: '80px', height: '4px' }}><div className="progress-bar bg-primary" style={{ width: '90%' }}></div></div></td>
            <td className="text-success fw-medium">18 - 28M/tháng</td>
          </tr>
          <tr>
            <td className="fw-semibold text-white py-3">TypeScript <span className="text-success small">+31%</span></td>
            <td><div className="progress" style={{ width: '80px', height: '4px' }}><div className="progress-bar bg-primary" style={{ width: '75%' }}></div></div></td>
            <td className="text-success fw-medium">20 - 35M/tháng</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MarketTrends;
