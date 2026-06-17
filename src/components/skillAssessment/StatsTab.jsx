// src/components/skillAssessment/StatsTab.jsx
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import axiosClient from '../../api/axiosClient';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function StatsTab({ result, onNavigateToRoadmap }) {
  const hasTaken = result?.hasTaken || false;
  
  const rawScore = parseFloat(result?.score);
  const rawTotal = parseFloat(result?.total);
  const score = isNaN(rawScore) ? 0 : rawScore;
  const total = isNaN(rawTotal) || rawTotal === 0 ? 10 : rawTotal;
  const percentScore = Math.round((score / total) * 100);

  const [chartData, setChartData] = useState({
    labels: ['Chưa có dữ liệu'],
    datasets: [{ data: [0], backgroundColor: 'rgba(25, 135, 84, 0.2)', borderColor: '#198754' }]
  });

  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.studentId || payload.StudentId || payload.sub || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch (e) { return null; }
  };

  // FETCH DỮ LIỆU THẬT TỪ DATABASE ĐỂ VẼ BIỂU ĐỒ
  useEffect(() => {
    const fetchHistoryForChart = async () => {
      const studentId = getStudentId();
      if (!studentId || !hasTaken) return;

      try {
        const response = await axiosClient.get(`/api/assessments/my-history/${studentId}`);
        const historyData = response.data.data || response.data || [];

        if (historyData.length > 0) {
          // Gom nhóm điểm số cao nhất theo từng môn học (Node)
          const nodeScores = {};
          historyData.forEach(item => {
            const nodeName = item.nodeName || 'Kỹ năng';
            // Điểm BE trả về là thang 10, nhân 10 để ra %
            const currentScorePercent = (item.testScore || 0) * 10; 
            
            if (!nodeScores[nodeName] || nodeScores[nodeName] < currentScorePercent) {
              nodeScores[nodeName] = currentScorePercent;
            }
          });

          const labels = Object.keys(nodeScores);
          const dataPoints = Object.values(nodeScores);

          // Nếu chỉ có 1-2 kỹ năng, chart radar nhìn sẽ là 1 đường thẳng. 
          // Cần ít nhất 3 điểm để vẽ đa giác. Ta fill thêm placeholder nếu thiếu.
          while (labels.length < 3) {
            labels.push('Kỹ năng khác');
            dataPoints.push(0);
          }

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Khung năng lực cốt lõi (%)',
                data: dataPoints,
                backgroundColor: 'rgba(25, 135, 84, 0.2)',
                borderColor: '#198754',
                borderWidth: 2,
                pointBackgroundColor: '#ffc107',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#198754',
              },
            ],
          });
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu vẽ chart:", error);
      }
    };

    fetchHistoryForChart();
  }, [hasTaken]);

  const radarOptions = {
    scales: {
      r: { 
        grid: { color: 'rgba(255, 255, 255, 0.1)' }, 
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' }, 
        pointLabels: { color: '#fff', font: { size: 12 } }, 
        ticks: { display: false, max: 100, min: 0 } 
      }
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
                  <h4 className="text-warning fw-bold mb-0">👉 Tổng Điểm: {score}/{total} (Đạt {percentScore}%)</h4>
                </div>
                <div className="text-white-50 lh-base" style={{ whiteSpace: 'pre-line', maxHeight: '250px', overflowY: 'auto' }}>
                  {result?.aiFeedback || "Hệ thống AI đang xử lý đánh giá chi tiết cho bạn..."}
                </div>
              </>
            ) : (
              <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning rounded-3 small mb-4">
                ⚠️ Hãy hoàn thành bài kiểm tra để nhận phân tích chính xác.
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
          <Radar data={chartData} options={radarOptions} />
        </div>
      </div>
    </div>
  );
}

export default StatsTab;