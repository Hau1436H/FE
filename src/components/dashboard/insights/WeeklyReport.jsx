import React from 'react';

function WeeklyReport({ histories }) {
  // Tính toán dữ liệu giả lập từ bảng Histories (Hoặc lấy API đếm thật từ Backend)
  const jobScrapedCount = histories.filter(h => h.action_type === 'SYSTEM_JOB_SCRAPED').length;
  const repoAnalyzedCount = histories.filter(h => h.action_type === 'AI_REPO_ANALYZED').length;
  const skillGapViews = histories.filter(h => h.action_type === 'VIEW_SKILL_GAP').length;

  return (
    <div className="rounded-4 p-4 h-100 d-flex flex-column" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="fw-bold text-white mb-0" style={{ fontSize: '16px' }}>
          <i className="bi bi-journal-richtext text-info me-2"></i>Báo cáo Tuần
        </h6>
        <span className="text-info font-monospace fw-bold bg-info bg-opacity-10 px-2 py-1 rounded-2" style={{ fontSize: '11px' }}>
          TUẦN NÀY
        </span>
      </div>

      {/* Tóm tắt Metrics Định hướng thay cho XP */}
      <div className="row g-2 mb-4 text-center rounded-3">
        <div className="col-6">
          <div className="bg-dark border border-secondary border-opacity-25 rounded-3 p-3">
            <div className="text-white-50 font-monospace text-uppercase d-block mb-2" style={{ fontSize: '10px' }}>Độ Sẵn Sàng</div>
            <div className="fw-bold text-success fs-3 mb-0" style={{ lineHeight: '1' }}>78<span className="fs-6">%</span></div>
            <div className="text-success mt-2" style={{ fontSize: '11px' }}><i className="bi bi-arrow-up-short"></i>+4% so với tuần trước</div>
          </div>
        </div>
        <div className="col-6">
          <div className="bg-dark border border-secondary border-opacity-25 rounded-3 p-3">
            <div className="text-white-50 font-monospace text-uppercase d-block mb-2" style={{ fontSize: '10px' }}>Skill Gap</div>
            <div className="fw-bold text-warning fs-3 mb-0" style={{ lineHeight: '1' }}>-3</div>
            <div className="text-white-50 mt-2" style={{ fontSize: '11px' }}>Kỹ năng còn thiếu</div>
          </div>
        </div>
      </div>

      <div className="text-white-50 extra-small text-uppercase fw-bold opacity-50 mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
        TỔNG HỢP HIỆU SUẤT HỆ THỐNG
      </div>

      <div className="d-flex flex-column gap-3">
        
        <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-github text-white-50 fs-5"></i>
            <div>
              <span className="text-white d-block fw-semibold" style={{ fontSize: '13px' }}>Phân tích mã nguồn</span>
              <span className="text-white-50" style={{ fontSize: '11px' }}>Dự án đã được AI quét</span>
            </div>
          </div>
          <span className="fw-bold text-white font-monospace">{repoAnalyzedCount} Repo</span>
        </div>

        <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-briefcase text-white-50 fs-5"></i>
            <div>
              <span className="text-white d-block fw-semibold" style={{ fontSize: '13px' }}>Quét thị trường (Market Pulse)</span>
              <span className="text-white-50" style={{ fontSize: '11px' }}>Số lần đồng bộ Job mới</span>
            </div>
          </div>
          <span className="fw-bold text-white font-monospace">{jobScrapedCount} Lần</span>
        </div>

        <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-bullseye text-white-50 fs-5"></i>
            <div>
              <span className="text-white d-block fw-semibold" style={{ fontSize: '13px' }}>Cập nhật Định hướng</span>
              <span className="text-white-50" style={{ fontSize: '11px' }}>Tra cứu Skill Gap</span>
            </div>
          </div>
          <span className="fw-bold text-white font-monospace">{skillGapViews} Lần</span>
        </div>

      </div>

      {/* Lời khuyên Mentor */}
      <div className="mt-auto pt-4">
        <div className="p-3 rounded-3 border border-info border-opacity-25 bg-info bg-opacity-10 position-relative">
          <i className="bi bi-robot text-info position-absolute fs-3" style={{ top: '-15px', right: '15px' }}></i>
          <span className="text-info fw-bold font-monospace d-block mb-1" style={{ fontSize: '11px' }}>AI MENTOR INSIGHT</span>
          <p className="text-white-50 mb-0" style={{ fontSize: '12.5px', lineHeight: '1.5' }}>
            Tuần này nhu cầu tuyển dụng các vị trí liên quan đến <strong className="text-white">Docker</strong> tăng vọt. Hãy hoàn thành Node này trong Roadmap để tăng 15% tỷ lệ Match CV.
          </p>
        </div>
      </div>

    </div>
  );
}

export default WeeklyReport;