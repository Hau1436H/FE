// src/components/dashboard/RecentActivity.jsx
import React, { useState } from 'react';

function RecentActivity() {
  // Khởi tạo State chứa danh sách lịch sử hoạt động động
  const [activities, setActivities] = useState([
    {
      id: 1,
      description: "Hoàn thành bài: Git Merge vs Rebase",
      xpReward: 50,
      isPositiveXp: true // Để xử lý nếu sau này có hoạt động trừ điểm hoặc không cộng điểm
    },
    {
      id: 2,
      description: "Làm bài test JavaScript - Đạt 87%",
      xpReward: 120,
      isPositiveXp: true
    }
  ]);

  return (
    <div className="p-4 rounded-4" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
      <h6 className="fw-bold text-white mb-3">Hoạt động gần đây</h6>
      <div className="d-flex flex-column gap-3 small">
        
        {/* Duyệt qua danh sách hoạt động bằng vòng lặp .map() */}
        {activities.map((activity) => (
          <div key={activity.id} className="d-flex justify-content-between align-items-center">
            <span className="text-white-50">{activity.description}</span>
            <span className={`fw-medium ${activity.isPositiveXp ? 'text-success' : 'text-muted'}`}>
              {activity.isPositiveXp ? `+${activity.xpReward}` : activity.xpReward} XP
            </span>
          </div>
        ))}

        {/* Hiển thị thông báo nếu mảng trống (Chưa có hoạt động nào) */}
        {activities.length === 0 && (
          <div className="text-muted text-center py-2">Chưa có hoạt động nào gần đây.</div>
        )}
        
      </div>
    </div>
  );
}

export default RecentActivity;
