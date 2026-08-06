import React, { useState, useEffect } from "react";
import CounselorChatBox from "./CounselorChatBox";
// QUAN TRỌNG: Đã thêm dòng import axiosClient bị thiếu ở đây!
import axiosClient from "../../api/axiosClient";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/DashboardHeader";
import { FaComments, FaSpinner } from "react-icons/fa";

// Hàm giải mã Token để lấy chuẩn ID Sinh viên
function decodeToken(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn("Không thể giải mã token:", e);
    return null;
  }
}

const CounselorChatPage = () => {
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [assignedCounselorId, setAssignedCounselorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // 1. Lấy ID sinh viên khi load trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = decodeToken(token);

    // Trích xuất ID từ Token
    const studentId =
      payload?.sub ||
      payload?.nameid ||
      payload?.userId ||
      localStorage.getItem("userId");
    setCurrentStudentId(studentId);
  }, []);

  // 2. Gọi API tìm xem Cố vấn của sinh viên này là ai
  useEffect(() => {
    const fetchMyCounselor = async () => {
      if (!currentStudentId) return;

      try {
        setIsLoading(true);
        // GỌI XUỐNG BACKEND ĐỂ TÌM CỐ VẤN
        const res = await axiosClient.get(`/api/Profile/my-counselor`);

        const counselorId =
          res.data?.data?.counselorId || res.data?.counselorId;

        if (counselorId) {
          setAssignedCounselorId(counselorId);
        } else {
          setErrorMsg("Bạn chưa được phân công cho Cố vấn học tập nào.");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin cố vấn", error);
        setErrorMsg(
          "Không thể kết nối đến máy chủ để tìm cố vấn của bạn. Vui lòng thử lại sau.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCounselor();
  }, [currentStudentId]);

  return (
    <div
      className="d-flex"
      style={{
        backgroundColor: "#0a0a14",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div
        className="flex-grow-1 d-flex flex-column text-white"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <DashboardHeader />

        <div className="container-fluid py-4 flex-grow-1 overflow-auto">
          <h3
            className="fw-bold mb-4 d-flex align-items-center gap-2"
            style={{ color: "#06b6d4" }}
          >
            <FaComments /> Trò chuyện cùng Cố vấn Học tập
          </h3>

          <div className="row justify-content-center h-100">
            <div className="col-lg-10 col-xl-8 h-100 pb-4">
              {isLoading ? (
                <div className="text-center py-5 mt-5">
                  <FaSpinner className="fa-spin fs-1 text-info mb-3" />
                  <p className="text-white-50">
                    Đang tìm kiếm cố vấn của bạn...
                  </p>
                </div>
              ) : errorMsg ? (
                <div className="alert alert-warning bg-dark border-warning text-warning text-center p-5 rounded-4 shadow-sm mt-5">
                  <i className="bi bi-exclamation-triangle fs-1 d-block mb-3"></i>
                  <h5>{errorMsg}</h5>
                  <p className="mb-0 text-white-50">
                    Vui lòng liên hệ với ban quản trị để được hỗ trợ phân công
                    cố vấn.
                  </p>
                </div>
              ) : assignedCounselorId && currentStudentId ? (
                <div
                  className="shadow-lg rounded-4 overflow-hidden h-100"
                  style={{
                    border: "1px solid rgba(148, 163, 184, 0.15)",
                    minHeight: "500px",
                  }}
                >
                  <CounselorChatBox
                    studentId={currentStudentId}
                    counselorId={assignedCounselorId}
                    currentUserId={currentStudentId}
                    isStudent={true}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorChatPage;
