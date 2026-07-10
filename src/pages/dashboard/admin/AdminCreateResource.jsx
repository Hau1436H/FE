// src/pages/dashboard/AdminCreateResource.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import axiosClient from '../../../api/axiosClient';

const INITIAL_FORM = {
  nodeId: '',
  title: '',
  url: '',
  resourceType: 'course',
  provider: '',
  difficultyLevel: 'Beginner',
};

// Map cứng các tuỳ chọn dựa trên data thực tế từ DB của bạn
const RESOURCE_TYPES = ['course', 'video', 'docs', 'tutorial', 'tool', 'Official Docs'];
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

function AdminCreateResource() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [skillNodes, setSkillNodes] = useState([]);
  const [loadingNodes, setLoadingNodes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Lấy danh sách Skill Nodes để map vào Dropdown
  useEffect(() => {
    const fetchNodes = async () => {
      setLoadingNodes(true);
      try {
        const response = await axiosClient.get('/api/admin/content/skill-nodes');
        // Giả sử API trả về { message: "...", data: [...] }
        setSkillNodes(response.data?.data || []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách Skill Node:', error);
      } finally {
        setLoadingNodes(false);
      }
    };
    fetchNodes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setSaving(true);

    // Payload khớp hoàn toàn với CreateUpdateLearningResourceDto ở BE
    const payload = {
      nodeId: Number(formData.nodeId),
      title: formData.title,
      url: formData.url,
      resourceType: formData.resourceType,
      provider: formData.provider,
      difficultyLevel: formData.difficultyLevel,
    };

    try {
      // Gọi thẳng vào endpoint quản lý Content của Admin
      const response = await axiosClient.post('/api/admin/content/learning-resources', payload);
      setFeedback({
        type: 'success',
        message: response.data?.message || 'Thêm tài nguyên học tập thành công.',
      });
      setFormData(INITIAL_FORM); // Reset form
    } catch (error) {
      console.error('Lỗi khi tạo resource:', error);
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Không thể tạo tài nguyên. Vui lòng thử lại.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#07090f' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />

        <div className="container-fluid px-0" style={{ maxWidth: '1100px' }}>
          <div className="mb-4">
            <h4 className="fw-bold text-white mb-1">Thêm Tài Nguyên Học Tập</h4>
            <p className="text-white-50 mb-0">Gắn link khóa học, video hoặc tài liệu vào kỹ năng (Skill Node).</p>
          </div>

          <div className="p-4 rounded-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
            <form onSubmit={handleSubmit}>
              {feedback && (
                <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'} py-2`}>
                  {feedback.message}
                </div>
              )}

              <div className="row g-3">
                {/* Dòng 1: Chọn Kỹ Năng & Tiêu Đề */}
                <div className="col-12 col-md-6">
                  <label className="form-label text-white fw-semibold">Gắn vào Kỹ năng (Node)</label>
                  <select
                    name="nodeId"
                    value={formData.nodeId}
                    onChange={handleChange}
                    className="form-select bg-dark text-white border-secondary"
                    required
                    disabled={loadingNodes}
                  >
                    <option value="" disabled>-- Chọn kỹ năng --</option>
                    {skillNodes.map((node) => (
                      <option key={node.skillNodeId} value={node.skillNodeId}>
                         {node.nodeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-white fw-semibold">Tiêu đề tài liệu</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="VD: C# Full Course for Beginners"
                    required
                  />
                </div>

                {/* Dòng 2: URL */}
                <div className="col-12">
                  <label className="form-label text-white fw-semibold">Đường dẫn (URL)</label>
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

                {/* Dòng 3: Loại tài nguyên, Nguồn, Độ khó */}
                <div className="col-12 col-md-4">
                  <label className="form-label text-white fw-semibold">Loại tài nguyên</label>
                  <select
                    name="resourceType"
                    value={formData.resourceType}
                    onChange={handleChange}
                    className="form-select bg-dark text-white border-secondary"
                  >
                    {RESOURCE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label text-white fw-semibold">Nguồn (Provider)</label>
                  <input
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="VD: YouTube, MDN, Udemy..."
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label text-white fw-semibold">Độ khó</label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleChange}
                    className="form-select bg-dark text-white border-secondary"
                  >
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 d-flex gap-3">
                <button type="submit" className="btn btn-success px-4 py-2 fw-semibold" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu tài nguyên'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light px-4 py-2"
                  onClick={() => setFormData(INITIAL_FORM)}
                >
                  Xóa form
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