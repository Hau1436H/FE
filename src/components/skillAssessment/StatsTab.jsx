// src/components/skillAssessment/StatsTab.jsx
// Đã gỡ bỏ `import React from 'react'` để fix lỗi "React is defined but never used"
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Component này nhận testResult chứa thông tin đã lưu từ API trả về
function StatsTab({ result, onNavigateToRoadmap }) {
  const { hasTaken = false, score = 0, total = 0, aiFeedback = '' } = result || {};

  const percentScore = total > 0 ? Math.round((score / total) * 100) : 0;

  // Thuật toán giả lập phân bổ radar chart dựa trên tổng điểm (Vì API BE chưa có endpoint chia điểm theo mảng nhỏ)
  const baseSkills = hasTaken 
    ? [percentScore, Math.min(percentScore + 15, 100), Math.max(percentScore - 10, 20), Math.min(percentScore + 5, 95), percentScore]
    : [0, 0, 0, 0, 0];

  const radarData = {
    labels: ['Logic & Cú pháp', 'Ứng dụng Core', 'Kiến trúc & API', 'Tối ưu hóa', 'Quản lý State'],
    datasets: [
      {
        label: 'Điểm năng lực hiện tại (%)',
        data: baseSkills,
        backgroundColor: 'rgba(25, 135, 84, 0.2)',
        borderColor: '#198754',
        borderWidth: 2,
        pointBackgroundColor: '#ffc107',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#198754',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, angleLines: { color: 'rgba(255, 255, 255, 0.1)' }, pointLabels: { color: '#fff' }, ticks: { display: false, max: 100, min: 0 } }
    },
    plugins: { legend: { labels: { color: '#fff' } } },
    maintainAspectRatio: false
  };

  return (
    <div className="row g-4 text-white">
      <div className="col-lg-6">
        <div className="card h-100 border-secondary border-opacity-25 p-4 d-flex flex-column justify-content-between" style={{ backgroundColor: '#0b0c16' }}>
          <div>
            <span className="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 mb-3 px-3 py-2 rounded-pill">
              Báo cáo từ AI Expert
            </span>
            <h3 className="fw-bold text-white mb-3">Phân Tích Khung Năng Lực</h3>
            
            {hasTaken ? (
              <>
                <div className="bg-dark bg-opacity-20 p-3 rounded-3 border border-secondary border-opacity-10 mb-4">
                  <h4 className="text-warning fw-bold mb-0">👉 Đúng {score}/{total} câu (Đạt {percentScore}%)</h4>
                </div>
                {/* Đổ dữ liệu thật từ Backend vào đây */}
                <p className="text-white-50 lh-base" style={{ whiteSpace: 'pre-line' }}>
                  {aiFeedback || "Hệ thống AI đang xử lý đánh giá chi tiết cho bạn..."}
                </p>
              </>
            ) : (
              <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning rounded-3 small mb-4">
                ⚠️ Hãy hoàn thành tab "Assessment Test" để nhận phân tích chính xác.
              </div>
            )}
          </div>

          <div className="pt-4 border-top border-secondary border-opacity-10 mt-4 d-flex gap-2">
            <button className="btn btn-outline-success flex-grow-1 py-2 fw-medium" onClick={onNavigateToRoadmap}>
              Xem lộ trình học tập 🗺️
            </button>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card h-100 border-secondary border-opacity-25 p-4" style={{ backgroundColor: '#0b0c16', minHeight: '400px' }}>
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>
    </div>
  );
}

export default StatsTab;