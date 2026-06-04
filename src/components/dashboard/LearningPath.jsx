// src/components/dashboard/LearningPath.jsx
import React, { useState } from 'react';

function LearningPath() {
  // 1. Khởi tạo State chứa toàn bộ dữ liệu động (Sau này chỉ cần set dữ liệu từ API vào đây)
  const [pathData, setPathData] = useState({
    title: "Lộ trình của tôi",
    totalProgress: 53,
    currentCourse: {
      name: "Nền tảng Lập trình",
      progress: 68
    },
    topics: [
      { id: 1, name: "HTML5 & CSS3 nâng cao", status: "completed" },
      { id: 2, name: "JavaScript ES2024", status: "completed" },
      { id: 3, name: "Data Structures cơ bản", status: "in-progress", detail: "(60%)" }
    ]
  });

  // Hàm phụ trợ để hiển thị icon trạng thái động dựa trên dữ liệu
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '🟢';
      case 'in-progress': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
      {/* Tiêu đề & Tổng tiến độ động */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-white mb-0">{pathData.title}</h6>
        <span className="text-success small fw-medium">{pathData.totalProgress}% tổng tiến độ</span>
      </div>
      
      {/* Khóa học hiện tại động */}
      <div className="p-3 rounded-3" style={{ backgroundColor: '#161925', borderLeft: '4px solid #10b981' }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold">{pathData.currentCourse.name}</span>
          <span className="text-success fw-bold">{pathData.currentCourse.progress}%</span>
        </div>
        <div className="progress" style={{ height: '6px', backgroundColor: '#22223b' }}>
          <div 
            className="progress-bar bg-success" 
            style={{ width: `${pathData.currentCourse.progress}%`, transition: 'width 0.5s ease-in-out' }}
          ></div>
        </div>
      </div>
      
      {/* Danh sách bài học/chủ đề động dùng vòng lặp map */}
      <div className="mt-3 d-flex flex-column gap-2 small">
        {pathData.topics.map((topic) => (
          <div key={topic.id} className="d-flex align-items-center gap-2 text-white opacity-75">
            <span>{renderStatusIcon(topic.status)}</span>
            <span>{topic.name} {topic.detail && <span className="text-white-50">{topic.detail}</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearningPath;
