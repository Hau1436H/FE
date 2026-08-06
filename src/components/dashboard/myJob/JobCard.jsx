// src/components/dashboard/myJob/JobCard.jsx
import React, { useState } from "react";
import { BiMap } from "react-icons/bi";
import { FiBookmark } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa"; // Icon khi đã lưu
import axiosClient from "../../../api/axiosClient"; // Đảm bảo import axiosClient

function JobCard({ job }) {
  const locationText =
    job.tags?.find((t) => t.includes("📍"))?.replace("📍 ", "") || "Toàn quốc";

  // 1. Thêm State để quản lý việc Lưu Job
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Hàm xử lý khi bấm nút Lưu
  const handleSaveJob = async () => {
    try {
      setIsLoading(true);
      setIsSaved(!isSaved); // Tạm thời đổi màu nút cho mượt

      // GỌI API THẬT XUỐNG BACKEND ĐỂ LƯU VÀO DATABASE
      await axiosClient.post(`/api/v1/jobs/${job.id}/save`);
    } catch (error) {
      console.error("Lỗi khi lưu việc làm:", error);
      // Nếu Backend báo lỗi (ví dụ rớt mạng), phải trả lại màu cũ cho nút
      setIsSaved(isSaved);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="card h-100 text-white rounded-4 border-0 p-4"
      style={{ backgroundColor: "#131520" }}
    >
      {/* Phần Đầu Card: Ảnh Logo URL, Tiêu đề & Match Score */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex gap-3">
          {job.companyLogo && (
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="rounded-3 object-cover shadow-sm"
              style={{ width: "56px", height: "56px", objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          )}

          {/* Khối chữ cái đầu */}
          <div
            className="rounded-3 align-items-center justify-content-center fw-bold text-white shadow-sm"
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#2d3142",
              fontSize: "14px",
              display: job.companyLogo ? "none" : "flex",
            }}
          >
            {job.companyName?.charAt(0) || "C"}
          </div>

          <div>
            <h6
              className="fw-bold text-white mb-1 fs-6"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {job.title}
            </h6>
            <span
              className="text-white-50 extra-small d-block"
              style={{ fontSize: "12px" }}
            >
              {job.companyName}
            </span>
          </div>
        </div>

        {/* Vòng tròn Match % góc phải */}
        <div className="text-end">
          <div
            className="rounded-circle d-flex flex-column align-items-center justify-content-center text-success border border-success border-opacity-25"
            style={{
              width: "54px",
              height: "54px",
              backgroundColor: "rgba(16, 185, 129, 0.05)",
              lineHeight: "1.1",
            }}
          >
            <span className="fw-bold" style={{ fontSize: "14px" }}>
              {job.match}%
            </span>
            <span
              className="text-success opacity-75"
              style={{ fontSize: "9px" }}
            >
              match
            </span>
          </div>
        </div>
      </div>

      {/* Thông tin Job cơ bản */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <span
          className="badge bg-secondary bg-opacity-20 text-white-50 fw-normal px-2.5 py-1.5 rounded-2"
          style={{ fontSize: "12px" }}
        >
          🗄️ {job.type || "Toàn thời gian"}
        </span>
        <span
          className="badge bg-secondary bg-opacity-20 text-white-50 fw-normal px-2.5 py-1.5 rounded-2"
          style={{ fontSize: "12px" }}
        >
          {job.level || "Middle"}
        </span>
        <span
          className="badge bg-secondary bg-opacity-20 text-white-50 fw-normal px-2.5 py-1.5 rounded-2 d-flex align-items-center gap-1"
          style={{ fontSize: "12px" }}
        >
          <BiMap size={14} /> {locationText}
        </span>
      </div>

      <div
        className="text-success fw-bold mb-3 d-flex align-items-center gap-1.5"
        style={{ fontSize: "18px" }}
      >
        Cast: {job.salary || "Thỏa thuận"}{" "}
        <span className="text-white-50 fw-normal" style={{ fontSize: "13px" }}>
          /tháng (gross)
        </span>
      </div>

      <p
        className="text-white-50 mb-4"
        style={{
          fontSize: "13px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "38px",
          lineHeight: "1.5",
        }}
      >
        {job.description ||
          "Tham gia thiết kế, phát triển và tối ưu hệ thống dựa trên yêu cầu dự án thực tế."}
      </p>

      {/* Kỹ năng phù hợp */}
      <div className="mb-3">
        <div
          className="text-white-50 extra-small mb-2"
          style={{ fontSize: "12px" }}
        >
          Kỹ năng phù hợp
        </div>
        <div className="d-flex flex-wrap gap-2">
          {job.matchedSkills?.length > 0 ? (
            job.matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="badge bg-success bg-opacity-10 text-white-50 border border-success border-opacity-20 px-2.5 py-1.5 rounded-pill fw-medium"
                style={{ fontSize: "12px" }}
              >
                ✓ {skill}
              </span>
            ))
          ) : (
            <span className="text-white-50" style={{ fontSize: "12px" }}>
              Chưa có kỹ năng phù hợp
            </span>
          )}
        </div>
      </div>

      {/* Cần học thêm */}
      {job.missingSkills?.length > 0 && (
        <div className="mb-3">
          <div
            className="text-white-50 extra-small mb-2"
            style={{ fontSize: "12px" }}
          >
            Cần học thêm
          </div>
          <div className="d-flex flex-wrap gap-2">
            {job.missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="badge bg-danger bg-opacity-10 text-white-50 border border-danger border-opacity-20 px-2.5 py-1.5 rounded-pill fw-medium"
                style={{ fontSize: "12px" }}
              >
                - {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 mb-4 mt-auto">
        {["Đào tạo nội bộ", "Lộ trình thăng tiến rõ ràng", "ESOP"].map(
          (benefit, idx) => (
            <span
              key={idx}
              className="text-white-50 extra-small bg-secondary bg-opacity-10 px-2 py-1 rounded-2"
              style={{ fontSize: "11px" }}
            >
              {benefit}
            </span>
          ),
        )}
        <span
          className="text-white-50 extra-small py-1"
          style={{ fontSize: "11px" }}
        >
          +1 khác
        </span>
      </div>

      <div className="pt-3 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
        <span
          className="text-white-50 extra-small"
          style={{ fontSize: "12px" }}
        >
          Nguồn: {job.source || "Hệ thống"}
        </span>

        <div className="d-flex gap-2">
          {/* NÚT LƯU ĐÃ ĐƯỢC GẮN SỰ KIỆN Ở ĐÂY */}
          <button
            onClick={handleSaveJob}
            disabled={isLoading}
            className={`btn p-2 d-flex align-items-center justify-content-center rounded-3 border transition-all ${isSaved ? "border-warning text-warning" : "border-secondary border-opacity-20 text-white-50"}`}
            style={{
              width: "38px",
              height: "38px",
              backgroundColor: isSaved
                ? "rgba(255, 193, 7, 0.1)"
                : "transparent",
            }}
          >
            {isSaved ? <FaBookmark size={18} /> : <FiBookmark size={18} />}
          </button>

          <button
            className="btn px-3 py-2 fw-medium rounded-3 text-white d-flex align-items-center gap-2 transition-all"
            style={{
              backgroundColor: "#1c1e2d",
              border: "1px solid #2d3142",
              fontSize: "13.5px",
            }}
          >
            Ứng tuyển ngay →
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
