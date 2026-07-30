// src/pages/dashboard/AdminCreateResource.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import axiosClient from "../../../api/axiosClient";

const INITIAL_FORM = {
  nodeId: "",
  title: "",
  url: "",
  resourceType: "course",
  provider: "",
  difficultyLevel: "Beginner",
};

const RESOURCE_TYPES = [
  "course",
  "video",
  "docs",
  "tutorial",
  "tool",
  "Official Docs",
];
const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
];

function AdminCreateResource() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);

  // States mới quản lý Roadmap & Nodes
  const [techPaths, setTechPaths] = useState([]);
  const [allSkillNodes, setAllSkillNodes] = useState([]);
  const [selectedPathId, setSelectedPathId] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Lấy cả danh sách Roadmaps và Nodes khi load trang
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pathsRes, nodesRes] = await Promise.all([
          axiosClient.get("/api/admin/content/tech-paths"),
          axiosClient.get("/api/admin/content/skill-nodes"),
        ]);
        setTechPaths(pathsRes.data?.data || []);
        setAllSkillNodes(nodesRes.data?.data || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu hệ thống:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc Skill Node dựa trên Roadmap đã chọn
  const filteredNodes = allSkillNodes.filter(
    (node) => node.techPathId === Number(selectedPathId),
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Hàm xử lý riêng khi đổi Roadmap
  const handlePathChange = (event) => {
    setSelectedPathId(event.target.value);
    // Xóa Skill Node đã chọn nếu người dùng đổi Roadmap khác
    setFormData((prev) => ({ ...prev, nodeId: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setSaving(true);

    const payload = {
      nodeId: Number(formData.nodeId),
      title: formData.title,
      url: formData.url,
      resourceType: formData.resourceType,
      provider: formData.provider,
      difficultyLevel: formData.difficultyLevel,
    };

    try {
      const response = await axiosClient.post(
        "/api/admin/content/learning-resources",
        payload,
      );
      setFeedback({
        type: "success",
        message: response.data?.message || "Thêm tài nguyên thành công.",
      });
      setFormData(INITIAL_FORM);
      setSelectedPathId(""); // Reset cả roadmap
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.response?.data?.message || "Không thể tạo tài nguyên.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="d-flex min-vh-100 w-100"
      style={{ backgroundColor: "#07090f" }}
    >
      <Sidebar />
      <div
        className="flex-grow-1 p-4 overflow-auto text-white"
        style={{ maxHeight: "100vh", minWidth: 0 }}
      >
        <DashboardHeader />

        <div className="container-fluid px-0" style={{ maxWidth: "1100px" }}>
          <div className="mb-4">
            <h4 className="fw-bold text-white mb-1">Thêm Tài Nguyên Học Tập</h4>
            <p className="text-white-50 mb-0">
              Chọn Lộ trình ➔ Chọn Kỹ năng ➔ Thêm liên kết tài liệu.
            </p>
          </div>

          <div
            className="p-4 rounded-4"
            style={{
              backgroundColor: "#09101c",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <form onSubmit={handleSubmit}>
              {feedback && (
                <div
                  className={`alert ${feedback.type === "success" ? "alert-success" : "alert-danger"} py-2`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="row g-3">
                {/* 1. CHỌN ROADMAP */}
                <div className="col-12 col-md-6">
                  <label className="form-label text-white fw-semibold">
                    1. Chọn Roadmap (Tech Path)
                  </label>
                  <select
                    value={selectedPathId}
                    onChange={handlePathChange}
                    className="form-select bg-dark text-white border-secondary"
                    required
                    disabled={loading}
                  >
                    <option value="" disabled>
                      -- Vui lòng chọn Roadmap --
                    </option>
                    {techPaths.map((path) => (
                      <option key={path.techPathId} value={path.techPathId}>
                        {path.pathName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. CHỌN SKILL NODE (Bị khóa nếu chưa chọn Roadmap) */}
                <div className="col-12 col-md-6">
                  <label className="form-label text-white fw-semibold">
                    2. Chọn Kỹ năng (Skill Node)
                  </label>
                  <select
                    name="nodeId"
                    value={formData.nodeId}
                    onChange={handleChange}
                    className="form-select bg-dark text-white border-secondary"
                    required
                    disabled={!selectedPathId || loading}
                  >
                    <option value="" disabled>
                      {!selectedPathId
                        ? "-- Hãy chọn Roadmap trước --"
                        : "-- Chọn kỹ năng --"}
                    </option>
                    {filteredNodes.map((node) => (
                      <option key={node.skillNodeId} value={node.skillNodeId}>
                        {node.nodeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-12">
                  <label className="form-label text-white fw-semibold">
                    Tiêu đề tài liệu
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="VD: C# Full Course for Beginners"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-white fw-semibold">
                    Đường dẫn (URL)
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label text-white fw-semibold">
                    Loại tài nguyên
                  </label>
                  <select
                    name="resourceType"
                    value={formData.resourceType}
                    onChange={handleChange}
                    className="form-select bg-dark text-white border-secondary"
                  >
                    {RESOURCE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label text-white fw-semibold">
                    Nguồn (Provider)
                  </label>
                  <input
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="VD: YouTube, Udemy..."
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label text-white fw-semibold">
                    Độ khó
                  </label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleChange}
                    className="form-select bg-dark text-white border-secondary"
                  >
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 d-flex gap-3">
                <button
                  type="submit"
                  className="btn btn-success px-4 py-2 fw-semibold"
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "Lưu tài nguyên"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light px-4 py-2"
                  onClick={() => navigate("/dashboard/admin/management")}
                >
                  Hủy / Quay lại
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateResource;
