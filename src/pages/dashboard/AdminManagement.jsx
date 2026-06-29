// src/pages/dashboard/AdminManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { Button, Table, Form, Tab, Nav, Badge, Spinner, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaBook, FaUsers, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import { fetchCourses, deleteCourse, fetchStudentsForAdmin } from '../../api/adminApi';

function AdminManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cờ riêng cho từng tab để biết API đã chạy thành công hay đang lỗi/chưa có
  const [coursesError, setCoursesError] = useState(null);
  const [studentsError, setStudentsError] = useState(null);

  // State cho Modal xác nhận xóa (thay window.confirm)
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [isDeleting, setIsDeleting] = useState(false);

  // State cho Toast thông báo (thay alert)
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const showToast = (message, variant = 'success') => setToast({ show: true, message, variant });

  // 1. Fetch dữ liệu từ API tương ứng khi Admin truy cập / đổi tab
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setCoursesError(null);
      try {
        const res = await fetchCourses();
        setCourses(res.data?.data || res.data || []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách khóa học:', error);
        setCoursesError(
          error.response?.data?.message || 'Không thể tải danh sách khóa học. Vui lòng thử lại.'
        );
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    const loadStudents = async () => {
      setLoading(true);
      setStudentsError(null);
      try {
        const res = await fetchStudentsForAdmin();
        setStudents(res.data?.data || res.data || []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách học viên:', error);
        // KHÔNG dùng dữ liệu giả - hiển thị rõ ràng API chưa sẵn sàng
        setStudentsError(
          error.response?.status === 404
            ? 'API quản lý học viên (/api/v1/admin/students) chưa được triển khai ở Backend.'
            : error.response?.data?.message || 'Không thể tải danh sách học viên. Vui lòng thử lại.'
        );
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'courses') {
      loadCourses();
    } else {
      loadStudents();
    }
  }, [activeTab]);

  // Mở Modal xác nhận xóa
  const requestDeleteCourse = (course) => setDeleteTarget({ id: course.id, title: course.title });

  // Xác nhận xóa thật trong Modal
  const confirmDeleteCourse = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCourse(deleteTarget.id);
      setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast('Đã xóa khóa học thành công.', 'success');
    } catch (error) {
      showToast('Lỗi khi xóa khóa học: ' + (error.response?.data?.message || error.message), 'danger');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleEditCourse = (courseId) => navigate(`/dashboard/admin/edit-course/${courseId}`);

  // Bộ lọc tìm kiếm động
  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter((s) =>
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#07090f' }}>
      <Sidebar />

      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />

        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>

          {/* Header Phân vùng Quản trị */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <div>
              <h4 className="fw-bold text-white mb-1">Hệ thống Quản lý Toàn diện (Admin)</h4>
              <p className="text-white-50 mb-0">Điều phối, cấu trúc dữ liệu đào tạo và theo dõi danh sách học viên.</p>
            </div>
            {activeTab === 'courses' && (
              <Button
                variant="success"
                className="d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 text-dark"
                style={{ backgroundColor: '#10b981', border: 'none' }}
                onClick={() => navigate('/dashboard/admin/create-course')}
              >
                <FaPlus size={14} /> Tạo khóa học mới
              </Button>
            )}
          </div>

          {/* Thanh Công cụ: Tìm kiếm & Switch Tab */}
          <div className="p-3 rounded-4 mb-4 d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>

            <Tab.Container activeKey={activeTab} onSelect={(k) => { setActiveTab(k); setSearchTerm(''); }}>
              <Nav className="nav-pills gap-2">
                <Nav.Item>
                  <Nav.Link eventKey="courses" className={`px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${activeTab === 'courses' ? 'bg-success text-dark fw-bold' : 'text-white-50'}`} style={activeTab === 'courses' ? { backgroundColor: '#10b981' } : {}}>
                    <FaBook /> Khóa học ({filteredCourses.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="students" className={`px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${activeTab === 'students' ? 'bg-success text-dark fw-bold' : 'text-white-50'}`} style={activeTab === 'students' ? { backgroundColor: '#10b981' } : {}}>
                    <FaUsers /> Học viên ({filteredStudents.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Tab.Container>

            <div style={{ width: '100%', maxWidth: '350px' }}>
              <Form.Control
                type="text"
                placeholder={activeTab === 'courses' ? 'Tìm theo tên khóa học, giảng viên...' : 'Tìm học viên theo mã số, tên, email...'}
                className="border-0 text-white py-2 px-3 small rounded-3"
                style={{ backgroundColor: '#07080f', fontSize: '14px', border: '1px solid #1e2235' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Khối hiển thị dữ liệu dạng Bảng (Table) */}
          <div className="p-4 rounded-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="text-white-50 mt-2 small">Đang tải dữ liệu hệ thống...</p>
              </div>
            ) : activeTab === 'courses' ? (
              coursesError ? (
                <div className="text-center py-5">
                  <FaExclamationTriangle className="text-warning mb-3" size={32} />
                  <p className="text-white-50 mb-0">{coursesError}</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover borderless variant="dark" className="align-middle mb-0 text-white custom-admin-table">
                    <thead>
                      <tr className="text-white-50 small border-bottom border-secondary border-opacity-25">
                        <th>Khóa học</th>
                        <th>Giảng viên</th>
                        <th>Danh mục</th>
                        <th>Thời lượng</th>
                        <th>Trạng thái</th>
                        <th className="text-end">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                          <tr key={course.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <img src={course.imgBg || 'https://via.placeholder.com/60x35'} alt="" className="rounded shadow-sm" style={{ width: '60px', height: '35px', objectFit: 'cover' }} />
                                <div className="fw-semibold text-white">{course.title}</div>
                              </div>
                            </td>
                            <td className="text-white-50">{course.instructor}</td>
                            <td><Badge bg="dark" className="border border-secondary text-white-50">{course.category}</Badge></td>
                            <td className="text-white-50">{course.duration}</td>
                            <td>
                              {course.isPublished ? (
                                <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25">Công khai</Badge>
                              ) : (
                                <Badge bg="secondary" className="bg-opacity-10 text-white-50 border border-secondary border-opacity-25">Nháp</Badge>
                              )}
                            </td>
                            <td className="text-end">
                              <div className="d-flex gap-2 justify-content-end">
                                <Button variant="outline-light" size="sm" className="border-secondary border-opacity-50 text-white-50" onClick={() => handleEditCourse(course.id)}>
                                  <FaEdit size={12} />
                                </Button>
                                <Button variant="outline-danger" size="sm" className="border-danger border-opacity-25 text-danger" onClick={() => requestDeleteCourse(course)}>
                                  <FaTrash size={12} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-white-50 small">Không tìm thấy khóa học nào phù hợp.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )
            ) : (
              studentsError ? (
                <div className="text-center py-5">
                  <FaExclamationTriangle className="text-warning mb-3" size={32} />
                  <h6 className="text-white mb-2">Chưa thể hiển thị danh sách học viên</h6>
                  <p className="text-white-50 mb-0 small mx-auto" style={{ maxWidth: '480px' }}>
                    {studentsError}
                  </p>
                  <p className="text-white-50 mt-2 mb-0 small">
                    Vui lòng triển khai endpoint <code className="text-info">GET /api/v1/admin/students</code> ở Backend để tab này hoạt động.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover borderless variant="dark" className="align-middle mb-0 text-white">
                    <thead>
                      <tr className="text-white-50 small border-bottom border-secondary border-opacity-25">
                        <th>Mã số</th>
                        <th>Học viên</th>
                        <th>Email</th>
                        <th>Định hướng (Target Role)</th>
                        <th className="text-end">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <tr key={student.studentId || student.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td className="font-monospace text-info fw-semibold">{student.studentCode || 'N/A'}</td>
                            <td><div className="fw-semibold text-white">{student.fullName}</div></td>
                            <td className="text-white-50">{student.email}</td>
                            <td>
                              <Badge bg="info" className="bg-opacity-10 text-info border border-info border-opacity-25 fw-bold">
                                {student.targetRoleName || 'Chưa thiết lập'}
                              </Badge>
                            </td>
                            <td className="text-end">
                              <Button
                                variant="outline-info"
                                size="sm"
                                className="border-info border-opacity-25 text-info rounded-3"
                                onClick={() => navigate(`/dashboard/assessment-history/${student.userId}`)}
                              >
                                <FaEye className="me-1" size={12} /> Lịch sử test
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-white-50 small">Không tìm thấy học viên nào phù hợp.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )
            )}
          </div>

        </div>
      </div>

      {/* MODAL XÁC NHẬN XÓA (thay window.confirm) */}
      <Modal show={!!deleteTarget} onHide={() => !isDeleting && setDeleteTarget(null)} centered contentClassName="bg-dark text-white border border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="fs-5">Xác nhận xóa khóa học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa khóa học <strong>{deleteTarget?.title}</strong> không? Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Hủy</Button>
          <Button variant="danger" onClick={confirmDeleteCourse} disabled={isDeleting}>
            {isDeleting ? <Spinner animation="border" size="sm" /> : 'Xóa khóa học'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* TOAST THÔNG BÁO (thay alert) */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 2000 }}>
        <Toast show={toast.show} onClose={() => setToast((prev) => ({ ...prev, show: false }))} delay={3500} autohide bg={toast.variant}>
          <Toast.Body className={toast.variant === 'danger' ? 'text-white' : 'text-dark'}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <style>{`
        .table-hover tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.02) !important;
          transition: background-color 0.15s ease-in-out;
        }
        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>
    </div>
  );
}

export default AdminManagement;