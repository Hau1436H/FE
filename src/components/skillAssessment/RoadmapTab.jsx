// src/components/skillAssessment/RoadmapTab.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function RoadmapTab({ sessionId, result }) {
  const hasTaken = result?.hasTaken || false;
  const score = parseFloat(result?.score) || 0;
  const total = parseFloat(result?.total) || 20;

  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(hasTaken);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');

  // SỬ DỤNG TRIGGER ĐỂ RE-FETCH DATA CHUẨN REACT HOOKS
  const [refreshKey, setRefreshKey] = useState(0);

  // ĐƯA HÀM FETCH VÀO TRONG USEEFFECT ĐỂ FIX LỖI ESLINT
  useEffect(() => {
    const fetchRoadmapData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get('/api/roadmap/skill-tree');
        const roadmapData = response.data.data || response.data || [];
        setStages(roadmapData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu lộ trình:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasTaken) {
      fetchRoadmapData();
    }
  }, [hasTaken, refreshKey]); // Lắng nghe thêm refreshKey

  // HÀM GỌI API YÊU CẦU AI PHÂN TÍCH VÀ TẠO LỘ TRÌNH
  const handleGenerateAiRoadmap = async () => {
    setIsGenerating(true);
    try {
      const response = await axiosClient.post(`/api/roadmap-engine/generate-from-session/${sessionId}`);
      setAiAdvice(response.data.message);
      
      // TĂNG REFRESH KEY ĐỂ TRIGGER USEEFFECT TỰ ĐỘNG TẢI LẠI DATA
      setRefreshKey(oldKey => oldKey + 1); 
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.Error || "Lỗi hệ thống khi gọi AI.";
      alert(`Backend báo lỗi: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === 'completed') return <span className="badge text-success border border-success px-3 py-1 rounded-pill bg-success bg-opacity-10">Đã hoàn thành</span>;
    if (normalizedStatus === 'learning') return <span className="badge text-warning border border-warning px-3 py-1 rounded-pill bg-warning bg-opacity-10">Đang học bù lỗ hổng</span>;
    return <span className="badge bg-dark text-white-50 border border-secondary px-3 py-1 rounded-pill">Lộ trình tiếp theo</span>;
  };

  if (isLoading) return <div className="text-center py-5 text-white-50"><div className="spinner-border text-success mb-2"></div><br/>Đang nạp dữ liệu Lộ trình...</div>;

  return (
    <div className="mx-auto pb-5" style={{ maxWidth: '800px', color: '#fff' }}>
      
      {/* NẾU AI ĐÃ TRẢ LỜI KHUYÊN -> HIỂN THỊ */}
      {aiAdvice && (
        <div className="alert alert-success bg-success bg-opacity-10 border-success text-success mb-4 shadow-sm">
          <i className="bi bi-robot me-2"></i> <strong>AI Mentor: </strong>
          <span style={{ whiteSpace: 'pre-wrap' }}>{aiAdvice}</span>
        </div>
      )}

      {stages.length === 0 ? (
        /* GIAO DIỆN KHI CHƯA CÓ LỘ TRÌNH -> HIỆN NÚT KÍCH HOẠT AI */
        <div className="text-center py-5 border border-secondary border-opacity-25 rounded-3 bg-dark bg-opacity-50 mt-4">
          <div className="mb-4">
            <i className="bi bi-magic text-warning" style={{ fontSize: '3rem' }}></i>
          </div>
          <h4 className="text-white fw-bold mb-3">AI Chưa Khởi Tạo Lộ Trình</h4>
          <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
            Dựa trên kết quả bài test hiện tại, hệ thống AI sẽ đối chiếu với dữ liệu chuẩn từ <strong>roadmap.sh</strong> để phân bổ nhánh ngành phù hợp và sinh ra lộ trình học tập cá nhân hóa.
          </p>
          <button
            className="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow hover-shadow"
            onClick={handleGenerateAiRoadmap}
            disabled={isGenerating}
          >
            {isGenerating ? (
               <><span className="spinner-border spinner-border-sm me-2"></span> AI Đang Xử Lý Dữ Liệu...</>
            ) : (
               <><i className="bi bi-cpu-fill me-2"></i> Kích hoạt AI Phân Tích & Tạo Lộ Trình</>
            )}
          </button>
        </div>
      ) : (
        /* GIAO DIỆN CÂY LỘ TRÌNH BÌNH THƯỜNG */
        <>
          <div className="mb-5 text-center mt-3">
            <h4 className="fw-bold text-white mb-2">Lộ Trình Học Tập Cá Nhân Hóa</h4>
            <p className="text-white-50 small mx-auto">Đồng bộ chuẩn <strong>roadmap.sh</strong> và được cá nhân hóa qua bài test ({score}/{total})</p>
          </div>

          <div className="d-flex flex-column gap-4 relative">
            <div className="position-absolute h-100" style={{ left: '1.25rem', top: '0', width: '2px', backgroundColor: '#1a1d2d', zIndex: 0 }}></div>

            {stages.map((stage, index) => {
              const normalizedStatus = stage.status?.toLowerCase() || (stage.isCompleted ? 'completed' : stage.isLocked ? 'locked' : 'not started');
              const isLearning = normalizedStatus === 'learning';
              const isCompleted = normalizedStatus === 'completed';

              return (
                <div key={stage.id || stage.nodeId || index} className="position-relative ps-5">
                  <div className={`position-absolute rounded-circle border border-2 ${isCompleted ? 'bg-success border-success' : isLearning ? 'bg-warning border-warning' : 'bg-dark border-secondary'}`} 
                       style={{ width: '1rem', height: '1rem', left: '0.75rem', top: '1.5rem', zIndex: 1 }}>
                  </div>

                  <div className="card border-secondary border-opacity-25 transition-all shadow-sm hover-shadow" 
                       style={{ backgroundColor: '#0b0c16', borderLeft: isLearning ? '4px solid #ffc107' : isCompleted ? '4px solid #198754' : '4px solid #343a40' }}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className={`fw-semibold font-monospace ${isCompleted ? 'text-success' : isLearning ? 'text-warning' : 'text-secondary'}`}>
                            Chặng {index + 1}
                        </span>
                        {renderStatusBadge(stage.status || (stage.isCompleted ? 'Completed' : stage.isLocked ? 'Locked' : 'Not Started'))}
                      </div>
                      <h5 className={`fw-bold mb-2 ${stage.isLocked ? 'text-white-50' : 'text-white'}`}>
                          {stage.nodeName || stage.title}
                      </h5>
                      <p className="text-white-50 small mb-0">
                          {stage.description || "Hãy hoàn thành các node trước để mở khóa nội dung này."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default RoadmapTab;