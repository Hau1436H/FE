// src/pages/dashboard/AdminEditResource.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/dashboard/Sidebar';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import axiosClient from '../../../api/axiosClient';

const EMPTY_FORM = {
  nodeId: '',
  title: '',
  url: '',
  resourceType: 'course',
  provider: '',
  difficultyLevel: 'Beginner',
};

// Map cứng các tuỳ chọn khớp với DB
const RESOURCE_TYPES = ['course', 'video', 'docs', 'tutorial', 'tool', 'Official Docs'];
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

function AdminEditResource() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [skillNodes, setSkillNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Tải danh sách Skill Nodes và Dữ liệu Tài nguyên hiện tại
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        // Chạy song song 2 API để tiết kiệm thời gian chờ
        const [nodesResponse, resourceResponse] = await Promise.all([
          axiosClient.get('/api/admin/content/skill-nodes'),
          axiosClient.get(`/api/admin/content/learning-resources/${id}`)
        ]);

        // Set danh sách dropdown
        setSkillNodes(nodesResponse.data?.data || []);

        // Lấy dữ liệu resource hiện tại
        const resource = resourceResponse.data?.data;
        if (!resource) {
          throw new Error('Không tìm thấy dữ liệu tài nguyên.');
        }

        // Đổ dữ liệu vào form
        setFormData({
          nodeId: resource.skillNodeId || '',
          title: resource.title || '',
          url: resource.url || '',
          resourceType: resource.resourceType || 'course',
          provider: resource.provider || '',
          difficultyLevel: resource.difficultyLevel || 'Beginner',
        });
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        setLoadError(
          error.response?.data?.message ||
          error.message ||
          'Không thể tải dữ liệu. Vui lòng quay lại danh sách và thử lại.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

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

    const payload = {
      nodeId: Number(formData.nodeId),
      title: formData.title,
      url: formData.url,
      resourceType: formData.resourceType,
      provider: formData.provider,
      difficultyLevel: formData.difficultyLevel,
    };

    try {
      // Gọi API Update (PUT)
      const response = await axiosClient.put(`/api/admin/content/learning-resources/${id}`, payload);
      setFeedback({
        type: 'success',
        message: response.data?.message || 'Đã cập nhật tài nguyên thành công.',
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật tài nguyên:', error);
      setFeedback({
        type: 'error',
        message:
          error.response?.data?.message ||
          error.message ||
          'Không thể cập nhật tài nguyên. Vui lòng thử lại sau.',
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
          <div className="mb-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bold text-white mb-1">Cập nhật tài nguyên học tập</h4>
              <p className="text-white-50 mb-0">Chỉnh sửa liên kết và thông tin của tài liệu.</p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light px-3"
              onClick={() => navigate('/dashboard/admin/management')} // Sửa lại URL quản lý tùy dự án
            >
              ← Quay lại danh sách
            </button>
          </div>

          <div className="p-4 rounded-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="text-white-50 mt-3 small mb-0">Đang tải dữ liệu...</p>
              </div>
            ) : loadError ? (
              <div className="alert alert-danger py-3">{loadError}</div>
            ) : (
              <form onSubmit={handleSubmit}>
                {feedback && (
                  <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'} py-2`}>
                    {feedback.message}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">Gắn vào Kỹ năng (Node)</label>
                    <select
                      name="nodeId"
                      value={formData.nodeId}
                      onChange={handleChange}
                      className="form-select bg-dark text-white border-secondary"
                      required
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
                      placeholder="VD: C# Full Course"
                      required
                    />
                  </div>

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
                      placeholder="VD: YouTube, MDN..."
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

                <div className="mt-4 d-flex flex-column flex-sm-row gap-3 align-items-start">
                  <button type="submit" className="btn btn-success px-4 py-2 fw-semibold" disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light px-4 py-2"
                    onClick={() => navigate('/dashboard/admin/management')}
                    disabled={saving}
                  >
                    Hủy bỏ
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