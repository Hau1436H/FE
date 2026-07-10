import React from "react";
import { FaUserGraduate } from "react-icons/fa";

function StudentProgressList({ data }) {
  return (
    <div className="p-4 rounded-3 mt-4" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
      <h5 className="mb-4 d-flex align-items-center gap-2 text-success">
        <FaUserGraduate /> Danh sách sinh viên & Tiến độ Roadmap
      </h5>
      
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: "transparent" }}>
          <thead style={{ borderBottom: "2px solid #22223b" }}>
            <tr>
              <th className="text-white-50 fw-normal">Họ và tên</th>
              <th className="text-white-50 fw-normal">Định hướng</th>
              <th className="text-white-50 fw-normal" style={{ width: "40%" }}>Tiến độ học tập</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-white-50 py-4">Chưa có dữ liệu sinh viên</td>
              </tr>
            ) : (
              data.map((student) => (
                <tr key={student.studentId} style={{ borderBottom: "1px solid #1e1e2f" }}>
                  <td className="fw-semibold">{student.fullName}</td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-50 text-light fw-normal">
                      {student.targetRoleName}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: "6px", backgroundColor: "#22223b" }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${student.progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="small text-white-50" style={{ minWidth: "45px" }}>
                        {student.progressPercentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentProgressList;