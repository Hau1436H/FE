import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaGithub, FaSpinner, FaCode, FaChartLine, FaRobot } from 'react-icons/fa';
import axiosClient from "../../../api/axiosClient";
import Sidebar from "../../../components/dashboard/Sidebar"; 
import DashboardHeader from "../../../components/dashboard/DashboardHeader";

function CounselorStudentDetail() {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        setLoading(true);
        // Gọi API Read-only dành cho Counselor
        const response = await axiosClient.get(`/api/counselors/students/${studentId}/portfolio`);
        setStudentData(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết sinh viên:", err);
        setError("Không thể tải thông tin sinh viên hoặc sinh viên chưa có E-Portfolio.");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentDetail();
    }
  }, [studentId]);

  return (
    <div className="d-flex" style={{ backgroundColor: "#0a0a14", minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 text-white" style={{ overflowY: "auto", height: "100vh" }}>
        <DashboardHeader />
        
        {/* Nút quay lại */}
        <div className="mb-4 mt-2">
          <Link to="/dashboard/counselor/students" className="btn btn-outline-secondary text-white border-secondary btn-sm d-inline-flex align-items-center gap-2">
            <FaArrowLeft /> Quay lại danh sách
          </Link>
        </div>

        {/* Xử lý trạng thái Loading & Lỗi */}
        {loading ? (
          <div className="text-center py-5">
            <FaSpinner className="fa-spin fs-1 text-primary mb-3" />
            <p className="text-white-50">Đang phân tích và tải hồ sơ sinh viên...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger bg-dark border-danger text-danger">
            {error}
          </div>
        ) : studentData ? (
          <div className="row g-4">
            {/* CỘT TRÁI: THÔNG TIN TỔNG QUAN */}
            <div className="col-lg-4">
              <div className="p-4 rounded-3 shadow-sm h-100" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-success text-dark d-flex justify-content-center align-items-center fw-bold mx-auto mb-3" style={{ width: "80px", height: "80px", fontSize: "32px" }}>
                    {studentData.studentName ? studentData.studentName.charAt(0).toUpperCase() : "S"}
                  </div>
                  <h4 className="fw-bold">{studentData.studentName}</h4>
                  <span className="badge bg-info text-dark font-monospace fs-6 mt-1">
                    {studentData.careerRecommendation?.recommendedRole || "Chưa có định hướng"}
                  </span>
                </div>

                <hr className="border-secondary" />

                <div className="mb-3">
                  <small className="text-white-50 d-block mb-1">Điểm đánh giá AI (AI Score)</small>
                  <div className="fs-3 fw-bold text-warning d-flex align-items-center gap-2">
                    <FaRobot /> {studentData.aiCareerScore || 0}/100
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-white-50 d-block mb-1">Tiến độ kỹ năng (Match Percentage)</small>
                  <div className="progress bg-dark mb-1" style={{ height: "10px" }}>
                    <div className="progress-bar bg-success" style={{ width: `${studentData.skillGapAnalysis?.matchPercentage || 0}%` }}></div>
                  </div>
                  <div className="text-end text-success small font-monospace">{studentData.skillGapAnalysis?.matchPercentage || 0}%</div>
                </div>

                <div className="mb-3">
                  <small className="text-white-50 d-block mb-1">Thống kê Github</small>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-center gap-2 mb-2"><FaGithub /> <strong>{studentData.githubStats?.totalRepositories || 0}</strong> Dự án</li>
                    <li className="d-flex align-items-center gap-2"><FaCode /> <strong>{studentData.githubStats?.totalLanguages || 0}</strong> Ngôn ngữ/Công nghệ</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: CHI TIẾT ĐÁNH GIÁ (READ ONLY) */}
            <div className="col-lg-8">
              {/* Summary */}
              <div className="p-4 rounded-3 shadow-sm mb-4" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                  <FaChartLine /> Đánh giá năng lực cốt lõi
                </h5>
                <p className="text-white-50" style={{ lineHeight: "1.8" }}>
                  {studentData.aiProfileSummary || "Hệ thống chưa có đủ dữ liệu để tạo tóm tắt năng lực cho sinh viên này."}
                </p>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <h6 className="text-success fw-bold">Điểm mạnh</h6>
                    <ul className="text-white-50 small">
                      {studentData.careerRecommendation?.strengths?.map((str, idx) => (
                        <li key={idx} className="mb-1">{str}</li>
                      )) || <li>Chưa có dữ liệu</li>}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-danger fw-bold">Cần cải thiện (Gaps)</h6>
                    <ul className="text-white-50 small">
                      {studentData.skillGapAnalysis?.missingSkills?.map((skill, idx) => (
                        <li key={idx} className="mb-1">{skill}</li>
                      )) || <li>Chưa có dữ liệu</li>}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Danh sách Repository */}
              <div className="p-4 rounded-3 shadow-sm" style={{ backgroundColor: "#111122", border: "1px solid #1e1e2f" }}>
                <h5 className="fw-bold mb-3 text-info">Dự án Github thực tế</h5>
                
                {studentData.repositories && studentData.repositories.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: "transparent" }}>
                      <thead>
                        <tr className="text-white-50 border-bottom border-secondary">
                          <th className="bg-transparent fw-normal py-2">Tên dự án</th>
                          <th className="bg-transparent fw-normal py-2">Công nghệ (Stack)</th>
                          <th className="bg-transparent fw-normal py-2 text-center">Độ khó</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentData.repositories.map((repo, idx) => (
                          <tr key={idx} className="border-bottom border-secondary border-opacity-25">
                            <td className="bg-transparent py-3 text-white">
                              <a href={repo.githubUrl} target="_blank" rel="noreferrer" className="text-decoration-none text-info fw-bold">
                                {repo.repoName}
                              </a>
                              {repo.isFeatured && <span className="badge bg-warning text-dark ms-2" style={{ fontSize: "0.6rem" }}>Nổi bật</span>}
                            </td>
                            <td className="bg-transparent py-3 text-white-50 small">
                              {repo.extractedTechStack}
                            </td>
                            <td className="bg-transparent py-3 text-center text-warning font-monospace">
                              {"★".repeat(repo.difficultyStars || 0)}{"☆".repeat(5 - (repo.difficultyStars || 0))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-white-50 border border-secondary border-opacity-25 rounded bg-dark">
                    Sinh viên chưa đồng bộ dự án Github nào.
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}

export default CounselorStudentDetail;