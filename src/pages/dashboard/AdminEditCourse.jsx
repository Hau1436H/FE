// src/pages/dashboard/AdminEditCourse.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { fetchCourseById, updateCourse } from '../../api/adminApi';
import {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  COURSE_TYPES,
} from '../../data/adminCreateCourseData';

const EMPTY_FORM = {
  title: '',
  description: '',
  instructor: '',
  category: 'Frontend',
  level: 'Intermediate',
  type: '📹 Video',
  duration: '',
  lessons: '',
  price: '',
  tags: '',
  imgBg: '',
  isPublished: false,
};

function AdminEditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // 1. Tải dữ liệu khóa học hiện tại để đổ vào form
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await fetchCourseById(id);
        const course = response.data?.data || response.data;

        if (!course) {
          throw new Error('Không tìm thấy dữ liệu khóa học.');
        }

        setFormData({
          title: course.title || '',
          description: course.description || '',
          instructor: course.instructor || '',
          category: course.category || 'Frontend',
          level: course.level || 'Intermediate',
          type: course.type || '📹 Video',
          duration: course.duration || '',
          lessons: course.lessons?.toString() || '',
          price: course.price?.toString() || '',
          tags: Array.isArray(course.tags) ? course.tags.join(', ') : (course.tags || ''),
          imgBg: course.imgBg || '',
          isPublished: !!course.isPublished,
        });
      } catch (error) {
        console.error('Lỗi tải dữ liệu khóa học:', error);
        setLoadError(
          error.response?.data?.message ||
          error.message ||
          'Không thể tải dữ liệu khóa học. Vui lòng quay lại danh sách và thử lại.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) loadCourse();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setSaving(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      instructor: formData.instructor,
      category: formData.category,
      level: formData.level,
      type: formData.type,
      duration: formData.duration,
      lessons: Number(formData.lessons) || 0,
      price: formData.price ? Number(formData.price) : null,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      imgBg: formData.imgBg,
      isPublished: formData.isPublished,
    };

    try {
      const response = await updateCourse(id, payload);
      setFeedback({
        type: 'success',
        message: response.data?.message || 'Đã cập nhật khóa học thành công.',
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật khóa học:', error);
      setFeedback({
        type: 'error',
        message:
          error.response?.data?.message ||
          error.message ||
          'Không thể cập nhật khóa học. Vui lòng thử lại sau.',
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
              <h4 className="fw-bold text-white mb-1">Cập nhật khóa học</h4>
              <p className="text-white-50 mb-0">Chỉnh sửa thông tin khóa học đã tồn tại trong hệ thống.</p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light px-3"
              onClick={() => navigate('/dashboard/admin/management')}
            >
              ← Quay lại danh sách
            </button>
          </div>

          <div className="p-4 rounded-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="text-white-50 mt-3 small mb-0">Đang tải dữ liệu khóa học...</p>
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
                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">Tiêu đề khoá học</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Nhập tên khoá học"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">Mô tả ngắn</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      rows={4}
                      placeholder="Giới thiệu nhanh về khoá học"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">Giảng viên</label>
                    <input
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Tên giảng viên"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">Danh mục</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-select bg-dark text-white border-secondary"
                    >
                      {COURSE_CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">Trình độ</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="form-select bg-dark text-white border-secondary"
                    >
                      {COURSE_LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">Loại khoá học</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="form-select bg-dark text-white border-secondary"
                    >
                      {COURSE_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">Thời lượng</label>
                    <input
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Ví dụ: 12h"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">Số bài học</label>
                    <input
                      name="lessons"
                      type="number"
                      min="1"
                      value={formData.lessons}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Nhập số bài học"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">Giá (VNĐ)</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Ví dụ: 299000"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-white fw-semibold">Ảnh đại diện (URL)</label>
                    <input
                      name="imgBg"
                      value={formData.imgBg}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">Thẻ & tags</label>
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="React, TypeScript, Frontend"
                    />
                    <div className="form-text text-white-50">Ngăn cách bằng dấu phẩy.</div>
                  </div>

                  {formData.imgBg && (
                    <div className="col-12">
                      <label className="form-label text-white fw-semibold">Xem trước ảnh</label>
                      <div
                        className="rounded-3 overflow-hidden"
                        style={{ width: '240px', height: '135px', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <img
                          src={formData.imgBg}
                          alt="Xem trước"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <div className="form-check form-switch text-white">
                      <input
                        name="isPublished"
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={handleChange}
                        id="publishSwitchEdit"
                      />
                      <label className="form-check-label" htmlFor="publishSwitchEdit">
                        Công khai khoá học
                      </label>
                    </div>
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

export default AdminEditCourse;