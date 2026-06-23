// src/components/dashboard/profile/GithubPortfolioSync.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../../api/axiosClient';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function GithubPortfolioSync({ studentId }) {
  const [username, setUsername] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyzingRepoId, setAnalyzingRepoId] = useState(null);

  // Hàm load data tách riêng để tái sử dụng
  const loadPortfolio = useCallback(() => {
    if (!studentId) return;
    axiosClient.get(`/api/Portfolios/student/${studentId}`)
      .then(res => setPortfolio(res.data))
      .catch(() => setPortfolio(null));
  }, [studentId]);

  // Load data lần đầu khi vừa vào trang
  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  // KẾT NỐI SIGNALR ĐỂ LẮNG NGHE BACKGROUND JOB
  useEffect(() => {
    // CHÚ Ý: Thay đổi domain/port (7196) cho đúng với link Backend đang chạy của bạn
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7196/portfolioHub") 
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        // Lắng nghe: Khi Hangfire đồng bộ GitHub xong
        connection.on("SyncCompleted", (incomingStudentId) => {
          if (incomingStudentId.toLowerCase() === studentId.toLowerCase()) {
            setIsSyncing(false); // Tắt nút loading
            loadPortfolio();     // Tự động kéo data mới về
          }
        });

        // Lắng nghe: Khi AI phân tích code xong
        connection.on("AnalysisCompleted", () => {
          setAnalyzingRepoId(null); // Tắt hiệu ứng quay quay của nút
          loadPortfolio();          // Cập nhật kết quả AI lên màn hình
        });
      })
      .catch(err => console.error("Lỗi SignalR: ", err));

    return () => connection.stop();
  }, [studentId, loadPortfolio]);

  const handleSync = async () => {
    if (!username) return alert("Vui lòng nhập GitHub Username");
    setIsSyncing(true);
    
    console.log(`[Frontend] Bắt đầu gọi API đồng bộ cho username: ${username}...`); // THÊM LOG

    try {
      const res = await axiosClient.post(`/api/Portfolios/${studentId}/sync-github`, { githubUsername: username });
      console.log("[Frontend] Gọi API thành công, chờ Backend xử lý và báo qua SignalR...", res.data); // THÊM LOG
    } catch (error) {
      setIsSyncing(false);
      
      // LOG TOÀN BỘ CẤU TRÚC LỖI
      console.error("[Frontend] Lỗi khi gọi API đồng bộ GitHub:");
      console.error("1. Thông báo lỗi:", error.message);
      if (error.response) {
         console.error("2. HTTP Status:", error.response.status);
         console.error("3. Data từ Backend trả về:", error.response.data);
      }
      
      alert("Lỗi đồng bộ: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAnalyzeAI = async (repoId) => {
    setAnalyzingRepoId(repoId);
    try {
      await axiosClient.post(`/api/Portfolios/repos/${repoId}/analyze`);
      // Đã xóa trạng thái reset UI. Phải chờ SignalR báo AnalysisCompleted mới tắt.
    } catch (error) {
      setAnalyzingRepoId(null);
      alert("Lỗi phân tích AI: " + (error.response?.data?.message || error.message));
    }
  };

  const generateShareUrl = async () => {
    try {
      const res = await axiosClient.post(`/api/Portfolios/${studentId}/generate-url`);
      alert(`Link Portfolio của bạn: ${res.data.url}`);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="card bg-dark border-secondary p-4 mt-4">
      <h5 className="fw-bold text-success mb-3"><i className="bi bi-github me-2"></i>E-Portfolio AI Analysis</h5>
      
      <div className="d-flex gap-2 mb-4">
        <input 
          type="text" className="form-control bg-dark border-secondary text-white" 
          placeholder="Nhập GitHub Username (VD: octocat)"
          value={username} onChange={e => setUsername(e.target.value)}
        />
        <button className="btn btn-outline-light text-nowrap" onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? 'Đang cào dữ liệu ngầm...' : 'Sync GitHub'}
        </button>
        {portfolio && (
          <button className="btn btn-success text-nowrap" onClick={generateShareUrl}>
            Tạo Public Link
          </button>
        )}
      </div>

      {portfolio?.repositories?.length > 0 && (
        <div className="row g-3">
          {portfolio.repositories.map(repo => (
            <div key={repo.repoId} className="col-12 border border-secondary border-opacity-25 p-3 rounded bg-secondary bg-opacity-10">
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="fw-bold text-info">{repo.repoName}</h6>
                <button 
                  className="btn btn-sm btn-outline-warning" 
                  onClick={() => handleAnalyzeAI(repo.repoId)}
                  disabled={analyzingRepoId === repo.repoId || analyzingRepoId !== null} 
                >
                  {analyzingRepoId === repo.repoId ? 'AI Đang đọc (10-15s)...' : 'AI Phân Tích Code'}
                </button>
              </div>
              
              {repo.aiProjectSummary && (
                <div className="mt-3 bg-dark p-2 rounded small text-white-50">
                  <p className="mb-1"><strong className="text-white">Summary:</strong> {repo.aiProjectSummary}</p>
                  <p className="mb-0"><strong className="text-warning">Tech Stack:</strong> {repo.extractedTechStack}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GithubPortfolioSync;