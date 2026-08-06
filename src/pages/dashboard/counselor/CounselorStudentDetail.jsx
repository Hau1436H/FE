import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
// Đảm bảo dòng import này trỏ ra ngoài thư mục components/chat/
import CounselorChatBox from "../../../components/chat/CounselorChatBox";
function decodeToken(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      ),
    );
  } catch (e) {
    return null;
  }
}

function CounselorStudentDetail() {
  // Lấy studentId từ URL (được định nghĩa trong App.jsx)
  const { studentId } = useParams();
  const [counselorUserId, setCounselorUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = decodeToken(token);
    // Trích xuất UserId của ông Cố vấn đang đăng nhập
    const userId =
      payload?.sub ||
      payload?.nameid ||
      payload?.userId ||
      localStorage.getItem("userId");
    setCounselorUserId(userId);
  }, []);

  return (
    <div
      className="d-flex"
      style={{ backgroundColor: "#0a0a14", minHeight: "100vh" }}
    >
      <Sidebar />
      <div
        className="flex-grow-1 d-flex flex-column text-white"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <DashboardHeader />

        <div className="container-fluid py-4 flex-grow-1 overflow-auto">
          <h3 className="fw-bold mb-4 text-info">
            Chi tiết & Hỗ trợ Sinh viên
          </h3>

          <div className="row h-100">
            {/* Nếu bạn có Component Hiển thị Profile Sinh Viên thì nhét vào col-lg-5 ở đây */}
            <div className="col-lg-5 mb-4">
              <div className="card bg-dark border-secondary p-4 h-100 text-white-50">
                Khu vực hiển thị thông tin học tập, lộ trình của sinh viên
                (SkillGapReport, Portfolio...)
              </div>
            </div>

            {/* KHU VỰC KHUNG CHAT DÀNH CHO CỐ VẤN */}
            <div className="col-lg-7 mb-4">
              {counselorUserId && studentId ? (
                <div className="h-100 shadow-lg" style={{ minHeight: "500px" }}>
                  <CounselorChatBox
                    studentId={studentId}
                    counselorId={counselorUserId}
                    currentUserId={counselorUserId}
                    isStudent={false} // Báo cho Component biết người đang gõ là Cố vấn
                  />
                </div>
              ) : (
                <div className="text-center p-5 text-white-50 spinner-border"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CounselorStudentDetail;
