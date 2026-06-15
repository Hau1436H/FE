import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react'; 
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

function AssessmentHistory() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState('list'); 
  const [historyList, setHistoryList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [detailData, setDetailData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);

  // LẤY DANH SÁCH BÀI LÀM
  useEffect(() => {
    const fetchHistoryList = async () => {
      try {
        const response = await fetch(`https://localhost:7196/api/assessments/my-history/${studentId}`);
        if (response.ok) {
          const result = await response.json();
          const actualData = result.data || result.Data || [];
          setHistoryList(actualData);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách:", err);
      } finally {
        setLoadingList(false);
      }
    };
    if (studentId) fetchHistoryList();
  }, [studentId]);

  // XEM CHI TIẾT 1 BÀI
  const handleViewDetail = async (assessmentId) => { 
    setViewMode('detail'); 
    setLoadingDetail(true);
    setError(null);

    try {
      // ĐÃ SỬA: Gọi API theo assessmentId
      const response = await fetch(`https://localhost:7196/api/assessments/history-detail/${assessmentId}`);
      if (!response.ok) throw new Error('Không thể tải chi tiết dữ liệu.');
      const result = await response.json();
      
      const actualDetailData = result.data || result.Data;
      if (actualDetailData) {
        setDetailData(actualDetailData);
      } else {
        throw new Error('Dữ liệu trả về trống.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setDetailData(null);
    setError(null);
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#020205', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <Sidebar />

      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh' }}>
        <DashboardHeader />

        {/* =========================================
            GIAO DIỆN 1: DANH SÁCH BÀI LÀM (LIST)
            ========================================= */}
        {viewMode === 'list' && (
          <>
            <div className="mb-4">
              <h3 className="fw-bold mb-1">Lịch sử đánh giá</h3>
              <p className="text-secondary mb-0">Quản lý và xem lại toàn bộ các bài thực hành đã nộp</p>
            </div>

            {loadingList ? (
              <div className="text-center mt-5"><div className="spinner-border text-success" /></div>
            ) : historyList.length === 0 ? (
              <div className="alert alert-dark border-secondary text-center">Bạn chưa hoàn thành bài đánh giá nào.</div>
            ) : (
              <div className="row g-4">
                {historyList.map((item) => (
                  <div key={item.assessmentId} className="col-12 col-md-6 col-lg-4">
                    <div className="card bg-dark border-secondary h-100 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title text-success fw-bold mb-0">{item.nodeName}</h5>
                          <span className={`badge ${item.testScore >= 8 ? 'bg-success' : item.testScore >= 5 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {item.testScore}/10
                          </span>
                        </div>
                        <p className="text-secondary small mb-4">
                          <i className="bi bi-clock me-1"></i> {new Date(item.takenAt).toLocaleString('vi-VN')}
                        </p>
                        
                        {/* ĐÃ SỬA: Đổi UI nút bấm dựa trên loại bài kiểm tra */}
                        <button 
                          className={`btn mt-auto ${item.isQuiz ? 'btn-outline-info' : 'btn-outline-light'}`}
                          onClick={() => handleViewDetail(item.assessmentId)}
                        >
                          {item.isQuiz ? (
                            <><i className="bi bi-card-checklist me-2"></i>Xem kết quả Quiz</>
                          ) : (
                            <><i className="bi bi-code-square me-2"></i>Xem Code & Phản hồi</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* =========================================
            GIAO DIỆN 2: CHI TIẾT CODE & AI (DETAIL)
            ========================================= */}
        {viewMode === 'detail' && (
          <>
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <div>
                <h3 className="fw-bold mb-1">Chi tiết bài làm</h3>
                <p className="text-secondary mb-0">Xem lại dữ liệu đã nộp và phản hồi từ AI</p>
              </div>
              <button className="btn btn-outline-success" onClick={handleBackToList}>
                <i className="bi bi-arrow-left me-2"></i>Quay lại danh sách
              </button>
            </div>

            {loadingDetail && (
              <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-success"></div></div>
            )}

            {error && (
              <div className="alert alert-warning bg-dark text-warning border-warning">
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
              </div>
            )}

            {!loadingDetail && !error && detailData && (
              <div className="row g-4">
                {/* Cột Trái: Trình soạn thảo Code hoặc Thông báo Quiz */}
                <div className="col-12 col-lg-8">
                  <div className="card bg-dark border-secondary h-100">
                    <div className="card-header border-secondary d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-white">
                        <i className={`bi ${detailData.submittedCode === 'Real_DB_Quiz_Logic' ? 'bi-card-checklist text-info' : 'bi-code-slash text-success'} me-2`}></i>
                        Môn học: {detailData.nodeName}
                      </span>
                      <span className="badge bg-secondary">
                        Đã nộp: {new Date(detailData.takenAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    
                    <div className="card-body p-0" style={{ height: '500px' }}>
                      {/* ĐÃ SỬA: Kiểm tra nếu là Quiz thì không render Monaco Editor */}
                      {detailData.submittedCode === 'Real_DB_Quiz_Logic' ? (
                        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-secondary p-4 text-center">
                          <i className="bi bi-ui-checks-grid display-1 mb-3"></i>
                          <h4>Đây là bài đánh giá Trắc nghiệm (Quiz)</h4>
                          <p>Hệ thống không lưu trữ mã nguồn cho dạng bài thi này.</p>
                        </div>
                      ) : (
                        <Editor
                          height="100%"
                          theme="vs-dark"
                          defaultLanguage="csharp"
                          value={detailData.submittedCode}
                          options={{
                            readOnly: true, 
                            minimap: { enabled: false },
                            fontSize: 14,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Cột Phải: Kết quả & AI Feedback */}
                <div className="col-12 col-lg-4">
                  <div className="card bg-dark border-secondary mb-4">
                    <div className="card-body text-center">
                      <h5 className="text-secondary mb-3">Điểm Đánh Giá</h5>
                      <div className={`display-3 fw-bold ${detailData.testScore >= 8 ? 'text-success' : detailData.testScore >= 5 ? 'text-warning' : 'text-danger'}`}>
                        {detailData.testScore}
                      </div>
                    </div>
                  </div>

                  <div className="card bg-dark border-secondary h-100" style={{ maxHeight: '330px' }}>
                    <div className="card-header border-secondary">
                      <span className="fw-bold text-white">
                        <i className="bi bi-robot me-2 text-success"></i>AI Feedback
                      </span>
                    </div>
                    <div className="card-body overflow-auto">
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#e0e0e0' }}>
                        {detailData.aiFeedback}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AssessmentHistory;