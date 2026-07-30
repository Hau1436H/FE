// src/pages/dashboard/AdminEditResource.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/dashboard/Sidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import axiosClient from "../../../api/axiosClient";

const EMPTY_FORM = {
  nodeId: "",
  title: "",
  url: "",
  resourceType: "course",
  provider: "",
  difficultyLevel: "Beginner",
};

const RESOURCE_TYPES = ["course", "video", "docs", "tutorial", "tool", "Official Docs"];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

function AdminEditResource() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY_FORM);
  
  // UI States cho 2 cấp Dropdown
  const [techPaths, setTechPaths] = useState([]);
  const [allSkillNodes, setAllSkillNodes] = useState([]);
  const [selectedPathId, setSelectedPathId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Kéo đồng loạt Paths, Nodes và dữ liệu Resource
        const [pathsRes, nodesRes, resourceRes] = await Promise.all([
          axiosClient.get("/api/admin/content/tech-paths"),
          axiosClient.get("/api/admin/content/skill-nodes"),
          axiosClient.get(`/api/admin/content/learning-resources/${id}`),
        ]);

        setTechPaths(pathsRes.data?.data || []);
        const loadedNodes = nodesRes.data?.data || [];
        setAllSkillNodes(loadedNodes);

        const resource = resourceRes.data?.data;
        if (!resource) throw new Error("Không tìm thấy dữ liệu tài nguyên.");

        // Suy ngược lại Roadmap (TechPathId) từ SkillNodeId của resource hiện tại
        const matchingNode = loadedNodes.find(n => n.skillNodeId === resource.skillNodeId);
        if (matchingNode) {
            setSelectedPathId(matchingNode.techPathId.toString());
        }

        setFormData({
          nodeId: resource.skillNodeId || "",
          title: resource.title || "",
          url: resource.url || "",
          resourceType: resource.resourceType || "course",
          provider: resource.provider || "",
          difficultyLevel: resource.difficultyLevel || "Beginner",
        });
      } catch (error) {
        setLoadError(error.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Bộ lọc Node dựa trên Roadmap
  const filteredNodes = allSkillNodes.filter(node => node.techPathId === Number(selectedPathId));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePathChange = (event) => {
    setSelectedPathId(event.target.value);
    setFormData(prev => ({ ...prev, nodeId: "" })); // Reset Node nếu đổi Roadmap
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      nodeId: Number(formData.nodeId),
      title: formData.title,
      url: formData.url,
      resourceType: formData.resourceType,
      provider: formData.provider,
      difficultyLevel: formData.difficultyLevel,
    };

    try {
      const response = await axiosClient.put(`/api/admin/content/learning-resources/${id}`, payload);
      setFeedback({ type: "success", message: response.data?.message || "Đã cập nhật tài nguyên thành công." });
    } catch (error) {
      setFeedback({ type: "error", message: error.response?.data?.message || "Không thể cập nhật." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: "#07090f" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: "100vh", minWidth: 0 }}>
        <DashboardHeader />

        <div className="container-fluid px-0" style={{ maxWidth: "1100px" }}>
          <div className="mb-4 d-flex justify-content-between">
            <div>
              <h4 className="fw-bold text-white mb-1">Cập nhật tài nguyên</h4>
              <p className="text-white-50 mb-0">Chỉnh sửa liên kết và thông tin của tài liệu.</p>
            </div>
            <button className="btn btn-outline-light px-3" onClick={() => navigate("/dashboard/admin/management")}>
              ← Quay lại
            </button>
          </div>

          <div className="p-4 rounded-4" style={{ backgroundColor: "#09101c", border: "1px solid rgba(255,255,255,0.08)" }}>
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
            ) : loadError ? (
              <div className="alert alert-danger">{loadError}</div>
            ) : (
              <form onSubmit={handleSubmit}>
                {feedback && <div className={`alert ${feedback.type === "success" ? "alert-success" : "alert-danger"}`}>{feedback.message}</div>}

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">1. Chọn Roadmap (Tech Path)</label>
                    <select value={selectedPathId} onChange={handlePathChange} className="form-select bg-dark text-white border-secondary" required>
                      <option value="" disabled>-- Vui lòng chọn Roadmap --</option>
                      {techPaths.map(path => <option key={path.techPathId} value={path.techPathId}>{path.pathName}</option>)}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">2. Chọn Kỹ năng (Skill Node)</label>
                    <select name="nodeId" value={formData.nodeId} onChange={handleChange} className="form-select bg-dark text-white border-secondary" required disabled={!selectedPathId}>
                      <option value="" disabled>{!selectedPathId ? "-- Hãy chọn Roadmap trước --" : "-- Chọn kỹ năng --"}</option>
                      {filteredNodes.map(node => <option key={node.skillNodeId} value={node.skillNodeId}>{node.nodeName}</option>)}
                    </select>
                  </div>

                  {/* Các trường còn lại tương tự Create */}
                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">Tiêu đề tài liệu</label>
                    <input name="title" value={formData.title} onChange={handleChange} className="form-control bg-dark text-white border-secondary" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">Đường dẫn (URL)</label>
                    <input type="url" name="url" value={formData.url} onChange={handleChange} className="form-control bg-dark text-white border-secondary" required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label text-white fw-semibold">Loại tài nguyên</label>
                    <select name="resourceType" value={formData.resourceType} onChange={handleChange} className="form-select bg-dark text-white border-secondary">
                      {RESOURCE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label text-white fw-semibold">Nguồn (Provider)</label>
                    <input name="provider" value={formData.provider} onChange={handleChange} className="form-control bg-dark text-white border-secondary" />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label text-white fw-semibold">Độ khó</label>
                    <select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleChange} className="form-select bg-dark text-white border-secondary">
                      {DIFFICULTY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-success px-4 py-2 me-3" disabled={saving}>
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEditResource;