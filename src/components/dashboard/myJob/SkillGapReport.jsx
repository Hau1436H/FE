// src/components/dashboard/myJob/SkillGapReport.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ĐÃ THÊM: Import hook điều hướng
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import axiosClient from '../../../api/axiosClient';

function SkillGapReport({ studentId }) {
  const navigate = useNavigate(); // ĐÃ THÊM: Khởi tạo hook
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGapData = async () => {
      if (!studentId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API thật từ Backend
        const response = await axiosClient.get(`/api/SkillGapReports/${studentId}/generate`);
        const rawData = response.data?.data || response.data || [];
        
        // Xử lý dữ liệu BE trả về cho khớp với format của Recharts
        const formattedData = rawData.map(item => ({
          subject: item.nodeName || item.skillName || item.subject || 'Unknown Skill',
          current: item.currentScore || item.current || 0,
          required: item.targetScore || item.required || item.requiredScore || 0,
          fullMark: 100
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu Skill Gap:", err);
        setError("Không thể tải báo cáo phân tích. Vui lòng kiểm tra lại kết nối hoặc Backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchGapData();
  }, [studentId]);

  // Tính toán những kỹ năng bị thiếu hụt (Gap)
  const gaps = data
    .filter(item => item.current < item.required)
    .sort((a, b) => (b.required - b.current) - (a.required - a.current));

  // Giao diện khi đang tải API
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info mb-3"></div>
        <p className="text-white-50">AI đang tổng hợp và phân tích dữ liệu kỹ năng của bạn...</p>
      </div>
    );
  }

  // Giao diện khi API lỗi
  if (error) {
    return (
      <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-danger text-center py-4">
        <i className="bi bi-exclamation-triangle-fill fs-2 d-block mb-2"></i>
        {error}
      </div>
    );
  }

  // Giao diện khi API trả về mảng rỗng (User chưa có Target Role)
  if (data.length === 0) {
    return (
      <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-warning text-center py-4">
        <i className="bi bi-info-circle fs-2 d-block mb-2"></i>
        Chưa có đủ dữ liệu để phân tích. Hãy đảm bảo bạn đã chọn "Mục tiêu nghề nghiệp" trong phần Hồ sơ nhé.
      </div>
    );
  }

  return (
    <div className="row">
      {/* CỘT TRÁI: BIỂU ĐỒ RADAR */}
      <div className="col-12 col-lg-7 mb-4 mb-lg-0">
        <div className="bg-black bg-opacity-25 rounded-4 p-3 border border-secondary border-opacity-25 h-100 d-flex flex-column">
          <h6 className="text-white-50 text-center mb-3">Tương quan năng lực so với Yêu cầu (Target Role)</h6>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                
                {/* Đường màu Đỏ: Yêu cầu của thị trường */}
                <Radar name="Yêu cầu (Target Role)" dataKey="required" stroke="#dc3545" fill="#dc3545" fillOpacity={0.2} />
                
                {/* Đường màu Xanh: Năng lực hiện tại của User */}
                <Radar name="Năng lực của bạn" dataKey="current" stroke="#17a2b8" fill="#17a2b8" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: DANH SÁCH KHUYẾN NGHỊ */}
      <div className="col-12 col-lg-5">
        <div className="bg-black bg-opacity-25 rounded-4 p-4 border border-secondary border-opacity-25 h-100">
          <h6 className="text-warning fw-bold mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>Các kỹ năng cần bổ sung (Gap)
          </h6>
          
          {gaps.length > 0 ? (
            <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '350px' }}>
              {gaps.map((item, index) => {
                const gapSize = item.required - item.current;
                let priority = "Thấp";
                let badgeColor = "bg-secondary";
                
                if (gapSize >= 40) { priority = "Cao"; badgeColor = "bg-danger"; }
                else if (gapSize >= 20) { priority = "Trung bình"; badgeColor = "bg-warning text-dark"; }

                return (
                  <div key={index} className="p-3 border border-secondary border-opacity-25 rounded bg-dark bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-white">{item.subject}</span>
                      <span className={`badge ${badgeColor}`}>Ưu tiên: {priority}</span>
                    </div>
                    <div className="d-flex justify-content-between text-white-50 small mb-2">
                      <span>Hiện tại: <strong className="text-info">{item.current}%</strong></span>
                      <span>Mục tiêu: <strong className="text-danger">{item.required}%</strong></span>
                    </div>
                    <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <div className="progress-bar bg-info" role="progressbar" style={{ width: `${item.current}%` }}></div>
                      <div className="progress-bar bg-danger progress-bar-striped progress-bar-animated opacity-50" role="progressbar" style={{ width: `${gapSize}%` }}></div>
                    </div>

                    {/* ĐÃ THÊM: Nút bấm dẫn sang Learning Hub với từ khóa */}
                    <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top border-secondary border-opacity-25">
                      <span className="text-white-50 small" style={{ fontSize: '12px' }}>Hệ thống đã chuẩn bị bài học</span>
                      <button 
                        className="btn btn-sm btn-outline-info rounded-pill px-3 transition-all"
                        style={{ fontSize: '12px' }}
                        onClick={() => navigate(`/dashboard/learning?skill=${encodeURIComponent(item.subject)}`)}
                      >
                        <i className="bi bi-play-circle me-1"></i>Học ngay
                      </button>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="alert alert-success bg-opacity-10 border-success text-success text-center py-4 h-100 d-flex flex-column justify-content-center">
              <i className="bi bi-check-circle-fill fs-1 d-block mb-2"></i>
              Tuyệt vời! Kỹ năng của bạn đã đáp ứng đầy đủ yêu cầu của vị trí mục tiêu. Hãy tự tin ứng tuyển nhé!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillGapReport;