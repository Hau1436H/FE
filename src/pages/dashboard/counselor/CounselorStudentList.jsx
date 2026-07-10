import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaSearch, FaSpinner } from "react-icons/fa";
import axiosClient from "../../../api/axiosClient";
import Sidebar from "../../../components/dashboard/Sidebar"; 
import DashboardHeader from "../../../components/dashboard/DashboardHeader";

function CounselorStudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State phân trang
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchStudents(pageNumber);
  }, [pageNumber]);

  const fetchStudents = async (page) => {
    try {
      setLoading(true);
      // Gọi API GetStudentsProgress từ C#
      const response = await axiosClient.get("/api/counselors/students", {
        params: {
          pageNumber: page,
          pageSize: pageSize
        }
      });
      
      // Lấy dữ liệu từ PagedResult
      const data = response.data;
      setStudents(data.items || data.Items || []);
      setTotalRecords(data.totalCount || data.TotalCount || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sinh viên:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="d-flex" style={{ backgroundColor: "#0a0a14", minHeight: "100vh" }}>
      
      {/* CỘT TRÁI: SIDEBAR */}
      <Sidebar />

      {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
      <div className="flex-grow-1 p-4 text-white" style={{ overflowY: "auto", height: "100vh" }}>
        <DashboardHeader />
        
        <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
          <h2 className="fw-bold mb-0">Quản lý Sinh viên</h2>
          <span className="badge bg-primary fs-6">{totalRecords} Sinh viên</span>
        </div>

        <div className="p-4 rounded-3 shadow-sm" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
          
          {/* Thanh công cụ (Bộ lọc tạm thời) */}
          <div className="d-flex mb-4 gap-3">
            <div className="input-group" style={{ width: "300px" }}>
              <span className="input-group-text bg-dark border-secondary text-white-50">
                <FaSearch />
              </span>
              <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Tìm tên hoặc MSSV..." />
            </div>
          </div>

          {/* Bảng danh sách sinh viên */}
          {loading ? (
            <div className="text-center py-5 text-primary">
              <FaSpinner className="fa-spin fs-2" />
              <p className="mt-2 text-white-50">Đang tải dữ liệu...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-5 text-white-50">
              <p>Chưa có dữ liệu sinh viên nào trên hệ thống.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle" style={{ backgroundColor: "transparent" }}>
                <thead>
                  <tr className="text-white-50 border-bottom border-secondary">
                    <th scope="col" className="bg-transparent fw-normal py-3">Học viên</th>
                    <th scope="col" className="bg-transparent fw-normal py-3">Định hướng (Target Role)</th>
                    <th scope="col" className="bg-transparent fw-normal py-3">Tiến độ Roadmap</th>
                    <th scope="col" className="bg-transparent fw-normal py-3">Điểm AI</th>
                    <th scope="col" className="bg-transparent fw-normal py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={index} className="border-bottom border-secondary border-opacity-25">
                      <td className="bg-transparent py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-success text-dark d-flex justify-content-center align-items-center fw-bold" style={{ width: "40px", height: "40px" }}>
                            {student.fullName ? student.fullName.charAt(0).toUpperCase() : "S"}
                          </div>
                          <div>
                            <div className="fw-bold text-white">{student.fullName || "Chưa cập nhật"}</div>
                            <div className="text-white-50 small">{student.email || student.studentCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="bg-transparent py-3">
                        <span className="badge bg-info text-dark font-monospace">
                          {student.targetRoleName || "Chưa rõ"}
                        </span>
                      </td>
                      <td className="bg-transparent py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1 bg-dark" style={{ height: "6px" }}>
                            <div className="progress-bar bg-success" style={{ width: `${student.progressPercentage || 0}%` }}></div>
                          </div>
                          <span className="text-white-50 small font-monospace">{student.progressPercentage || 0}%</span>
                        </div>
                      </td>
                      <td className="bg-transparent py-3 text-warning font-monospace fw-bold">
                        {student.aiScore || "N/A"}
                      </td>
                      <td className="bg-transparent py-3 text-center">
                        <Link to={`/dashboard/counselor/students/${student.studentId}`} className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-2">
                          <FaEye /> Xem hồ sơ
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Phân trang */}
          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="text-white-50 small">
                Hiển thị trang {pageNumber} trên tổng số {totalPages}
              </span>
              <div className="btn-group">
                <button 
                  className="btn btn-sm btn-outline-secondary text-white" 
                  disabled={pageNumber === 1} 
                  onClick={() => setPageNumber(prev => prev - 1)}
                >
                  Trước
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary text-white" 
                  disabled={pageNumber === totalPages} 
                  onClick={() => setPageNumber(prev => prev + 1)}
                >
                  Sau
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CounselorStudentList;