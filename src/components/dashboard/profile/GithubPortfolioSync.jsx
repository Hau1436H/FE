// src/components/dashboard/profile/GithubPortfolioSync.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';

function GithubPortfolioSync({ studentId }) {
  const [username, setUsername] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyzingRepoId, setAnalyzingRepoId] = useState(null);

  // Load portfolio hiện tại
  useEffect(() => {
    if (!studentId) return;
    axiosClient.get(`/api/Portfolios/student/${studentId}`)
      .then(res => setPortfolio(res.data))
      .catch(() => setPortfolio(null)); // Có thể chưa tạo
  }, [studentId]);

  const handleSync = async () => {
    if (!username) return alert("Vui lòng nhập GitHub Username");
    setIsSyncing(true);
    try {
      await axiosClient.post(`/api/Portfolios/${studentId}/sync-github`, { githubUsername: username });
      // Load lại data sau khi sync
      const res = await axiosClient.get(`/api/Portfolios/student/${studentId}`);
      setPortfolio(res.data);
      alert("Đồng bộ GitHub thành công!");
    } catch (error) {
      alert("Lỗi đồng bộ: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAnalyzeAI = async (repoId) => {
    setAnalyzingRepoId(repoId);
    try {
      await axiosClient.post(`/api/Portfolios/repos/${repoId}/analyze`);
      // Cập nhật lại UI
      const res = await axiosClient.get(`/api/Portfolios/student/${studentId}`);
      setPortfolio(res.data);
    } catch (error) {
      alert("Lỗi phân tích AI: " + (error.response?.data?.message || error.message));
    } finally {
      setAnalyzingRepoId(null);
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
          {isSyncing ? 'Đang đồng bộ...' : 'Sync GitHub'}
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
                  disabled={analyzingRepoId === repo.repoId}
                >
                  {analyzingRepoId === repo.repoId ? 'AI Đang đọc README...' : 'AI Phân Tích Code'}
                </button>
              </div>
              
              {/* Hiển thị kết quả AI sau khi phân tích */}
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