import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import Sidebar from "../../../components/dashboard/Sidebar"; 
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import { FaExternalLinkAlt, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function MentorFeedbackHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Gọi API lấy lịch sử nhận xét của Mentor đang đăng nhập
        const response = await axiosClient.get("/api/mentors/history");
        setHistory(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử nhận xét:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Xử lý parse ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "100vh", backgroundColor: "#0a0a14" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ backgroundColor: "#0a0a14", minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ overflowY: "auto", height: "100vh" }}>
        <DashboardHeader />
        
        <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
          <h2 className="fw-bold mb-0 text-white">Lịch sử nhận xét</h2>
          <span className="badge bg-success fs-6">Đã duyệt {history.length} hồ sơ</span>
        </div>

        <div className="card border-0 shadow-sm" style={{ backgroundColor: "#111122" }}>
          <div className="card-body p-0">
            {history.length === 0 ? (
              <div className="text-center p-5">
                <p className="text-white-50 fs-5 mb-0">Bạn chưa có nhận xét nào trên hệ thống.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0" style={{ backgroundColor: "transparent" }}>
                  <thead style={{ borderBottom: "2px solid #22223b" }}>
                    <tr>
                      <th className="px-4 py-3 text-white-50 font-weight-normal">Thời gian</th>
                      <th className="px-4 py-3 text-white-50 font-weight-normal">Sinh viên</th>
                      <th className="px-4 py-3 text-white-50 font-weight-normal" style={{ width: "45%" }}>Nội dung nhận xét</th>
                      <th className="px-4 py-3 text-white-50 font-weight-normal text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => {
                      // Bóc tách slug từ URL để tạo link nội bộ
                      let localPath = "#";
                      if (item.shareableUrl) {
                        if (item.shareableUrl.includes("/p/")) {
                          localPath = `/p/${item.shareableUrl.split("/p/")[1]}`;
                        } else {
                          localPath = `/p/${item.shareableUrl}`;
                        }
                      }

                      return (
                        <tr key={item.sessionId} style={{ borderBottom: "1px solid #1e1e2f" }}>
                          <td className="px-4 py-3 align-middle text-light">
                            <FaCalendarAlt className="me-2 text-primary" />
                            {formatDate(item.scheduledAt)}
                          </td>
                          <td className="px-4 py-3 align-middle fw-bold text-info">
                            {item.studentName}
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <p className="text-white-50 mb-0" style={{ fontSize: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {item.reviewNotes}
                            </p>
                          </td>
                          <td className="px-4 py-3 align-middle text-end">
                            <Link 
                              to={localPath}
                              target="_blank"
                              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2"
                            >
                              <FaExternalLinkAlt size={12} /> Xem Portfolio
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorFeedbackHistory;