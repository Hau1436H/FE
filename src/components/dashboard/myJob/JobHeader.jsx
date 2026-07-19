// src/components/dashboard/myJob/JobHeader.jsx
import React from 'react';

function JobHeader({ jobs = [], marketStats = {} }) {
  // Tính toán dữ liệu thực tế từ danh sách job AI Match
  const totalJobs = jobs.length;
  const avgMatch = totalJobs > 0 
    ? Math.round(jobs.reduce((acc, job) => acc + (job.match || 0), 0) / totalJobs) 
    : 0;
  
  // Đếm số lượng công ty duy nhất (Tập đoàn)
  const uniqueCompanies = new Set(jobs.filter(j => j.companyName).map(j => j.companyName)).size;

  // Lấy số liệu Job cào được trong ngày từ DB (được truyền từ file cha)
  // Xử lý an toàn chữ hoa/chữ thường tùy thuộc vào cách C# serialize JSON
  const newlyScrapedToday = marketStats?.jobsToday || marketStats?.JobsToday || 0;

  return (
    <div className="mb-4">
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold text-white mb-1 fs-5">Career & Mentorship</h4>
          <p className="text-white-50 extra-small mb-0" style={{ fontSize: '12px' }}>Vị trí được AI gợi ý dựa trên kỹ năng và lộ trình học của bạn</p>
        </div>
        <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill border border-success border-opacity-25 small font-medium" style={{ fontSize: '12px' }}>
          ✨ {avgMatch > 0 ? `${avgMatch}% AI Match score` : 'Đang phân tích AI...'}
        </span>
      </div>

      {/* AI Job Matching Panel */}
      <div className="p-3 rounded-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
        <span className="badge bg-success bg-opacity-20 text-white mb-1 extra-small text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
          AI JOB MATCHING
        </span>
        <h6 className="text-white-50 small mb-0" style={{ fontSize: '13px' }}>
          {totalJobs > 0 ? `${totalJobs} việc làm phù hợp với profile của bạn hôm nay` : 'Chưa có việc làm nào phù hợp. Hãy cào thêm dữ liệu!'}
        </h6>
      </div>

      {/* Grid 4 thẻ thống kê tự động */}
      <div className="row g-3">
        {[
          { icon: "💼", num: totalJobs.toString(), text: "Việc phù hợp" },
          { icon: "📊", num: `${avgMatch}%`, text: "Chỉ số Match TB" },
          { icon: "🏢", num: uniqueCompanies.toString(), text: "Công ty / Tập đoàn" },
          { icon: "🚀", num: newlyScrapedToday.toString(), text: "Mới cào về" }
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