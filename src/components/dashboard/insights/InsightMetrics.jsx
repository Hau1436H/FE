import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

function InsightMetrics({ histories = [] }) {
  // Tự động tính toán các chỉ số thống kê từ dữ liệu gốc Backend trả về
  const totalEvents = histories.length;
  const aiAnalyzedCount = histories.filter(h => h.action_type === 'AI_REPO_ANALYZED').length;
  const marketScrapedCount = histories.filter(h => h.action_type === 'SYSTEM_JOB_SCRAPED').length;
  const skillGapViews = histories.filter(h => h.action_type === 'VIEW_SKILL_GAP').length;

  // Cấu hình 4 thẻ Metrics
  const stats = [
    {
      id: 1,
      icon: "bi bi-activity",
      count: totalEvents.toString(),
      label: "Tổng sự kiện",
      desc: "Toàn thời gian",
      bg: "rgba(59, 130, 246, 0.1)",
      color: "#3b82f6" // Xanh dương
    },
    {
      id: 2,
      icon: "bi bi-robot",
      count: aiAnalyzedCount.toString(),
      label: "Repo đã phân tích",
      desc: "Bởi AI Mentor",
      bg: "rgba(139, 92, 246, 0.1)",
      color: "#8b5cf6" // Tím
    },
    {
      id: 3,
      icon: "bi bi-graph-up-arrow",
      count: marketScrapedCount.toString(),
      label: "Quét thị trường",
      desc: "Dữ liệu việc làm",
      bg: "rgba(245, 158, 11, 0.1)",
      color: "#f59e0b" // Vàng cam
    },
    {
      id: 4,
      icon: "bi bi-radar",
      count: skillGapViews.toString(),
      label: "Cập nhật Skill Gap",
      desc: "So khớp năng lực",
      bg: "rgba(16, 185, 129, 0.1)",
      color: "#10b981" // Xanh ngọc
    }
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((stat) => (
        <div key={stat.id} className="col-12 col-sm-6 col-md-3">
          <div className="p-3 rounded-4 d-flex align-items-center gap-3 h-100 transition-all" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
            
            {/* Vùng icon màu sắc */}
            <div 
              className="fs-4 p-2 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" 
              style={{ backgroundColor: stat.bg, color: stat.color, width: '48px', height: '48px' }}
            >
              <i className={stat.icon} style={{ color: stat.color, fontSize: '22px' }}></i>
            </div>
            
            {/* Vùng số liệu */}
            <div>
              <div className="d-flex align-items-baseline gap-2">
                <h5 className="fw-bold text-white mb-0" style={{ fontSize: '20px' }}>{stat.count}</h5>
                <small className="fw-medium text-nowrap" style={{ color: stat.color, fontSize: '11px' }}>{stat.desc}</small>
              </div>
              <small className="text-white-50 text-nowrap d-block mt-1" style={{ fontSize: '12px' }}>{stat.label}</small>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default InsightMetrics;