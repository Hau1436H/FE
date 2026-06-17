import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react'; 
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import axiosClient from '../../api/axiosClient';
// 1. IMPORT COMPONENT ROADMAP CÓ SẴN CỦA BẠN VÀO ĐÂY
import RoadmapTab from '../../components/skillAssessment/RoadmapTab';

function AssessmentHistory() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState('list'); 
  const [historyList, setHistoryList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [detailData, setDetailData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);

  // 2. STATE HIỆN TẠI HỖ TRỢ 3 TAB: 'quiz', 'code', 'roadmap'
  const [detailTab, setDetailTab] = useState('quiz'); 

  useEffect(() => {
    const fetchHistoryList = async () => {
      try {
        setLoadingList(true);
        const response = await axiosClient.get(`/api/assessments/my-history/${studentId}`);
        const actualData = response.data.data || response.data || [];
        setHistoryList(actualData);
      } catch (err) {
        console.error("Lỗi tải danh sách:", err);
      } finally {
        setLoadingList(false);
      }
    };
    if (studentId) fetchHistoryList();
  }, [studentId]);

  const handleViewDetail = async (assessmentId) => { 
    setViewMode('detail'); 
    setDetailTab('quiz'); // Mặc định mở tab Quiz trước
    setLoadingDetail(true);
    setError(null);

    try {
      const response = await axiosClient.get(`/api/assessments/history-detail/${assessmentId}`);
      const actualDetailData = response.data.data || response.data;
      
      if (actualDetailData) {
        setDetailData(actualDetailData);
      } else {
        throw new Error('Dữ liệu trả về trống.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Không thể tải chi tiết dữ liệu.');
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

        {/* ==============================================
            MÀN HÌNH DANH SÁCH (MASTER)
        ============================================== */}
        {viewMode === 'list' && (
          <>
            <div className="mb-4">
              <h3 className="fw-bold mb-1">Lịch sử đánh giá (Assessment Sessions)</h3>
              <p className="text-secondary mb-0">Quản lý các bộ test năng lực bạn đã thực hiện</p>
            </div>

            {loadingList ? (
              <div className="text-center mt-5"><div className="spinner-border text-success" /></div>
            ) : historyList.length === 0 ? (
              <div className="alert alert-dark border-secondary text-center">Bạn chưa hoàn thành bộ bài đánh giá nào.</div>
            ) : (
              <div className="row g-4">
                {historyList.map((session) => (
                  <div key={session.assessmentId || session.sessionId} className="col-12 col-md-6 col-lg-4">
                    <div className="card bg-dark border-secondary h-100 shadow-sm transition-all hover-shadow">
                      <div className="card-body d-flex flex-column">
                        <div className="mb-3">
                          <h5 className="card-title text-success fw-bold mb-1">{session.nodeName} Assessment</h5>
                          <p className="text-secondary small mb-0">
                            <i className="bi bi-clock me-1"></i> {new Date(session.takenAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-secondary bg-opacity-10 rounded">
                          <span className="text-white-50"><i className="bi bi-card-list me-2"></i>Điểm Lý thuyết:</span>
                          <span className="fw-bold text-info">{session.totalQuizScore || session.testScore || 0}/10</span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-4 p-2 bg-secondary bg-opacity-10 rounded">
                          <span className="text-white-50"><i className="bi bi-code-slash me-2"></i>Điểm Thực hành:</span>
                          <span className="fw-bold text-warning">{session.totalCodeScore || 0}/10</span>
                        </div>
                        
                        <button 
                          className="btn btn-outline-success mt-auto"
                          onClick={() => handleViewDetail(session.assessmentId || session.sessionId)}
                        >
                          <i className="bi bi-eye me-2"></i>Xem chi tiết bài làm
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ==============================================
            MÀN HÌNH CHI TIẾT (DETAIL)
        ============================================== */}
        {viewMode === 'detail' && (
          <>
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <div>
                <h3 className="fw-bold mb-1">Chi tiết Assessment: {detailData?.nodeName}</h3>
                <p className="text-secondary mb-0">Nộp lúc: {detailData ? new Date(detailData.takenAt).toLocaleString('vi-VN') : ''}</p>
              </div>
              <button className="btn btn-outline-secondary" onClick={handleBackToList}>
                <i className="bi bi-arrow-left me-2"></i>Quay lại
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
              <div className="card bg-dark border-secondary">
                {/* Custom Tabs */}
                <div className="card-header border-secondary d-flex flex-wrap gap-3 p-3 bg-opacity-50">
                  <button 
                    className={`btn ${detailTab === 'quiz' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-white'}`}
                    onClick={() => setDetailTab('quiz')}
                  >
                    <i className="bi bi-card-list me-2"></i>Lý thuyết ({detailData.totalQuizScore || detailData.testScore || 0}/10)
                  </button>
                  <button 
                    className={`btn ${detailTab === 'code' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-white'}`}
                    onClick={() => setDetailTab('code')}
                  >
                    <i className="bi bi-code-slash me-2"></i>Thực hành Code ({detailData.totalCodeScore || 0}/10)
                  </button>
                  {/* 3. NÚT TAB LỘ TRÌNH HỌC TẬP */}
                  <button 
                    className={`btn ${detailTab === 'roadmap' ? 'btn-success text-white fw-bold shadow' : 'btn-outline-secondary text-white'}`}
                    onClick={() => setDetailTab('roadmap')}
                  >
                    <i className="bi bi-map me-2"></i>Lộ Trình AI
                  </button>
                </div>

                <div className="card-body p-4">
                  {/* TAB QUIZ */}
                  {detailTab === 'quiz' && (
                    <div>
                      {detailData.quizDetails && detailData.quizDetails.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {detailData.quizDetails.map((q, idx) => (
                            <div key={idx} className={`p-3 rounded border ${q.isCorrect ? 'border-success bg-success bg-opacity-10' : 'border-danger bg-danger bg-opacity-10'}`}>
                              <p className="fw-bold mb-2">Câu {idx + 1}: <span className="text-white fw-normal">{q.questionText || `ID: ${q.questionId}`}</span></p>
                              <div className="d-flex justify-content-between">
                                <span>Đáp án bạn chọn: <strong className={q.isCorrect ? 'text-success' : 'text-danger'}>{q.selectedOption}</strong></span>
                                {q.isCorrect ? (
                                  <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Chính xác</span>
                                ) : (
                                  <span className="text-danger"><i className="bi bi-x-circle-fill me-1"></i>Sai (Đáp án đúng: {q.correctAnswer})</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-white-50 p-5">
                          Hệ thống hiện chưa lưu chi tiết từng câu hỏi trắc nghiệm của phiên làm bài này.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB CODE */}
                  {detailTab === 'code' && (
                    <div className="row g-4">
                      <div className="col-lg-8">
                        <div className="border border-secondary rounded overflow-hidden" style={{ height: '500px' }}>
                          <Editor
                            height="100%"
                            theme="vs-dark"
                            defaultLanguage="csharp"
                            value={detailData.codeDetail?.sourceCode || detailData.submittedCode || "// Không có dữ liệu code"}
                            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="card bg-dark border-secondary h-100">
                          <div className="card-header border-secondary fw-bold text-success">
                            <i className="bi bi-robot me-2"></i>AI Code Review
                          </div>
                          <div className="card-body overflow-auto" style={{ maxHeight: '450px' }}>
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#e0e0e0' }}>
                              {detailData.codeDetail?.aiFeedback || detailData.aiFeedback || "Chưa có nhận xét từ AI."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB LỘ TRÌNH AI */}
                  {detailTab === 'roadmap' && (
                    <div className="bg-dark bg-opacity-25 rounded border border-secondary border-opacity-25 p-3">
                      <RoadmapTab 
                        sessionId={detailData.sessionId || detailData.assessmentId} // TRUYỀN THÊM ID VÀO ĐÂY
                        result={{
                          hasTaken: true, 
                          score: (detailData.totalQuizScore || detailData.testScore || 0) + (detailData.totalCodeScore || 0),
                          total: 20
                        }} 
                      />
                    </div>
                  )}

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