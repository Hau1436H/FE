// src/components/skillAssessment/RoadmapTab.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function RoadmapTab({ result }) {
  const hasTaken = result?.hasTaken || false;

  // 1. Xử lý chống NaN triệt để (giống hệt StatsTab)
  const rawScore = parseFloat(result?.score);
  const rawTotal = parseFloat(result?.total);
  
  const score = isNaN(rawScore) ? 0 : rawScore;
  const total = isNaN(rawTotal) || rawTotal === 0 ? 10 : rawTotal;

  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(hasTaken);

  useEffect(() => {
    if (!hasTaken) return;

    const fetchRoadmapData = async () => {
      setIsLoading(true);
      try {
        // Gọi API lấy dữ liệu lộ trình
        const response = await axiosClient.get('/api/roadmap/skill-tree');
        
        // Hỗ trợ cả 2 trường hợp BE trả về object { data: [...] } hoặc trả thẳng mảng [...]
        const roadmapData = response.data.data || response.data || [];
        setStages(roadmapData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu lộ trình:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmapData();
  }, [hasTaken]);

  const renderStatusBadge = (status) => {
    if (status === 'completed') return <span className="badge text-success border px-3 py-1 rounded-pill">Đã hoàn thành</span>;
    if (status === 'learning') return <span className="badge text-warning border px-3 py-1 rounded-pill">Đang thực hiện</span>;
    return <span className="badge bg-secondary text-white-50 border px-3 py-1 rounded-pill">Lộ trình tiếp theo</span>;
  };

  if (isLoading) return <div className="text-center py-5 text-white-50">Đang đồng bộ lộ trình học tập từ AI...</div>;

  return (
    <div className="mx-auto" style={{ maxWidth: '800px', color: '#fff' }}>
      <div className="mb-5 text-center">
        <h4 className="fw-bold text-white mb-2">Lộ Trình Học Tập Cá Nhân Hóa</h4>
        <p className="text-white-50 small mx-auto">
          {hasTaken 
            ? `Dựa trên kết quả (${score}/${total}), hệ thống đã sắp xếp lộ trình phù hợp với bạn.`
            : "Hoàn thành bài test để kích hoạt lộ trình này."}
        </p>
      </div>

      <div className="d-flex flex-column gap-4">
        {stages.length === 0 ? (
          <div className="text-center text-white-50">
             Chưa có dữ liệu phân bổ lộ trình. Backend chưa trả về data.
          </div>
        ) : (
          stages.map((stage, index) => {
            const isLearning = stage.status === 'learning';

            return (
              <div key={stage.id || stage.nodeId || index} className="card border-secondary border-opacity-25" style={{ backgroundColor: '#0b0c16', borderLeft: isLearning ? '3px solid #198754' : '' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-warning fw-semibold font-monospace">Node #{index + 1}</span>
                    {renderStatusBadge(stage.status)}
                  </div>
                  <h5 className="fw-bold mb-2">{stage.nodeName || stage.title}</h5>
                  <p className="text-white-50 small">{stage.description || "Hãy hoàn thành node này để mở khóa các kỹ năng tiếp theo."}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RoadmapTab;