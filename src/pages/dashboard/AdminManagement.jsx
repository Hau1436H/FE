// src/pages/dashboard/AdminManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { Button, Table, Form, Tab, Nav, Badge, Spinner } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaBook, FaUsers, FaEye } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';

function AdminManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch dữ liệu từ API tương ứng khi Admin truy cập
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'courses') {
          // Lấy danh sách khóa học hiện tại hệ thống
          const res = await axiosClient.get('/api/courses'); // Hãy điều chỉnh endpoint tương ứng với Backend của bạn
          setCourses(res.data?.data || res.data || []);
        } else {
          // Lấy danh sách học viên/người dùng phục vụ quản trị
          const res = await axiosClient.get('/api/v1/admin/students'); // Endpoint giả định cho học viên
          setStudents(res.data?.data || res.data || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu quản trị:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Xóa khóa học
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      try {
        await axiosClient.delete(`/api/courses/${courseId}`);
        setCourses(courses.filter(c => c.id !== courseId));
        alert("Xóa khóa học thành công!");
      } catch (error) {
        alert("Lỗi khi xóa khóa học: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // Bộ lọc tìm kiếm động
  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(s => 
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#07090f' }}>
      {/* Giữ nguyên cấu trúc Sidebar chung của hệ thống */}
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
                placeholder={activeTab === 'courses' ? "Tìm theo tên khóa học, giảng viên..." : "Tìm học viên theo mã số, tên, email..."}
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
              /* TAB QUẢN LÝ KHÓA HỌC */
              <div className="table-responsive">
                <Table table-dark="true" hover borderless className="align-middle mb-0 text-white custom-admin-table">
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
                              <Button variant="outline-light" size="sm" className="border-secondary border-opacity-50 text-white-50" onClick={() => alert("Chức năng cập nhật khóa học đang được đồng bộ!")}>
                                <FaEdit size={12} />
                              </Button>
                              <Button variant="outline-danger" size="sm" className="border-danger border-opacity-25 text-danger" onClick={() => handleDeleteCourse(course.id)}>
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
            ) : (
              /* TAB QUẢN LÝ HỌC VIÊN */
              <div className="table-responsive">
                <Table table-dark="true" hover borderless className="align-middle mb-0 text-white">
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
                          <td>
                            <div className="fw-semibold text-white">{student.fullName}</div>
                          </td>
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
                      /* Fallback Dữ liệu mẫu nếu Backend chưa cào xong hoặc trống danh sách */
                      <>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="font-monospace text-info fw-semibold">HE172400</td>
                          <td className="fw-semibold text-white">Trần Quốc Đạt</td>
                          <td className="text-white-50">quocdat.dev@gmail.com</td>
                          <td><Badge bg="info" className="bg-opacity-10 text-info border border-info border-opacity-25 fw-bold">Backend Engineer</Badge></td>
                          <td className="text-end">
                            <Button variant="outline-info" size="sm" className="border-info border-opacity-25 text-info rounded-3" onClick={() => navigate('/dashboard/assessment-history/HE172400')}>
                              <FaEye className="me-1" size={12} /> Lịch sử test
                            </Button>
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="font-monospace text-info fw-semibold">HE170112</td>
                          <td className="fw-semibold text-white">Nguyễn Minh Tú</td>
                          <td className="text-white-50">minhttu.dev@gmail.com</td>
                          <td><Badge bg="info" className="bg-opacity-10 text-info border border-info border-opacity-25 fw-bold">Frontend Developer</Badge></td>
                          <td className="text-end">
                            <Button variant="outline-info" size="sm" className="border-info border-opacity-25 text-info rounded-3" onClick={() => navigate('/dashboard/assessment-history/HE170112')}>
                              <FaEye className="me-1" size={12} /> Lịch sử test
                            </Button>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Thêm một chút Style đè (Override) đắp độ mượt cho Table Hover của Bootstrap */}
      <style>{`
        .table hover tbody tr:hover {
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