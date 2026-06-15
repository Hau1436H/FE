// src/components/skillAssessment/GoalTab.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function GoalTab({ onNextTab }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // GỌI API LẤY DANH SÁCH SKILL NODES (TAGS) TỪ BACKEND
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/api/assessments/all-skill-nodes');
        const nodesData = response.data.data || response.data;
        if (nodesData && nodesData.length > 0) {
          setTags(nodesData);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách Tags kỹ năng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="card border-secondary border-opacity-25 text-white p-5 mx-auto" style={{ backgroundColor: '#0b0c16', maxWidth: '800px' }}>
      <div className="text-center mb-5">
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill mb-3">
          Bước 1 / 4
        </span>
        <h3 className="fw-bold text-white mb-3">Chọn Kỹ Năng Cần Đánh Giá</h3>
        <p className="text-white-50">
          Hãy chọn một kỹ năng cụ thể dưới đây để hệ thống AI khởi tạo bài kiểm tra năng lực dành riêng cho bạn.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-white-50 mt-2 small">Đang tải danh sách kỹ năng...</p>
        </div>
      ) : (
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          {tags.map(tag => (
            <button
              key={tag.id}
              className={`btn rounded-pill px-4 py-2 transition-all fw-medium ${
                selectedNodeId === tag.id 
                  ? 'btn-success text-white shadow' 
                  : 'btn-outline-secondary text-white-50 border-secondary border-opacity-25'
              }`}
              style={{ backgroundColor: selectedNodeId === tag.id ? '' : '#111324' }}
              onClick={() => setSelectedNodeId(tag.id)}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}

      <div className="text-center border-top border-secondary border-opacity-25 pt-4">
        <button 
          className="btn btn-success px-5 py-2 fw-medium fs-5"
          disabled={!selectedNodeId || loading}
          onClick={() => onNextTab(selectedNodeId)} 
        >
          Bắt đầu làm bài Test 🚀
        </button>
      </div>
    </div>
  );
}

export default GoalTab;