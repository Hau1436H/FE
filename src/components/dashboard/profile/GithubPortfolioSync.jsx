import React, { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '../../../api/axiosClient';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useParams, useNavigate } from 'react-router-dom';

function GithubPortfolioSync({ studentId }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyzingRepoId, setAnalyzingRepoId] = useState(null);
  
  // Sử dụng useRef để quản lý Timer, giúp dọn dẹp khi Component unmount hoặc khi có phản hồi sớm
  const syncTimeoutRef = useRef(null);

  const loadPortfolio = useCallback(() => {
    if (!studentId) return;
    axiosClient.get(`/api/Portfolios/student/${studentId}`)
      .then(res => {
        setPortfolio(res.data);
        
        // [CẬP NHẬT]: Tự động lấy githubUsername từ dữ liệu Portfolio/Student trả về để điền vào ô input
        if (res.data.githubUsername) {
            setUsername(res.data.githubUsername);
        } else if (res.data.student && res.data.student.githubUsername) {
            setUsername(res.data.student.githubUsername);
        }
      })
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
          // 1. Lắng nghe PipelineCompleted
          connection.on("PipelineCompleted", (receivedStudentId) => {
            if (receivedStudentId && receivedStudentId.toLowerCase() !== studentId.toLowerCase()) return;

            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
            setIsSyncing(false); 
            loadPortfolio(); 
            alert("🎉 Hệ thống đã đồng bộ Repository thành công!");
          });

          // 2. Lắng nghe PipelineFailed
          connection.on("PipelineFailed", (receivedStudentId, errorMessage) => {
            if (receivedStudentId && receivedStudentId.toLowerCase() !== studentId.toLowerCase()) return;

            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
            setIsSyncing(false); 
            loadPortfolio();     
            alert("⚠️ Cảnh báo: " + errorMessage);
          });

          // 3. Lắng nghe AnalysisCompleted
          connection.on("AnalysisCompleted", (receivedStudentId) => {
            if (receivedStudentId && receivedStudentId.toLowerCase() !== studentId.toLowerCase()) return;

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
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [studentId, loadPortfolio]);

  const handleSync = async () => {
    if (!username) return alert("Vui lòng nhập GitHub Username");
    setIsSyncing(true); 
    
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      setIsSyncing(prev => {
        if (prev) {
          alert("Quá trình đồng bộ đang mất nhiều thời gian do AI xử lý khối lượng lớn dữ liệu. Vui lòng tải lại trang (F5) để xem kết quả.");
          return false;
        }
        return prev;
      });
    }, 180000); 

    try {
      const res = await axiosClient.post(`/api/Portfolios/sync-github`, { githubUsername: username });
      alert(res.data.message || "Hệ thống đang chạy AI Pipeline phân tích. Vui lòng đợi trong ít phút...");
    } catch (error) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
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
      
      const rawUrl = res.data.url; 
      const urlSlug = rawUrl.substring(rawUrl.lastIndexOf('/') + 1); 
      
      const localShareUrl = `${window.location.origin}/p/${urlSlug}`;
      
      alert(`Link Portfolio Public của bạn (Local):\n${localShareUrl}`);
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
              const rawUrl = portfolio.shareableUrl;
              const urlSlug = rawUrl.substring(rawUrl.lastIndexOf('/') + 1);
              navigate(`/p/${urlSlug}`);
            }} 
            className="btn btn-sm btn-outline-info"
          >
            <i className="bi bi-eye me-1"></i> Xem Dashboard Public
          </button>
        )}
      </div>
      
      <p className="text-white-50 small mb-2">
        Nhập Username GitHub để TechCompass AI tự động kéo code, đánh giá kỹ năng và đề xuất định hướng nghề nghiệp.
      </p>
      
      <div className="alert alert-warning bg-opacity-10 border-warning text-warning p-2 small mb-4">
        <i className="bi bi-shield-lock-fill me-2"></i> 
        <strong>Lưu ý bảo mật:</strong> Username ở lần đồng bộ đầu tiên sẽ được gắn chặt với tài khoản của bạn để tránh mạo danh. Các lần đồng bộ sau hệ thống chỉ kéo dự án mới và <strong>giữ nguyên dữ liệu AI đã phân tích trước đó</strong>.
      </div>

      <div className="d-flex gap-2 mb-4">
        <input 
          type="text" className="form-control bg-dark border-secondary text-white" 
          placeholder="Nhập GitHub Username (Ví dụ: chinsuhdh)"
          value={username} onChange={e => setUsername(e.target.value)}
          disabled={isSyncing || (portfolio?.githubUsername != null)} // Khóa ô input nếu tài khoản đã liên kết
        />
        <button className="btn btn-outline-light text-nowrap" onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>AI đang đồng bộ...</>
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
          Hệ thống đã tải danh sách Repository thành công! Hãy nhấn nút 'Yêu cầu AI đọc' tại các dự án tiêu biểu của bạn để AI chấm điểm kỹ năng và cập nhật Lộ trình nghề nghiệp.
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