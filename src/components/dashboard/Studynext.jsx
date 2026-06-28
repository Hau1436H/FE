import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axiosClient from '../../api/axiosClient';

function SkillGapReport({ studentId }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  
  // ĐÃ THÊM: State lưu trữ AI Summary và Target Role Name
  const [aiSummary, setAiSummary] = useState("");
  const [roleName, setRoleName] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGapData = async () => {
      // SỬA LỖI XOAY VÒNG: Phải tắt loading nếu không có ID
      if (!studentId) {
        setLoading(false); 
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosClient.get(`/api/SkillGapReports/${studentId}/generate`);
        
        const resultObject = response.data?.data || response.data;
        const rawData = resultObject.gapItems || resultObject.GapItems || [];
        
        setAiSummary(resultObject.latentTalentSummary || resultObject.LatentTalentSummary || "");
        setRoleName(resultObject.targetRoleName || resultObject.TargetRoleName || "Chưa xác định");
        
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

  const gaps = data
    .filter(item => item.current < item.required)
    .sort((a, b) => (b.required - b.current) - (a.required - a.current));

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
        <i className="bi bi-exclamation-triangle-fill fs-2 d-block mb-2"></i>
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-warning text-center py-4">
        <i className="bi bi-info-circle fs-2 d-block mb-2"></i>
        Chưa có đủ dữ liệu để phân tích. Hãy đảm bảo bạn đã chọn "Mục tiêu nghề nghiệp" trong phần Hồ sơ nhé.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      
      <div className="row">
        {/* CỘT PHẢI: DANH SÁCH KHUYẾN NGHỊ */}
      
          <div className="bg-black bg-opacity-25 rounded-4 p-4 border border-secondary border-opacity-25 h-100">
            <h6 className="text-warning fw-bold mb-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>Các kỹ năng cần bổ sung (Gap)
            </h6>
            
            {gaps.length > 0 ? (
              <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '550px' }}>
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