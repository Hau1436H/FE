import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaExclamationCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import axiosClient from "../../../api/axiosClient";
const COLORS = {
  bgCard: '#131313',
  border: '#232323',
  borderSoft: '#1A1A1A',
  textSecondary: '#8C8C8C',
  accentCyan: '#34D399',
  accentCyanDim: 'rgba(52,211,153,0.08)',
  accentAmber: '#F5A623',
  accentAmberDim: 'rgba(245,166,35,0.12)',
};

export default function GithubPortfolio({ studentId }) {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        // Lưu ý: Đổi URL này cho khớp với Route thực tế trong PortfolioController của bạn
const response = await axiosClient.get(`/api/Portfolios/student/${studentId}`);        
const result = response.data?.data || response.data;
        setPortfolioData(result);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu E-Portfolio:", error);
        setPortfolioData(null); // Fallback nếu chưa tạo portfolio
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [studentId]);

  // Tính toán logic dựa trên DTO Backend trả về
  const repos = portfolioData?.repositories || [];
  const totalRepos = repos.length;
  
  // Đếm số project đã được AI phân tích thành công (aiProjectSummary != null)
  const analyzedCount = repos.filter(r => r.aiProjectSummary && r.aiProjectSummary.trim() !== "").length;
  
  // Những project chưa được phân tích thường là do thiếu README
  const missingReadmeCount = totalRepos - analyzedCount;

  return (
    <div style={{ 
      backgroundColor: COLORS.bgCard, 
      border: `1px solid ${COLORS.border}`, 
      borderRadius: '14px', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Tiêu đề & Badge Trạng thái */}
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="m-0 text-white fw-bold d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
          <FaGithub /> E-Portfolio Health
        </h6>

        {!loading && totalRepos > 0 && (
          <span 
            className="badge fw-bold" 
            style={{ 
              backgroundColor: missingReadmeCount === 0 ? COLORS.accentCyanDim : COLORS.accentAmberDim, 
              color: missingReadmeCount === 0 ? COLORS.accentCyan : COLORS.accentAmber,
              fontSize: '10.5px',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            {missingReadmeCount === 0 ? 'Điểm thực chiến: Tốt' : `Cảnh báo: Tối ưu kém`}
          </span>
        )}
      </div>

      {/* Nội dung báo cáo từ AI */}
      <div className="p-3 rounded-3" style={{ backgroundColor: COLORS.borderSoft, minHeight: '80px' }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100" style={{ color: COLORS.accentCyan }}>
            <FaSpinner className="spinner-border spinner-border-sm" />
          </div>
        ) : totalRepos === 0 ? (
          <p className="m-0 text-white-50 small text-center mt-2" style={{ lineHeight: '1.5', fontSize: '12.5px' }}>
            Chưa có dự án nào được đồng bộ. Hãy kết nối GitHub để AI phân tích năng lực của bạn!
          </p>
        ) : (
          <>
            <p className="m-0 text-white-50 small" style={{ lineHeight: '1.5', fontSize: '12.5px' }}>
              Bạn đang có <b className="text-white">{analyzedCount} dự án</b> đã được AI phân tích kiến trúc.
            </p>
            
            {missingReadmeCount > 0 ? (
              <div className="mt-2 text-warning d-flex align-items-start gap-1 font-monospace" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                <span>Gợi ý: Phân tích thất bại hoặc thiếu README ở {missingReadmeCount} dự án.</span>
              </div>
            ) : (
              <div className="mt-2 d-flex align-items-center gap-1" style={{ fontSize: '11px', color: COLORS.accentCyan }}>
                <FaCheckCircle /> Kho mã nguồn đã được tối ưu chuẩn tuyển dụng.
              </div>
            )}
          </>
        )}
      </div>

      {/* Điều hướng hành động sang trang Profile */}
      <button 
        onClick={() => navigate('/dashboard/profile')} 
        className="btn btn-sm w-100 fw-bold border-0 mt-1" 
        style={{ 
          backgroundColor: 'rgba(255,255,255,0.04)', 
          color: COLORS.accentCyan, 
          borderRadius: '8px',
          padding: '8px 0',
          fontSize: '12px',
          letterSpacing: '0.5px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.accentCyanDim;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
        }}
      >
        QUẢN LÝ E-PORTFOLIO
      </button>
    </div>
  );
}