
import axiosClient from './axiosClient';

// ====== COURSES ======
export const fetchCourses = () => axiosClient.get('/api/courses');

export const fetchCourseById = (id) => axiosClient.get(`/api/courses/${id}`);

export const createCourse = (formData) =>
  axiosClient.post('/api/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateCourse = (id, payload) => axiosClient.put(`/api/courses/${id}`, payload);

export const deleteCourse = (id) => axiosClient.delete(`/api/courses/${id}`);

// ====== STUDENTS (ADMIN) ======
// Endpoint này hiện chưa được triển khai ở Backend (404). Khi Backend bổ sung xong,
// chỉ cần đảm bảo route khớp đúng dưới đây, FE không cần sửa gì thêm.
export const fetchStudentsForAdmin = () => axiosClient.get('/api/v1/admin/students');