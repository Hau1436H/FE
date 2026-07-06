import React from 'react';

// Bộ Mapper biến ActionType từ Database thành Giao diện (Màu sắc, Icon, Tiêu đề)
const insightMapper = {
  'SYNC_GITHUB_SUCCESS': {
    icon: 'bi-github', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', 
    title: 'Đồng bộ Portfolio', label: 'E-Portfolio'
  },
  'AI_REPO_ANALYZED': {
    icon: 'bi-robot', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', 
    title: 'AI Phân tích Code', label: 'AI Mentor'
  },
  'SYSTEM_JOB_SCRAPED': {
    icon: 'bi-graph-up-arrow', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', 
    title: 'Cập nhật Market Pulse', label: 'Market Trend'
  },
  'VIEW_SKILL_GAP': {
    icon: 'bi-radar', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', 
    title: 'Đánh giá Skill Gap', label: 'Career Match'
  },
  'ENROLL': {
    icon: 'bi-signpost-split', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', 
    title: 'Lộ trình học tập', label: 'Roadmap'
  },
  'DEFAULT': {
    icon: 'bi-info-circle', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', 
    title: 'Hoạt động hệ thống', label: 'System'
  }
};

function InsightTimeline({ histories = [] }) {
  return (
    <div className="rounded-4 p-4 d-flex flex-column h-100" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <h6 className="fw-bold text-white mb-0" style={{ fontSize: '16px' }}>
            <i className="bi bi-activity text-success me-2"></i>Dòng thời gian Insight
          </h6>
        </div>
        <span className="badge bg-secondary bg-opacity-20 text-white-50 px-3 py-2 rounded-pill font-monospace" style={{ fontSize: '11px' }}>
          Real-time Telemetry
        </span>
      </div>

      <div className="text-white-50 extra-small text-uppercase fw-bold opacity-50 mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
        LỊCH SỬ PHÂN TÍCH & CẬP NHẬT GẦN ĐÂY
      </div>

      <div className="d-flex flex-column gap-3 flex-grow-1">
        {histories.length > 0 ? (
          histories.map((history) => {
            const meta = insightMapper[history.action_type] || insightMapper['DEFAULT'];
            
            return (
              <div key={history.history_id} className="d-flex gap-3 pb-3 border-bottom border-secondary border-opacity-10 align-items-start transition-all">
                
                {/* Icon bọc trong Badge màu */}
                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: meta.bg, color: meta.color, width: '40px', height: '40px' }}>
                  <i className={`bi ${meta.icon} fs-5`}></i>
                </div>

                <div className="flex-grow-1 pe-2">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14px' }}>
                      {meta.title}
                    </h6>
                    {/* Convert recorded_at ra giờ thân thiện */}
                    <span className="text-white-50 opacity-50 font-monospace" style={{ fontSize: '11px' }}>
                      {new Date(history.recorded_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(history.recorded_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  
                  {/* Nếu Backend chưa có cột Details, tạm thời gen text động dựa theo duration */}
                  <p className="text-white-50 mb-2" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    {history.action_type === 'SYSTEM_JOB_SCRAPED' 
                      ? `Hệ thống vừa cào dữ liệu thị trường việc làm trong ${history.duration_seconds} giây. Cập nhật trend công nghệ mới nhất.`
                      : history.action_type === 'SYNC_GITHUB_SUCCESS'
                      ? `Đồng bộ mã nguồn từ GitHub thành công (${history.duration_seconds}s). Sẵn sàng để AI phân tích kỹ năng.`
                      : `Hoàn tất tiến trình ${history.action_type.replace(/_/g, ' ')}.`}
                  </p>

                  <span className="badge rounded-pill border fw-normal px-2 py-1" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: meta.color, fontSize: '11px' }}>
                    {meta.label}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-white-50 small my-auto py-5">
            <i className="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
            Chưa có nhật ký hoạt động nào.
          </div>
        )}
      </div>
    </div>
  );
}

export default InsightTimeline;