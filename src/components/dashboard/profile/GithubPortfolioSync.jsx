// src/components/dashboard/profile/GithubPortfolioSync.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../../api/axiosClient';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function GithubPortfolioSync({ studentId }) {
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

  // KẾT NỐI SIGNALR HUB (ĐÃ CHUẨN HÓA CHỮ THƯỜNG TOÀN BỘ)
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
          connection.on("synccompleted", (incomingStudentId) => {
            if (incomingStudentId.toLowerCase() === studentId.toLowerCase()) {
              loadPortfolio(); 
            }
          });

          connection.on("analysiscompleted", () => {
            setAnalyzingRepoId(null); // Tắt hiệu ứng quay của nút thủ công
            loadPortfolio(); 
          });

          connection.on("portfoliosummarycompleted", (incomingStudentId) => {
            if (incomingStudentId.toLowerCase() === studentId.toLowerCase()) {
              setIsSyncing(false); // Tắt Loading tổng
              loadPortfolio();
            }
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
    setIsSyncing(true);
    try {
      await axiosClient.post(`/api/Portfolios/${studentId}/sync-github`, { githubUsername: username });
    } catch (error) {
      setIsSyncing(false);
      alert("Lỗi đồng bộ: " + (error.response?.data?.message || error.message));
    }
  };

  // HÀM CLICK THỦ CÔNG CHO TỪNG REPO CÓ README DÀI
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
      alert(`Link Portfolio của bạn: ${res.data.url}`);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="card bg-dark border-secondary p-4 mt-4">
      <h5 className="fw-bold text-success mb-3"><i className="bi bi-github me-2"></i>E-Portfolio AI Analysis</h5>
      
      <div className="d-flex gap-2 mb-4">
        <input 
          type="text" className="form-control bg-dark border-secondary text-white" 
          placeholder="Nhập GitHub Username"
          value={username} onChange={e => setUsername(e.target.value)}
          disabled={isSyncing}
        />
        <button className="btn btn-outline-light text-nowrap" onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Đang đồng bộ cấu trúc...</>
          ) : 'Sync GitHub'}
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
                <div>
                  <h6 className="fw-bold text-info mb-1">{repo.repoName}</h6>
                  {repo.extractedTechStack && (
                    <span className="badge bg-dark border border-secondary text-white-50 small">
                      💻 Core Tech: {repo.extractedTechStack}
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
                  ) : repo.aiProjectSummary ? 'Phân tích lại với AI' : '✨ AI Phân Tích README'}
                </button>
              </div>
              
              {repo.aiProjectSummary && (
                <div className="mt-3 bg-dark p-2 rounded small text-white-50">
                  <p className="mb-0"><strong className="text-white">AI Summary:</strong> {repo.aiProjectSummary}</p>
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