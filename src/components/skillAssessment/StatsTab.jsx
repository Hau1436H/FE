import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function StatsTab({ result, onNavigateToRoadmap }) {
  const hasTaken = result?.hasTaken || false;
  
  // Điểm thành phần từ result
  const quizScore = parseFloat(result?.quizScore) || 0; // Thang 10
  const codeScore = parseFloat(result?.codeScore) || 0; // Thang 10
  const totalScore = parseFloat(result?.score) || (quizScore + codeScore);
  const percentScore = Math.round((totalScore / 20) * 100);

  // Tính toán các chỉ số cho Radar Chart dựa trên bài thi thật
  // Tránh việc để các trục = 0 làm chart bị co thành 1 đường thẳng
  const logicScore = Math.max(Math.round(quizScore * 10), 30); 
  const codeQualityScore = Math.max(Math.round(codeScore * 10), 20);
  const systemArchitectureScore = Math.max(Math.round(((quizScore + codeScore) / 2) * 8), 25);
  const speedScore = Math.min(Math.max(percentScore + 5, 40), 95);

  const chartData = {
    labels: ['Kiến thức Lý thuyết', 'Tư duy Thuật toán', 'Clean Code', 'Kiến trúc & Tối ưu'],
    datasets: [
      {
        label: 'Khung năng lực hiện tại (%)',
        data: [
          Math.round(quizScore * 10), 
          logicScore, 
          codeQualityScore, 
          systemArchitectureScore
        ],
        backgroundColor: 'rgba(25, 135, 84, 0.25)',
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
        grid: { color: 'rgba(255, 255, 255, 0.15)' }, 
        angleLines: { color: 'rgba(255, 255, 255, 0.15)' }, 
        pointLabels: { color: '#e0e0e0', font: { size: 12, weight: 'bold' } }, 
        ticks: { display: false, max: 100, min: 0 } 
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
    <div className="row g-4 text-white mx-auto" style={{ maxWidth: '1100px' }}>
      
      {/* CỘT BÊN TRÁI: ĐIỂM SỐ & CHỈ SỐ BÀI TEST */}
      <div className="col-lg-6">
        <div className="card border-secondary border-opacity-25 p-4 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: '#0b0c16' }}>
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">
                🤖 Báo cáo AI Reviewer
              </span>
              <span className="text-white-50 small">Trạng thái: <strong className="text-success">Đã phân tích</strong></span>
            </div>

            <h4 className="fw-bold text-white mb-4">Kết Quả Đánh Giá Chi Tiết</h4>

            {/* 3 THẺ KPI ĐIỂM SỐ HÀNG NGANG */}
            <div className="row g-2 mb-4">
              <div className="col-4">
                <div className="p-3 rounded-3 text-center border border-secondary border-opacity-25 bg-dark bg-opacity-50">
                  <span className="text-white-50 d-block small mb-1">Lý thuyết</span>
                  <strong className="fs-5 text-info">{quizScore}/10</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded-3 text-center border border-secondary border-opacity-25 bg-dark bg-opacity-50">
                  <span className="text-white-50 d-block small mb-1">Thực hành</span>
                  <strong className="fs-5 text-warning">{codeScore}/10</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded-3 text-center border border-success border-opacity-25 bg-success bg-opacity-10">
                  <span className="text-success d-block small mb-1">Tổng điểm</span>
                  <strong className="fs-5 text-success">{totalScore}/20</strong>
                </div>
              </div>
            </div>

            {/* NHẬN XÉT CHI TIẾT TỪ AI */}
            <div className="bg-dark bg-opacity-40 p-3 rounded-3 border border-secondary border-opacity-25 mb-3">
              <h6 className="fw-bold text-warning mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-lightbulb-fill"></i> Đánh giá từ Hệ thống:
              </h6>
              <div className="text-white-50 small lh-base custom-scrollbar" style={{ maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-line' }}>
                {result?.aiFeedback && result.aiFeedback !== "Nộp bài, chấm điểm và cập nhật lộ trình hoàn tất!" 
                  ? result.aiFeedback 
                  : `• Kiến thức lý thuyết đạt ${(quizScore * 10)}%: Cần chú ý củng cố thêm kiến thức nền tảng.\n• Kỹ năng lập trình đạt ${(codeScore * 10)}%: Code chạy ổn định, tiếp tục phát huy tư duy tối ưu thuật toán.`
                }
              </div>
            </div>
          </div>

          {/* NÚT CHUYỂN SANG ROADMAP */}
          <div className="pt-3 border-top border-secondary border-opacity-10 mt-3">
            <button className="btn btn-success w-100 py-2.5 fw-bold d-flex justify-content-center align-items-center gap-2 shadow" onClick={onNavigateToRoadmap}>
              Chuyển sang Lộ trình học tập cá nhân hóa 🚀
            </button>
          </div>
        </div>
      </div>

      {/* CỘT BÊN PHẢI: RADAR CHART NĂNG LỰC */}
      <div className="col-lg-6">
        <div className="card border-secondary border-opacity-25 p-4 h-100 d-flex flex-column" style={{ backgroundColor: '#0b0c16', minHeight: '420px' }}>
          <div className="mb-2">
            <h5 className="fw-bold text-white mb-1">Sơ Đồ Biểu Đồ Năng Lực (Skill Matrix)</h5>
            <p className="text-white-50 small">Đánh giá đa chiều dựa trên câu hỏi Quiz và Code Review</p>
          </div>
          <div className="flex-grow-1 position-relative d-flex justify-content-center align-items-center">
            <Radar data={chartData} options={radarOptions} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default StatsTab;