import React from "react";
import { FaClipboardList, FaCheckCircle, FaStar } from "react-icons/fa";

function AssessmentStats({ data }) {
  if (!data) return null;

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className="p-3 rounded-3 d-flex align-items-center gap-3" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
          <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary fs-3">
            <FaClipboardList />
          </div>
          <div>
            <div className="text-white-50 small">Tổng lượt làm bài</div>
            <div className="fs-4 fw-bold text-white">{data.totalSessions}</div>
          </div>
        </div>
      </div>
      
      <div className="col-md-4">
        <div className="p-3 rounded-3 d-flex align-items-center gap-3" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
          <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success fs-3">
            <FaCheckCircle />
          </div>
          <div>
            <div className="text-white-50 small">Tỷ lệ qua môn (Pass Rate)</div>
            <div className="fs-4 fw-bold text-white">{data.passRate}%</div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="p-3 rounded-3 d-flex align-items-center gap-3" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
          <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning fs-3">
            <FaStar />
          </div>
          <div>
            <div className="text-white-50 small">Điểm trung bình toàn khóa</div>
            <div className="fs-4 fw-bold text-white">{data.averageScore} / 10</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentStats;