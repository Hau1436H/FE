// src/components/dashboard/myJob/JobHeader.jsx
import React from 'react';

function JobHeader() {
  return (
    <div className="mb-4">
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold text-white mb-1 fs-5">Career & Mentorship</h4>
          <p className="text-white-50 extra-small mb-0" style={{ fontSize: '12px' }}>Vị trí được AI gợi ý dựa trên kỹ năng và lộ trình học của bạn</p>
        </div>
        <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill border border-success border-opacity-25 small font-medium" style={{ fontSize: '12px' }}>
          ✨ 95% AI Match score
        </span>
      </div>

      {/* AI Job Matching Panel */}
      <div className="p-3 rounded-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
        <span className="badge bg-success bg-opacity-20 text-white mb-1 extra-small text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
          AI JOB MATCHING
        </span>
        <h6 className="text-white-50 small mb-0" style={{ fontSize: '13px' }}>8 việc làm phù hợp với profile của bạn hôm nay</h6>
      </div>

      {/* Grid 4 thẻ thống kê */}
      <div className="row g-3">
        {[
          { icon: "💼", num: "8", text: "Việc phù hợp" },
          { icon: "📊", num: "88%", text: "Chỉ số Match TB" },
          { icon: "🏢", num: "3", text: "Tập đoàn lớn" },
          { icon: "🚀", num: "8", text: "Mới ứng tuyển" }
        ].map((item, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div className="p-3 rounded-4 h-100 d-flex align-items-center gap-3" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
              <div className="fs-5 p-2 rounded-3 bg-secondary bg-opacity-10">{item.icon}</div>
              <div>
                <h6 className="fw-bold text-white mb-0" style={{ fontSize: '15px' }}>{item.num}</h6>
                <small className="text-white-50 extra-small text-nowrap" style={{ fontSize: '11px' }}>{item.text}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobHeader;
