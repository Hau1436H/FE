// src/components/dashboard/Studynext.jsx
import React, { useState } from 'react';

function StudyNext() {
  // Khởi tạo State chứa thông tin bài học gợi ý tiếp theo
  const [nextLesson, setNextLesson] = useState({
    statusBadge: "Đang học",
    badgeColor: "bg-primary", // Có thể đổi thành bg-warning nếu là "Sắp diễn ra"
    title: "Data Structures - Trees & Graphs",
    level: "Trung cấp",
    timeRemaining: "3h còn lại",
    actionText: "Tiếp tục học"
  });

  // Hàm xử lý sự kiện khi người dùng bấm nút học tiếp
  const handleContinueLesson = () => {
    console.log(`Đang chuyển hướng đến bài học: ${nextLesson.title}`);
    // Sau này bạn có thể dùng useNavigate() để nhảy sang trang học tập thực tế, ví dụ: navigate(`/learn/${nextLesson.id}`);
  };

  return (
    <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
      <h6 className="fw-bold text-white mb-3">Học tiếp gì?</h6>
      
      {nextLesson ? (
        <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: '#161925' }}>
          {/* Badge trạng thái động */}
          <span className={`badge ${nextLesson.badgeColor} mb-2`}>
            {nextLesson.statusBadge}
          </span>
          
          {/* Tiêu đề bài học động */}
          <div className="fw-bold mb-1 text-white">{nextLesson.title}</div>
          
          {/* Thông tin bổ sung động */}
          <div className="text-white-50 extra-small mb-3" style={{ fontSize: '12px' }}>
            {nextLesson.level} • {nextLesson.timeRemaining}
          </div>
          
          {/* Nút hành động */}
          <button 
            className="btn btn-outline-success btn-sm w-100 rounded-2 fw-medium"
            onClick={handleContinueLesson}
          >
            {nextLesson.actionText}
          </button>
        </div>
      ) : (
        /* Hiển thị nếu đã hoàn thành toàn bộ lộ trình và không còn bài học gợi ý */
        <div className="text-muted text-center py-3 small">
          🎉 Tuyệt vời! Bạn đã hoàn thành tất cả bài học trong lộ trình này.
        </div>
      )}
    </div>
  );
}

export default StudyNext;
