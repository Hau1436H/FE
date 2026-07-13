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

  // CÁCH FIX 1: Làm tròn điểm số để hiển thị đẹp hơn (vd: 13.3)
  const displayScore = score % 1 !== 0 ? score.toFixed(1) : score;

  // CÁCH FIX 2: Bổ sung thuộc tính 'label' và thêm đủ 3 điểm để vẽ được hình tam giác
  const [chartData, setChartData] = useState({
    labels: ['Dữ liệu trống', 'Dữ liệu trống', 'Dữ liệu trống'],
    datasets: [{ 
      label: 'Khung năng lực cốt lõi (%)', // <-- Hết bị lỗi undefined
      data: [0, 0, 0], 
      backgroundColor: 'rgba(25, 135, 84, 0.2)', 
      borderColor: '#198754',
      borderWidth: 2,
    }]
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
        const historyData = response.data?.data || response.data || [];

        if (historyData.length > 0) {
          const nodeScores = {};
          historyData.forEach(item => {
            const nodeName = item.nodeName || 'Kỹ năng';
            const currentScorePercent = (item.testScore || 0) * 10; 
            
            if (!nodeScores[nodeName] || nodeScores[nodeName] < currentScorePercent) {
              nodeScores[nodeName] = currentScorePercent;
            }
          });

          const labels = Object.keys(nodeScores);
          const dataPoints = Object.values(nodeScores);

          // CÁCH FIX CỰC XỊN Ở ĐÂY:
          // Danh sách các kỹ năng cốt lõi ảo để độn vào nếu dữ liệu thật chưa đủ 3 điểm
          const placeholderSkills = ['Tư duy logic', 'Clean Code', 'Kiến trúc hệ thống', 'Tối ưu hiệu suất'];
          let placeholderIndex = 0;

          // Fill cho đủ ít nhất 3 (thậm chí 4 hoặc 5 điểm sẽ làm hình đa giác đẹp hơn)
          // Ở đây mình ép nó lên tối thiểu 4 điểm để ra hình thoi thay vì tam giác
          while (labels.length < 4) { 
            labels.push(placeholderSkills[placeholderIndex]);
            
            // Có thể để 0, hoặc để 10-20 để nó nhô ra một chút tạo hình khối giọt nước đẹp mắt
            dataPoints.push(15); 
            
            placeholderIndex++;
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
                  {/* Cập nhật biến displayScore ở đây */}
                  <h4 className="text-warning fw-bold mb-0">👉 Tổng Điểm: {displayScore}/{total} (Đạt {percentScore}%)</h4>
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