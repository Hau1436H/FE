// src/pages/PublicPortfolio.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ĐÃ THÊM useNavigate
import axios from 'axios'; 

function PublicPortfolio() {
  const { slug } = useParams();
  const navigate = useNavigate(); // KHỞI TẠO HOOK ĐIỀU HƯỚNG
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        setLoading(true);
        const fullUrl = `https://techcompass.com/p/${slug}`;
        
        const encodedUrl = encodeURIComponent(fullUrl);
        const response = await axios.get(`https://localhost:7196/api/Portfolios/shared?url=${encodedUrl}`);
        
        setPortfolioData(response.data);
      } catch (error) {
        console.error("Hồ sơ không tồn tại hoặc lỗi server", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPublicPortfolio();
  }, [slug]);

  if (loading) return <div className="text-center py-5 text-white bg-dark min-vh-100">Đang tải hồ sơ năng lực của ứng viên...</div>;
  if (!portfolioData) return <div className="text-center py-5 text-white bg-dark min-vh-100">Không tìm thấy hồ sơ năng lực này. Đường dẫn có thể đã bị thay đổi.</div>;

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#0b0c10' }}>
      <div className="container py-4 text-white" style={{ maxWidth: '900px' }}>
        
        {/* NÚT TRỞ VỀ */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-link text-white-50 text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 transition-all hover-text-white"
        >
          <i className="bi bi-arrow-left"></i> Trở về
        </button>

        {/* THÔNG TIN CHUNG */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-success">📄 HỒ SƠ NĂNG LỰC TỔNG HỢP</h2>
          <p className="text-white-50">Sinh viên: <strong>{portfolioData.studentId}</strong></p>
          <p className="text-white-50 small">Được tổng hợp tự động bởi TechCompass AI</p>
        </div>
        
        {/* TÓM TẮT NĂNG LỰC */}
        <div className="p-4 rounded-4 mb-5 shadow-sm" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
          <h5 className="text-success mb-3">Tóm tắt năng lực cốt lõi (AI Profile Summary)</h5>
          <p className="text-light" style={{ lineHeight: '1.6' }}>
            {portfolioData.aiProfileSummary || "Ứng viên đang trong quá trình hoàn thiện năng lực."}
          </p>
        </div>

        {/* CÁC DỰ ÁN GITHUB */}
        <h5 className="mb-4">Dự án GitHub tiêu biểu ({portfolioData.repositories?.length || 0})</h5>
        <div className="row g-4 pb-5">
          {portfolioData.repositories?.map(repo => (
            <div key={repo.repoId} className="col-12">
              <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold text-white fs-5 mb-0">🚀 {repo.repoName}</h6>
                  <a href={repo.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success rounded-pill px-3">
                    Mã nguồn GitHub
                  </a>
                </div>
                
                <p className="text-white-50 my-3" style={{ lineHeight: '1.5' }}>
                  {repo.aiProjectSummary || "Dự án đang chờ AI phân tích cấu trúc code."}
                </p>
                
                <div className="pt-3 border-top border-secondary border-opacity-25">
                  <span className="text-white-50 small me-2">Tech Stack:</span> 
                  {repo.extractedTechStack ? (
                    repo.extractedTechStack.split(',').map((tech, i) => (
                      <span key={i} className="badge bg-secondary bg-opacity-20 text-light me-1 fw-normal">
                        {tech.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-white-50 small">Chưa phân tích</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublicPortfolio;