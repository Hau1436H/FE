// src/components/dashboard/profile/GithubPortfolioSync.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../../api/axiosClient';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useParams, useNavigate } from 'react-router-dom';

function GithubPortfolioSync({ studentId }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyzingRepoId, setAnalyzingRepoId] = useState(null);

  const loadPortfolio = useCallback(() => {
    if (!studentId) return;
    axiosClient.get(`/api/Portfolios/student/${studentId}`)
      .then(res => setPortfolio(res.data))
      .catch(() => setPortfolio(null));
  }, [studentId]);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  // KẾT NỐI SIGNALR HUB
  useEffect(() => {
    let isMounted = true;
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7196/portfolioHub") 
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    const startSignalR = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected Successfully!");

        if (isMounted) {
          // Lắng nghe sự kiện hoàn tất Master Pipeline từ Backend
          connection.on("PipelineCompleted", () => {
            setIsSyncing(false); // Tắt hiệu ứng loading tổng
            loadPortfolio(); // Tải lại toàn bộ dữ liệu mới nhất
            alert("🎉 TechCompass AI đã phân tích toàn diện hồ sơ của bạn thành công!");
          });

          // Fallback cho các case cũ nếu cần
          connection.on("AnalysisCompleted", () => {
            setAnalyzingRepoId(null);
            loadPortfolio(); 
          });
        }
      } catch (err) {
        if (isMounted) console.error("Lỗi SignalR: ", err);
      }
    };

    startSignalR();

    return () => {
      isMounted = false;
      if (connection.state === "Connected") connection.stop();
    };
  }, [studentId, loadPortfolio]);

  const handleSync = async () => {
    if (!username) return alert("Vui lòng nhập GitHub Username");
    setIsSyncing(true); // Bật trạng thái đang xử lý Master Pipeline
    try {
      // API này giờ đây kích hoạt toàn bộ luồng: Sync -> AI Repo -> Suitability -> Master Summary
      const res = await axiosClient.post(`/api/Portfolios/${studentId}/sync-github`, { githubUsername: username });
      alert(res.data.message || "Hệ thống đang chạy AI Pipeline phân tích. Vui lòng đợi trong ít phút...");
    } catch (error) {
      setIsSyncing(false);
      alert("Lỗi đồng bộ: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAnalyzeAI = async (repoId) => {
    setAnalyzingRepoId(repoId);
    try {
      await axiosClient.post(`/api/Portfolios/repos/${repoId}/analyze`);
    } catch (error) {
      setAnalyzingRepoId(null);
      alert("Lỗi phân tích AI: " + (error.response?.data?.message || error.message));
    }
  };

  const generateShareUrl = async () => {
    try {
      const res = await axiosClient.post(`/api/Portfolios/${studentId}/generate-url`);
      
      // FIX LỖI REDIRECT DOMAIN: Lấy chính Origin hiện tại của App (ví dụ http://localhost:5173) 
      // thay vì dùng thẳng chuỗi cứng "https://techcompass.com" sinh ra từ Backend
      const rawUrl = res.data.url; // Chuỗi trả về từ BE: https://techcompass.com/p/cc6b5ae4
      const urlSlug = rawUrl.substring(rawUrl.lastIndexOf('/') + 1); // Cắt lấy token cuối: cc6b5ae4
      
      // Ghép nối với Host đang chạy thực tế ở Frontend Local
      const localShareUrl = `${window.location.origin}/p/${urlSlug}`;
      
      alert(`Link Portfolio Public của bạn (Local):\n${localShareUrl}`);
      
      // Tự động copy vào Clipboard cho tiện sử dụng
      navigator.clipboard.writeText(localShareUrl);
    } catch (error) { 
      console.error(error); 
      alert("Lỗi khi tạo liên kết chia sẻ.");
    }
  };

  return (
    <div className="card bg-dark border-secondary p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-success mb-0"><i className="bi bi-cpu me-2"></i>Hệ thống Phân tích Năng lực AI</h5>
        {portfolio?.shareableUrl && (
          <button 
            onClick={() => {
              // Trích xuất slug cuối cùng (ví dụ: cc6b5ae4) từ chuỗi URL đầy đủ của BE
              const rawUrl = portfolio.shareableUrl;
              const urlSlug = rawUrl.substring(rawUrl.lastIndexOf('/') + 1);
              
              // Điều hướng Router nội bộ đến trang public portfolio local của bạn
              navigate(`/p/${urlSlug}`);
            }} 
            className="btn btn-sm btn-outline-info"
          >
            <i className="bi bi-eye me-1"></i> Xem Dashboard Public
          </button>
        )}
      </div>
      
      <p className="text-white-50 small mb-4">
        Nhập Username GitHub để TechCompass AI tự động kéo code, đánh giá kỹ năng, xác định khoảng trống chuyên môn và đề xuất định hướng nghề nghiệp phù hợp nhất cho bạn.
      </p>

      <div className="d-flex gap-2 mb-4">
        <input 
          type="text" className="form-control bg-dark border-secondary text-white" 
          placeholder="Nhập GitHub Username"
          value={username} onChange={e => setUsername(e.target.value)}
          disabled={isSyncing}
        />
        <button className="btn btn-outline-light text-nowrap" onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>AI đang phân tích toàn diện...</>
          ) : 'Kích hoạt AI Pipeline'}
        </button>
        {portfolio && (
          <button className="btn btn-success text-nowrap" onClick={generateShareUrl}>
            Tạo Public Link
          </button>
        )}
      </div>

      {isSyncing && (
        <div className="alert alert-info bg-dark border-info text-info small">
          <i className="bi bi-info-circle me-2"></i> 
          Quá trình này bao gồm: Tải Repository ➔ Trích xuất Tech Stack ➔ AI phân tích README ➔ Chấm điểm Suitability ➔ So khớp Roadmap. Có thể mất từ 1-2 phút.
        </div>
      )}

      {portfolio?.repositories?.length > 0 && (
        <>
          <h6 className="fw-bold text-white mb-3">Trạng thái các dự án ({portfolio.repositories.length})</h6>
          <div className="row g-3">
            {portfolio.repositories.map(repo => (
              <div key={repo.repoId} className="col-12 border border-secondary border-opacity-25 p-3 rounded bg-secondary bg-opacity-10">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="fw-bold text-info mb-1">
                      {repo.isFeatured ? '⭐ ' : '📁 '}{repo.repoName}
                    </h6>
                    {repo.extractedTechStack && (
                      <span className="badge bg-dark border border-secondary text-white-50 small">
                        💻 {repo.extractedTechStack}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className={`btn btn-sm ${repo.aiProjectSummary ? 'btn-outline-secondary' : 'btn-warning text-dark'}`}
                    onClick={() => handleAnalyzeAI(repo.repoId)}
                    disabled={analyzingRepoId === repo.repoId || isSyncing} 
                  >
                    {analyzingRepoId === repo.repoId ? (
                      <><span className="spinner-border spinner-border-sm me-1"></span>AI đang đọc...</>
                    ) : repo.aiProjectSummary ? 'Phân tích lại' : '✨ Yêu cầu AI đọc'}
                  </button>
                </div>
                
                {repo.aiProjectSummary && (
                  <div className="mt-3 bg-dark p-2 rounded small text-white-50 border-start border-success border-2">
                    <p className="mb-0">{repo.aiProjectSummary}</p>
                    <div className="mt-2 d-flex gap-3">
                      <span className="text-warning">Độ khó: {"★".repeat(repo.difficultyStars || 1)}</span>
                      {repo.isFeatured && <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Featured Project</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default GithubPortfolioSync;