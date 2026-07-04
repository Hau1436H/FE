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
  
  // ĐÃ THÊM: State cho thanh tìm kiếm kỹ năng
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
          const required = item.targetScore || item.required || item.requiredScore || 0;
          return {
            subject: item.nodeName || item.skillName || item.subject || 'Unknown Skill',
            current: current,
            required: required,
            gap: Math.max(0, required - current), 
            fullMark: 100
          };
        });

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

  // Lọc danh sách kỹ năng hổng kết hợp với từ khóa tìm kiếm
  const filteredGaps = data
    .filter(item => item.gap > 0)
    .filter(item => item.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.gap - a.gap);

  // TỐI ƯU HÓA BIỂU ĐỒ RADAR CHO 50 NODES: Chỉ vẽ đúng Top 8 kỹ năng hổng nặng nhất
  const chartData = data
    .filter(item => item.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 8);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info mb-3"></div>
        <p className="text-white-50">AI đang tổng hợp và phân tích dữ liệu kỹ năng của bạn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-danger text-center py-4">
        <i className="bi bi-exclamation-triangle-fill fs-2 d-block mb-2"></i>{error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-warning text-center py-4">
        <i className="bi bi-info-circle fs-2 d-block mb-2"></i>
        Chưa có đủ dữ liệu để phân tích.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* KHỐI HIỂN THỊ AI SUMMARY */}
      <div className="p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-25 shadow-sm">
        <h6 className="text-success fw-bold mb-2">
          <i className="bi bi-robot me-2"></i>AI Profile Summary & Lời khuyên
        </h6>
        <p className="text-white-50 mb-0 small" style={{ lineHeight: '1.6' }}>
          {aiSummary || "Hệ thống đang thu thập thêm dữ liệu để phân tích năng lực cốt lõi của bạn."}
        </p>
      </div>

      <div className="row match-height">
        {/* CỘT TRÁI: BIỂU ĐỒ RADAR (CHỈ TOP 8) */}
        <div className="col-12 col-lg-7 mb-4 mb-lg-0">
          <div className="bg-dark bg-opacity-50 rounded-4 p-4 border border-secondary border-opacity-25 h-100 d-flex flex-column justify-content-between">
            <div>
              <h6 className="text-white text-center mb-1">
                Tương quan Top 8 Kỹ Năng Ưu Tiên
              </h6>
              <p className="text-center small text-muted mb-3">
                Vị trí mục tiêu: <span className="text-info fw-semibold">{roleName}</span>
              </p>
            </div>
            
            <div style={{ width: '100%', height: '360px' }} className="my-auto">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={({ x, y, payload, textAnchor }) => (
                        <text
                          x={x}
                          y={y}
                          textAnchor={textAnchor}
                          fill="rgba(255,255,255,0.65)"
                          fontSize={11}
                          fontWeight={500}
                        >
                          {payload.value.length > 15 ? `${payload.value.substring(0, 13)}...` : payload.value}
                        </text>
                      )}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#14161d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }} />
                    <Radar name="Yêu cầu thị trường" dataKey="required" stroke="#ea5455" fill="#ea5455" fillOpacity={0.15} />
                    <Radar name="Năng lực của bạn" dataKey="current" stroke="#00cfe8" fill="#00cfe8" fillOpacity={0.45} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <span className="text-muted small">Không có dữ liệu phân tích</span>
                </div>
              )}
            </div>
            <p className="text-center text-muted small mb-0 mt-2">
              * Biểu đồ tự động trích xuất các kỹ năng có mức độ thiếu hụt lớn nhất.
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH TẤT CẢ KHUYẾN NGHỊ (CÓ TÌM KIẾM) */}
        <div className="col-12 col-lg-5">
          <div className="bg-dark bg-opacity-50 rounded-4 p-4 border border-secondary border-opacity-25 h-100 d-flex flex-column">
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-warning fw-bold mb-0">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Danh sách cần bổ sung ({data.filter(i => i.gap > 0).length})
              </h6>
            </div>

            {/* THANH TÌM KIẾM */}
            <div className="input-group input-group-sm mb-3">
              <span className="input-group-text bg-black bg-opacity-25 border-secondary border-opacity-25 text-white-50">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control bg-black bg-opacity-25 border-secondary border-opacity-25 text-white shadow-none" 
                placeholder="Tìm kỹ năng cụ thể..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* DANH SÁCH CUỘN */}
            <div className="d-flex flex-column gap-3 overflow-auto pe-1 custom-scrollbar" style={{ maxHeight: '330px', flex: 1 }}>
              {filteredGaps.length > 0 ? (
                filteredGaps.map((item, index) => {
                  let priority = "Thấp";
                  let badgeColor = "bg-secondary text-white";
                  
                  if (item.gap >= 40) { priority = "Cao"; badgeColor = "bg-danger"; }
                  else if (item.gap >= 20) { priority = "Trung bình"; badgeColor = "bg-warning text-dark"; }

                  return (
                    <div key={index} className="p-3 border border-secondary border-opacity-15 rounded-3 bg-black bg-opacity-20 transition-all">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-white small text-truncate pe-2" title={item.subject}>
                          {item.subject}
                        </span>
                        <span className={`badge rounded-pill ${badgeColor}`} style={{ fontSize: '10px', minWidth: '65px' }}>
                          Ưu tiên: {priority}
                        </span>
                      </div>
                      
                      <div className="progress rounded-pill mb-2" style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="progress-bar bg-info" role="progressbar" style={{ width: `${item.current}%` }}></div>
                        <div className="progress-bar bg-danger progress-bar-striped progress-bar-animated opacity-40" role="progressbar" style={{ width: `${item.gap}%` }}></div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center pt-2 mt-2 border-top border-secondary border-opacity-10">
                        <span className="text-muted" style={{ fontSize: '11px' }}>
                          Hiện tại: <strong className="text-info">{item.current}%</strong> 
                          <span className="mx-1">/</span> 
                          Mục tiêu: <strong className="text-danger">{item.required}%</strong>
                        </span>
                        <button 
                          className="btn btn-sm btn-outline-info rounded-pill px-3 py-1"
                          style={{ fontSize: '11px', fontWeight: '500' }}
                          onClick={() => navigate(`/dashboard/learning?skill=${encodeURIComponent(item.subject)}`)}
                        >
                          Học ngay <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted my-auto pt-4 pb-4">
                  <i className="bi bi-search fs-3 d-block mb-2 opacity-50"></i>
                  {searchTerm ? "Không tìm thấy kỹ năng phù hợp." : "Tất cả kỹ năng đã đạt chuẩn."}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillGapReport;