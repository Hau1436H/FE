import React, { useState, useEffect } from "react";
import {
  FiCpu,
  FiMessageSquare,
  FiDollarSign,
  FiActivity,
  FiEye,
  FiX,
} from "react-icons/fi";
import axiosClient from "../../../api/axiosClient";
function AdminAILogs() {
  const [data, setData] = useState({ stats: {}, chatLogs: [] });
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null); // Lưu trữ chat đang được xem

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/admin/monitor/ai-logs");
      setData(res.data);
    } catch (error) {
      // <-- Chỉ để chữ catch (error) { ở đây thôi
      console.error("Lỗi lấy dữ liệu AI Logs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white-50 mt-5">
        <span className="spinner-border spinner-border-sm me-2"></span>Đang tải
        dữ liệu AI...
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#0a0a0f", minHeight: "100vh", color: "#fff" }}
    >
      <div className="mb-4">
        <h4 className="fw-bold d-flex align-items-center gap-2">
          <FiCpu className="text-info" /> Giám sát Hệ thống Trí tuệ Nhân tạo (AI
          Core)
        </h4>
        <p className="text-white-50 small">
          Theo dõi chi phí Token và kiểm soát chất lượng phản hồi của AI Virtual
          Mentor.
        </p>
      </div>

      {/* THỐNG KÊ (STATS) */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card bg-dark border-secondary border-opacity-25 shadow-sm p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 small mb-1">Tổng số Request API</p>
                <h3 className="mb-0 fw-bold">{data.stats?.totalRequests}</h3>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                <FiActivity size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark border-secondary border-opacity-25 shadow-sm p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 small mb-1">Tổng Token tiêu thụ</p>
                <h3 className="mb-0 fw-bold text-warning">
                  {data.stats?.totalTokensUsed?.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle">
                <FiMessageSquare size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark border-secondary border-opacity-25 shadow-sm p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 small mb-1">
                  Chi phí ước tính (USD)
                </p>
                <h3 className="mb-0 fw-bold text-success">
                  ${data.stats?.estimatedCostUsd}
                </h3>
              </div>
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle">
                <FiDollarSign size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BẢNG LỊCH SỬ CHAT */}
      <div className="card bg-dark border-secondary border-opacity-25 shadow-sm">
        <div className="card-header bg-transparent border-secondary border-opacity-25 py-3">
          <h6 className="mb-0 fw-bold">Lịch sử tương tác AI gần đây</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0 align-middle">
              <thead className="table-active text-white-50 small">
                <tr>
                  <th className="ps-4">Sinh viên</th>
                  <th>Câu hỏi (Prompt)</th>
                  <th>Model AI</th>
                  <th>Tokens</th>
                  <th>Thời gian</th>
                  <th className="text-end pe-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.chatLogs?.map((log, index) => (
                  <tr key={index}>
                    <td className="ps-4">
                      <div className="fw-semibold">{log.studentName}</div>
                      <div className="text-white-50 small">
                        {log.studentEmail}
                      </div>
                    </td>
                    <td style={{ maxWidth: "300px" }}>
                      {/* Cắt ngắn chữ nếu câu hỏi quá dài */}
                      <span className="d-inline-block text-truncate w-100">
                        {log.userPrompt}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{log.aiModel}</span>
                    </td>
                    <td className="text-warning font-monospace small">
                      {log.tokensUsed}
                    </td>
                    <td className="text-white-50 small">
                      {new Date(log.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setSelectedChat(log)}
                      >
                        <FiEye className="me-1" /> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL HIỂN THỊ ĐOẠN CHAT CHI TIẾT (Chỉ hiện khi bấm nút) */}
      {selectedChat && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            onClick={() => setSelectedChat(null)}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content bg-dark border-secondary text-light">
                <div className="modal-header border-secondary border-opacity-25">
                  <h5 className="modal-title fs-6">
                    Chi tiết phiên Chat -{" "}
                    <span className="text-info">
                      {selectedChat.studentName}
                    </span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedChat(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  {/* Bong bóng chat của Sinh viên */}
                  <div className="mb-4">
                    <div className="text-white-50 small mb-1">
                      User Prompt (Sinh viên hỏi):
                    </div>
                    <div
                      className="p-3 rounded-3"
                      style={{
                        backgroundColor: "#1e2235",
                        borderLeft: "4px solid #0dcaf0",
                      }}
                    >
                      {selectedChat.userPrompt}
                    </div>
                  </div>

                  {/* Bong bóng chat của AI */}
                  <div>
                    <div className="text-white-50 small mb-1">
                      AI Virtual Mentor trả lời ({selectedChat.tokensUsed}{" "}
                      tokens):
                    </div>
                    <div
                      className="p-3 rounded-3 text-white"
                      style={{
                        backgroundColor: "#131520",
                        borderLeft: "4px solid #ffc107",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {selectedChat.aiResponse}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedChat(null)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminAILogs;
