import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import axiosClient from '../../../api/axiosClient';

function SkillGapReport({ studentId }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGapData = async () => {
      if (!studentId) {
        setLoading(false); 
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosClient.get(`/api/SkillGapReports/${studentId}/skill-gap`);
        const resultObject = response.data?.data || response.data;
        const rawData = resultObject.gapItems || resultObject.GapItems || [];
        
        setAiSummary(resultObject.latentTalentSummary || resultObject.LatentTalentSummary || "");
        setRoleName(resultObject.targetRoleName || resultObject.TargetRoleName || "Chưa xác định");
        
        const formattedData = rawData.map(item => {
          const current = item.currentScore || item.current || 0;
          const required = item.targetScore || item.required || 80;
          return {
            subject: item.nodeName || item.skillName || item.subject || 'Unknown Skill',
            current: current,
            required: required,
            gap: Math.max(0, required - current)
          };
        });

        setData(formattedData);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu Skill Gap:", err);
        setError("Không thể tải báo cáo phân tích. Vui lòng kiểm tra lại kết nối.");
      } finally {
        setLoading(false); 
      }
    };

    fetchGapData();
  }, [studentId]);

  // CÁC CHỈ SỐ THỐNG KÊ NHANH (KPI METRICS)
  const totalSkills = data.length;
  const passedSkills = data.filter(i => i.current >= i.required).length;
  const highPriorityGaps = data.filter(i => i.gap >= 40).length;
  const readinessPercentage = totalSkills > 0 ? Math.round((passedSkills / totalSkills) * 100) : 0;

  const filteredGaps = data
    .filter(item => item.gap > 0)
    .filter(item => item.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.gap - a.gap);

  const chartData = data
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 7); // Lấy Top 7 để biểu đồ thoáng đẹp

  if (loading) {
    return (
      <div className="text-center py-5 text-white">
        <div className="spinner-border text-info mb-3"></div>
        <p className="text-white-50">AI đang tổng hợp và đối soát dữ liệu kỹ năng của bạn...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="d-flex flex-column gap-4 text-white">
      
      {/* 1. THANH CHỈ SỐ KPI TỔNG QUAN (MỚI BỔ SUNG) */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="p-3 rounded-4 bg-dark bg-opacity-75 border border-secondary border-opacity-25 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info fs-3">
              <i className="bi bi-speedometer2"></i>
            </div>
            <div>
              <span className="text-white-50 small d-block">Độ sẵn sàng tuyển dụng</span>
              <h4 className="fw-bold text-info mb-0">{readinessPercentage}%</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="p-3 rounded-4 bg-dark bg-opacity-75 border border-secondary border-opacity-25 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success fs-3">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <div>
              <span className="text-white-50 small d-block">Kỹ năng đã đạt chuẩn</span>
              <h4 className="fw-bold text-success mb-0">{passedSkills} / {totalSkills}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="p-3 rounded-4 bg-dark bg-opacity-75 border border-secondary border-opacity-25 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger fs-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <div>
              <span className="text-white-50 small d-block">Hổng cấp thiết (Cần học ngay)</span>
              <h4 className="fw-bold text-danger mb-0">{highPriorityGaps} Kỹ năng</h4>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KHỐI AI SUMMARY */}
      <div className="p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-25 shadow-sm">
        <h6 className="text-success fw-bold mb-2">
          <i className="bi bi-robot me-2"></i>Nhận xét năng lực từ AI
        </h6>
        <p className="text-white-50 mb-0 small" style={{ lineHeight: '1.6' }}>
          {aiSummary}
        </p>
      </div>

      {/* 3. CHART & CHI TIẾT */}
      <div className="row g-4">
        {/* CỘT TRÁI: RADAR CHART */}
        <div className="col-12 col-lg-7">
          <div className="bg-dark bg-opacity-50 rounded-4 p-4 border border-secondary border-opacity-25 h-100 d-flex flex-column justify-content-between">
            <div>
              <h6 className="text-white text-center mb-1">Ma Trận Khoảng Trống Kỹ Năng (Skill Gap)</h6>
              <p className="text-center small text-muted mb-3">Mục tiêu vị trí: <span className="text-info fw-bold">{roleName}</span></p>
            </div>
            
            <div style={{ width: '100%', height: '340px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#14161d', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Radar name="Yêu cầu thị trường" dataKey="required" stroke="#ea5455" fill="#ea5455" fillOpacity={0.2} />
                  <Radar name="Năng lực hiện tại" dataKey="current" stroke="#00cfe8" fill="#00cfe8" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH HỔNG KỸ NĂNG */}
        <div className="col-12 col-lg-5">
          <div className="bg-dark bg-opacity-50 rounded-4 p-4 border border-secondary border-opacity-25 h-100 d-flex flex-column">
            <h6 className="text-warning fw-bold mb-3"><i className="bi bi-list-task me-2"></i>Kỹ năng cần ưu tiên lấp đầy</h6>

            <div className="input-group input-group-sm mb-3">
              <span className="input-group-text bg-black text-white-50 border-secondary border-opacity-25"><i className="bi bi-search"></i></span>
              <input type="text" className="form-control bg-black text-white border-secondary border-opacity-25 shadow-none" placeholder="Tìm kỹ năng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="d-flex flex-column gap-2 overflow-auto pe-1 custom-scrollbar" style={{ maxHeight: '300px' }}>
              {filteredGaps.map((item, idx) => (
                <div key={idx} className="p-3 border border-secondary border-opacity-15 rounded-3 bg-black bg-opacity-20">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-white small">{item.subject}</strong>
                    <span className={`badge ${item.gap >= 40 ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '10px' }}>
                      Thiếu {item.gap}%
                    </span>
                  </div>
                  <div className="progress rounded-pill mb-2" style={{ height: '6px' }}>
                    <div className="progress-bar bg-info" style={{ width: `${item.current}%` }}></div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-white-50 small" style={{ fontSize: '11px' }}>Hiện tại: {item.current}% / Cần: {item.required}%</span>
                    <button className="btn btn-sm btn-outline-info py-0 px-2" style={{ fontSize: '11px' }} onClick={() => navigate(`/dashboard/learning?skill=${encodeURIComponent(item.subject)}`)}>
                      Học ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default SkillGapReport;