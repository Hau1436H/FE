// src/components/dashboard/Dashboard.jsx
import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DailyChallenge from '../components/dashboard/DailyChallenge';
import StatsGrid from '../components/dashboard/StatsGrid';

function Dashboard() {
  return (
    <div className="d-flex" style={{ backgroundColor: '#020205', minHeight: '100vh', fontFamily: 'system-ui' }}>
      {/* Cột cố định Menu trái */}
      <Sidebar />

      {/* Khu vực nội dung hiển thị chính */}
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh' }}>
        {/* Thanh tìm kiếm và lời chào trên cùng */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0 text-white">Chào buổi chiều, Minh Tú! 👋</h4>
            <span className="text-muted small">Streak 12 ngày • 2,840 điểm</span>
          </div>
          <div style={{ width: '300px' }}>
            <input 
              type="text" 
              placeholder="Tìm kỹ năng, bài học..." 
              className="form-control border-0 text-white placeholder-muted py-2 px-3 small rounded-3" 
              style={{ backgroundColor: '#0f111a', fontSize: '14px', border: '1px solid #1e2235 !important' }} 
            />
          </div>
        </div>

        {/* Khối thử thách hàng ngày */}
        <DailyChallenge />

        {/* Khối 4 thẻ thông số */}
        <StatsGrid />

        {/* Khối chia 2 Cột Layout Phía Dưới */}
        <div className="row g-4">
          
          {/* Cột Bên Trái: Lộ trình và Xu hướng tuyển dụng */}
          <div className="col-12 col-lg-8">
            {/* Box Lộ trình học tập */}
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

            {/* Box Xu hướng thị trường */}
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
          </div>

          {/* Cột Bên Phải: Học tiếp gì và Hoạt động gần đây */}
          <div className="col-12 col-lg-4">
            {/* Khối gợi ý học tiếp */}
            <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
              <h6 className="fw-bold text-white mb-3">Học tiếp gì?</h6>
              <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: '#161925' }}>
                <span className="badge bg-primary mb-2">Đang học</span>
                <div className="fw-bold mb-1">Data Structures - Trees & Graphs</div>
                <div className="text-muted extra-small mb-3" style={{ fontSize: '12px' }}>Trung cấp • 3h còn lại</div>
                <button className="btn btn-outline-success btn-sm w-100 rounded-2">Tiếp tục học</button>
              </div>
            </div>

            {/* Khối hoạt động gần đây */}
            <div className="p-4 rounded-4" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
              <h6 className="fw-bold text-white mb-3">Hoạt động gần đây</h6>
              <div className="d-flex flex-column gap-3 small">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Hoàn thành bài: Git Merge vs Rebase</span>
                  <span className="text-success fw-medium">+50 XP</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Làm bài test JavaScript - Đạt 87%</span>
                  <span className="text-success fw-medium">+120 XP</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
