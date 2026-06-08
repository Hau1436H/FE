// .\src\components\skillAssessment\StatsTab.jsx
import React from 'react';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function StatsTab({ result, onNavigateToRoadmap }) {
  const { hasTaken, score, total } = result;

  const percentScore = total > 0 ? Math.round((score / total) * 100) : 0;

  const baseSkills = hasTaken 
    ? [percentScore, Math.min(percentScore + 15, 100), Math.max(percentScore - 10, 20), Math.min(percentScore + 5, 95), 50]
    : [40, 55, 30, 45, 35];

  const radarData = {
    labels: ['Logic & Cú pháp', 'Ứng dụng React/Hooks', 'Kiến trúc API (Axios)', 'Tối ưu hóa UI/CSS', 'Quản lý State'],
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
      r: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#fff',
          font: { size: 12, weight: '500' }
        },
        ticks: {
          display: false,
          max: 100,
          min: 0,
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#fff', font: { size: 13 } }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="row g-4 text-white">
      {/* CỘT TRÁI: Thẻ trạng thái & Lộ trình phân tích bằng chữ */}
      <div className="col-lg-6">
        <div className="card h-100 border-secondary border-opacity-25 p-4 d-flex flex-column justify-content-between" style={{ backgroundColor: '#0b0c16' }}>
          <div>
            <span className="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 mb-3 px-3 py-2 rounded-pill">
              Báo cáo từ AI Expert
            </span>
            <h3 className="fw-bold text-white mb-3">Phân Tích Khung Năng Lực</h3>
            
            {hasTaken ? (
              <div className="bg-dark bg-opacity-20 p-3 rounded-3 border border-secondary border-opacity-10 mb-4">
                <p className="mb-2 text-white-50">Kết quả ghi nhận từ hệ thống:</p>
                <h4 className="text-warning fw-bold mb-0">👉 Đúng {score}/{total} câu (Đạt {percentScore}%)</h4>
              </div>
            ) : (
              <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning rounded-3 small mb-4">
                ⚠️ Bạn đang xem số liệu mẫu. Hãy hoàn thành tab "Assessment Test" để nhận phân tích chính xác từ AI.
              </div>
            )}

            <p className="text-white-50 lh-base">
              Dựa trên biểu đồ phản chiếu, tư duy giải thuật và khả năng vận dụng công cụ lập trình cốt lõi của bạn phân cấp ở mức trung bình khá. Kỹ năng thiết kế logic đang vượt trội hơn mảng tối ưu hóa cấu trúc dữ liệu.
            </p>

            <div className="mt-4">
              <h6 className="text-success fw-bold mb-3">🛠️ Lộ trình khuyến nghị tiếp theo:</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 text-white-50 small">
                <li className="d-flex align-items-center gap-2">
                  <span className="text-success">✔</span> Tập trung học sâu cơ chế Render và Re-render của React Core.
                </li>
                <li className="d-flex align-items-center gap-2">
                  <span className="text-success">✔</span> Thực hành tối ưu hóa Error Handling với Interceptors của Axios.
                </li>
                <li className="d-flex align-items-center gap-2">
                  <span className="text-success">✔</span> Tăng cường làm bài tập tình huống thực tế để cải thiện tốc độ phản xạ.
                </li>
              </ul>
            </div>
          </div>

          {/* Phần chứa 2 nút bấm ở chân Card */}
          <div className="pt-4 border-top border-secondary border-opacity-10 mt-4 d-flex gap-2">
            <button className="btn btn-success flex-grow-1 py-2 fw-medium">
              📥 Tải báo cáo PDF
            </button>
            
            {/* ĐÃ CẬP NHẬT: Đổi từ btn-outline-primary sang btn-outline-success để bo viền xanh lá đồng bộ */}
            <button 
              className="btn btn-outline-success flex-grow-1 py-2 fw-medium"
              onClick={onNavigateToRoadmap}
            >
              Xem lộ trình học tập 🗺️
            </button>
          </div>

        </div>
      </div>

      {/* CỘT PHẢI: Khối Biểu đồ Radar */}
      <div className="col-lg-6">
        <div className="card h-100 border-secondary border-opacity-25 p-4 align-items-center justify-content-center" style={{ backgroundColor: '#0b0c16', minHeight: '400px' }}>
          <div className="w-100 text-center text-white-50 small mb-2 fw-semibold">
            SƠ ĐỒ RADAR PHÂN BỔ KỸ NĂNG CHUYÊN MÔN
          </div>
          <div className="w-100 h-100 position-relative" style={{ minHeight: '350px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsTab;