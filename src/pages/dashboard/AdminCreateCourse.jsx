import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import axiosClient from '../../api/axiosClient';
import {
  COURSE_FORM_DEFAULTS,
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  COURSE_TYPES,
} from '../../data/adminCreateCourseData';

const INITIAL_FORM = COURSE_FORM_DEFAULTS;

function AdminCreateCourse() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

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
      price: formData.price ? Number(formData.price) : undefined,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      imgBg: formData.imgBg,
      isPublished: formData.isPublished,
    };

    try {
      const response = await axiosClient.post('/api/courses', payload);
      setFeedback({
        type: 'success',
        message: response.data?.message || 'Khoá học đã được gửi lên hệ thống thành công.',
      });
      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error('Lỗi khi tạo khoá học:', error);
      setFeedback({
        type: 'error',
        message:
          error.response?.data?.message ||
          error.message ||
          'Không thể tạo khoá học. Vui lòng thử lại sau.',
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
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
              <div>
                <h4 className="fw-bold text-white mb-1">Tạo khoá học mới</h4>
                <p className="text-white-50 mb-0">Nhập thông tin khoá học để đăng lên hệ thống.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
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
                      <option key={category} value={category}>
                        {category}
                      </option>
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
                      <option key={level} value={level}>
                        {level}
                      </option>
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
                      <option key={type} value={type}>
                        {type}
                      </option>
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

                <div className="col-12">
                  <div className="form-check form-switch text-white">
                    <input
                      name="isPublished"
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      id="publishSwitch"
                    />
                    <label className="form-check-label" htmlFor="publishSwitch">
                      Công khai ngay khi lưu
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 d-flex flex-column flex-sm-row gap-3 align-items-start">
                <button type="submit" className="btn btn-success px-4 py-2 fw-semibold" disabled={saving}>
                  {saving ? 'Đang gửi...' : 'Lưu khoá học'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light px-4 py-2"
                  onClick={() => {
                    setFormData(INITIAL_FORM);
                    setFeedback(null);
                  }}
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

export default AdminCreateCourse;
