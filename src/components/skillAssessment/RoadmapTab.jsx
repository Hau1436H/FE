// src/components/skillAssessment/RoadmapTab.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function RoadmapTab({ result }) {
  // 1. Áp dụng lại fix chống crash: fallback về {} nếu result bị undefined
  const { hasTaken = false, score = 0, total = 0 } = result || {};
  
  const [stages, setStages] = useState([]);
  // 2. Khởi tạo trạng thái loading ban đầu khớp với hasTaken để tối ưu render
  const [isLoading, setIsLoading] = useState(hasTaken);

  useEffect(() => {
    // 3. FIX ESLint "set-state-in-effect": Chỉ cần return sớm, không gọi setState đồng bộ ở đây
    // Vì nếu !hasTaken thì isLoading vốn đã khởi tạo là false rồi.
    if (!hasTaken) {
      return;
    }

    const fetchRoadmapData = async () => {
      setIsLoading(true);
      try {
        // GỌI API THẬT
        const response = await axiosClient.get('/api/roadmap/skill-tree');
        
        // Ánh xạ dữ liệu trả về (Giả định response.data.data chứa mảng lộ trình)
        if (response.data && response.data.data) {
           setStages(response.data.data);
        }
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
          <div className="text-center text-white-50">Chưa có dữ liệu phân bổ lộ trình.</div>
        ) : (
          stages.map((stage, index) => {
            // 4. Đã xóa biến isCompleted không sử dụng để tránh ESLint warning
            const isLearning = stage.status === 'learning';

            return (
              <div key={stage.nodeId || index} className="card border-secondary border-opacity-25" style={{ backgroundColor: '#0b0c16', borderLeft: isLearning ? '3px solid #198754' : '' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-warning fw-semibold font-monospace">Node #{index + 1}</span>
                    {renderStatusBadge(stage.status)}
                  </div>
                  <h5 className="fw-bold mb-2">{stage.nodeName || stage.title}</h5>
                  <p className="text-white-50 small">{stage.description}</p>
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