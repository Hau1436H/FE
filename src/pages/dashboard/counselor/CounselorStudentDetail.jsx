import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaGithub,
  FaSpinner,
  FaCode,
  FaChartLine,
  FaRobot,
  FaComments,
} from "react-icons/fa";
import axiosClient from "../../../api/axiosClient";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";

// Import ChatBox dùng chung
import CounselorChatBox from "../../../components/chat/CounselorChatBox";

function CounselorStudentDetail() {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy ID của Cố vấn đang đăng nhập từ LocalStorage (Có thể giải mã từ Token)
  const currentCounselorId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        setLoading(true);
        // Thay đường dẫn API này nếu C# Backend của bạn dùng route khác
        const response = await axiosClient.get(
          `/api/counselors/students/${studentId}/portfolio`,
        );
        // Gán thẳng vào response.data.data dựa theo Controller C# mình vừa tạo (Ok(new { data = data }))
        setStudentData(response.data?.data || response.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết sinh viên:", err);
        setError(
          "Không thể tải thông tin sinh viên hoặc sinh viên chưa có E-Portfolio.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentDetail();
    }
  }, [studentId]);

  return (
    <div
      className="d-flex"
      style={{ backgroundColor: "#0a0a14", minHeight: "100vh" }}
    >
      <Sidebar />
      <div
        className="flex-grow-1 p-4 text-white"
        style={{ overflowY: "auto", height: "100vh" }}
      >
        <DashboardHeader />

        {/* Nút quay lại */}
        <div className="mb-4 mt-2">
          <Link
            to="/dashboard/counselor/students"
            className="btn btn-outline-secondary text-white border-secondary btn-sm d-inline-flex align-items-center gap-2"
          >
            <FaArrowLeft /> Quay lại danh sách
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <FaSpinner className="fa-spin fs-1 text-info mb-3" />
            <p className="text-white-50">Đang nạp hồ sơ sinh viên...</p>
          </div>
        ) : error ? (
          <div className="alert alert-warning bg-dark border-warning text-warning">
            <i className="bi bi-exclamation-triangle me-2"></i> {error}
          </div>
        ) : studentData ? (
          <div className="row g-4">
            {/* CỘT TRÁI: THÔNG TIN TỔNG QUAN SINH VIÊN */}
            <div className="col-lg-5 col-xl-4">
              <div
                className="p-4 rounded-4 shadow-sm h-100"
                style={{
                  backgroundColor: "#111122",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle bg-info text-dark d-flex justify-content-center align-items-center fw-bold mx-auto mb-3"
                    style={{ width: "80px", height: "80px", fontSize: "32px" }}
                  >
                    {studentData.studentName
                      ? studentData.studentName.charAt(0).toUpperCase()
                      : "S"}
                  </div>
                  <h4 className="fw-bold">
                    {studentData.studentName || "Sinh viên"}
                  </h4>

                  <span className="badge bg-primary bg-opacity-25 text-info font-monospace fs-6 mt-1 border border-info border-opacity-25 p-2">
                    {studentData.careerRecommendation?.recommendedRole ||
                      studentData.skillGapAnalysis?.targetRole ||
                      "Backend Developer"}
                  </span>
                </div>

                <hr className="border-secondary opacity-25" />

                <div className="mb-3">
                  <small className="text-white-50 d-block mb-1">
                    Điểm đánh giá AI (AI Score)
                  </small>
                  <div className="fs-3 fw-bold text-warning d-flex align-items-center gap-2">
                    <FaRobot /> {studentData.aiCareerScore || 0}/100
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-white-50 d-block mb-1">
                    Mức độ đáp ứng (Match Score)
                  </small>
                  <div
                    className="progress bg-dark mb-1"
                    style={{ height: "8px" }}
                  >
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${studentData.roadmapProgress?.progressPercentage || studentData.skillGapAnalysis?.matchPercentage || 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-end text-success small font-monospace">
                    {studentData.roadmapProgress?.progressPercentage ||
                      studentData.skillGapAnalysis?.matchPercentage ||
                      0}
                    %
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-white-50 d-block mb-1">
                    Thống kê Github
                  </small>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-center gap-2 mb-2 text-white-50">
                      <FaGithub className="text-white" />{" "}
                      <strong>
                        {studentData.githubStats?.totalRepositories || 0}
                      </strong>{" "}
                      Dự án
                    </li>
                    <li className="d-flex align-items-center gap-2 text-white-50">
                      <FaCode className="text-white" />{" "}
                      <strong>
                        {studentData.githubStats?.totalLanguages || 0}
                      </strong>{" "}
                      Công nghệ
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: KHU VỰC ĐÁNH GIÁ & CHAT */}
            <div className="col-lg-7 col-xl-8 d-flex flex-column gap-4">
              {/* Đánh giá AI */}
              <div
                className="p-4 rounded-4 shadow-sm"
                style={{
                  backgroundColor: "#111122",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-info">
                  <FaChartLine /> Đánh giá năng lực cốt lõi
                </h5>
                <p
                  className="text-white-50 small"
                  style={{ lineHeight: "1.8", textAlign: "justify" }}
                >
                  {studentData.aiProfileSummary ||
                    "Hệ thống chưa có đủ dữ liệu để tạo tóm tắt năng lực cho sinh viên này."}
                </p>

                <div className="row mt-4">
                  <div className="col-md-6 border-end border-secondary border-opacity-25">
                    <h6 className="text-success fw-bold small text-uppercase letter-spacing-1">
                      Điểm mạnh
                    </h6>
                    <ul className="text-white-50 small ps-3 mb-0">
                      {studentData.careerRecommendation?.strengths?.map(
                        (str, idx) => (
                          <li key={idx} className="mb-1">
                            {str}
                          </li>
                        ),
                      ) || <li>Đang thu thập dữ liệu</li>}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-warning fw-bold small text-uppercase letter-spacing-1">
                      Cần cải thiện (Gaps)
                    </h6>
                    <ul className="text-white-50 small ps-3 mb-0">
                      {studentData.skillGapAnalysis?.missingSkills?.length >
                      0 ? (
                        studentData.skillGapAnalysis.missingSkills.map(
                          (skill, idx) => (
                            <li key={idx} className="mb-1">
                              {skill}
                            </li>
                          ),
                        )
                      ) : (
                        <li className="text-success">
                          Đã đáp ứng đủ yêu cầu kỹ năng
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* KHUNG CHAT VỚI SINH VIÊN */}
              <div
                className="flex-grow-1 rounded-4 shadow-sm overflow-hidden d-flex flex-column"
                style={{
                  backgroundColor: "#111122",
                  border: "1px solid rgba(255,255,255,0.05)",
                  minHeight: "450px",
                }}
              >
                <div className="p-3 bg-dark border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2">
                  <FaComments className="text-info fs-5" />
                  <h6 className="mb-0 fw-bold text-white">
                    Chat trực tiếp với Sinh viên
                  </h6>
                </div>

                <div className="flex-grow-1">
                  {studentId && currentCounselorId ? (
                    <CounselorChatBox
                      studentId={studentId}
                      counselorId={currentCounselorId}
                      currentUserId={currentCounselorId}
                      isStudent={false} // Khai báo đây là Cố vấn (Counselor)
                    />
                  ) : (
                    <div className="alert alert-warning m-4 bg-dark border-warning text-warning text-center">
                      Không thể tải khung chat. Vui lòng đăng nhập lại tài khoản
                      Cố vấn.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CounselorStudentDetail;
