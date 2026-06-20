// src/components/learning/CourseCard.jsx
import React, { useState } from 'react';
import { ProgressBar, Button, Spinner } from 'react-bootstrap';
import { FaStar, FaClock, FaBookOpen, FaUserGraduate } from 'react-icons/fa';

function CourseCard({ course, onEnroll }) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnrollClick = async () => {
    console.log("1. Nút Đăng ký đã được nhấn! ID khóa học:", course.id);
    
    if (!onEnroll) {
      console.error("LỖI: Hàm onEnroll không tồn tại! Hãy kiểm tra lại component cha xem đã truyền prop xuống chưa.");
      return;
    }

    try {
      setIsEnrolling(true);
      console.log("2. Bắt đầu gọi API đăng ký...");
      
      await onEnroll(course.id);
      
      console.log("3. Gọi API đăng ký hoàn tất!");
    } catch (error) {
      console.error("LỖI KHI NHẤN NÚT ĐĂNG KÝ:", error);
    } finally {
      setIsEnrolling(false);
      console.log("4. Đã tắt trạng thái loading của nút.");
    }
  };

  const renderStatusBadge = () => {
    if (course.status === 'completed') return <span className="badge bg-success bg-opacity-20 text-white border border-success border-opacity-50">✓ Hoàn thành</span>;
    if (course.status === 'learning') return <span className="badge bg-primary bg-opacity-20 text-white border border-primary border-opacity-50">⏳ Đang học</span>;
    return <span className="badge bg-secondary bg-opacity-20 text-white border border-secondary border-opacity-50">🔏 Đã lưu</span>;
  };

  const renderActionButton = () => {
    if (course.status === 'learning') {
      return (
        <Button 
          variant="success" 
          className="w-100 py-2 fw-semibold rounded-3 text-dark" 
          style={{ backgroundColor: '#10b981', border: 'none' }}
          onClick={(e) => {
            e.preventDefault(); // Chặn hành vi load lại trang mặc định
            
            console.log("=== KIỂM TRA DỮ LIỆU KHI BẤM VÀO HỌC ===");
            console.log("Thông tin khóa học:", course);
            
            const link = course.url;

            if (!link || link === '') {
              alert("LỖI: Khóa học này chưa có link tài liệu! Hãy nhấn F12, mở tab Console để xem nguyên nhân.");
            } else {
              // Mở link an toàn
              window.open(link, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          ▶ Vào học
        </Button>
      );
    }
    
    if (course.progress === 0 && course.status === 'completed') {
      return <Button variant="outline-secondary" className="w-100 py-2 fw-semibold rounded-3 text-white border-secondary">↻ Ôn tập</Button>;
    }
    
    if (course.status === 'not-started' && course.isRegistered) {
      return <Button variant="warning" className="w-100 py-2 fw-semibold rounded-3 text-dark fw-bold" style={{ backgroundColor: '#f59e0b', border: 'none' }}>▶ Bắt đầu (Đã đăng ký)</Button>;
    }
    
    return (
      <Button 
        variant="dark" 
        className="w-100 py-2 fw-semibold rounded-3 text-white" 
        style={{ backgroundColor: '#1c1e2d', border: '1px solid #2d3142' }}
        onClick={handleEnrollClick}
        disabled={isEnrolling}
      >
        {isEnrolling ? <Spinner animation="border" size="sm" /> : '+ Đăng ký học'}
      </Button>
    );
  };

  return (
    <div className="card h-100 text-white rounded-4 overflow-hidden d-flex flex-column" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
      <div className="position-relative ratio ratio-16x9">
        <img 
          src={course.imgBg} 
          alt={course.title} 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: 'cover', zIndex: 0 }}
        />
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ background: 'linear-gradient(to bottom, rgba(15, 17, 26, 0.4), rgba(15, 17, 26, 0.85))', zIndex: 1 }}
        />
        <div className="p-3 d-flex flex-column justify-content-between position-relative" style={{ zIndex: 2 }}>
          <div className="d-flex justify-content-between align-items-center">
            {renderStatusBadge()}
            <span className="badge bg-dark bg-opacity-70 text-white small">{course.type}</span>
          </div>
          <div className="text-end text-white-50 small mt-auto">
            <FaClock className="me-1" /> {course.duration}
          </div>
        </div>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="mb-1">
          <span className="text-primary extra-small text-uppercase fw-bold" style={{ fontSize: '11px', color: '#3b82f6 !important' }}>{course.category}</span>
          <span className="text-muted mx-2">•</span>
          <span className={`extra-small fw-medium ${course.level === 'Beginner' ? 'text-success' : course.level === 'Intermediate' ? 'text-warning' : 'text-danger'}`} style={{ fontSize: '11px' }}>{course.level}</span>
        </div>

        <h6 className="fw-bold text-white mb-2 line-clamp-2" style={{ minHeight: '44px' }}>{course.title}</h6>
        <p className="text-white-50 small line-clamp-2 mb-3" style={{ fontSize: '13px', minHeight: '38px' }}>{course.description}</p>

        <div className="text-white-50 small mb-2 d-flex flex-column gap-1" style={{ fontSize: '13.5px' }}>
          <div><FaUserGraduate className="me-2 text-muted" /> {course.instructor}</div>
          <div className="d-flex align-items-center gap-3">
            <span><FaBookOpen className="me-1 text-muted" /> {course.lessons} bài</span>
            <span><FaUserGraduate className="me-1 text-muted" /> {course.students?.toLocaleString()} viên</span>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-1.5 my-3 mt-auto">
          {course.tags?.map((tag, idx) => (
            <span key={idx} className="badge rounded-2 bg-secondary bg-opacity-20 text-white-50 fw-normal" style={{ fontSize: '11px', padding: '4px 8px' }}>{tag}</span>
          ))}
        </div>

        {renderActionButton()}
      </div>
    </div>
  );
}

export default CourseCard;