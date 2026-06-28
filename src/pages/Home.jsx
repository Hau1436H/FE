import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import MyNavbar from '../components/MyNavbar';
import MyFooter from '../components/MyFooter';
import Logo from '../components/Logo';
import Background from '../data/Background.jpg'
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  // Thay link ảnh nền của bạn vào đây hoặc import từ thư mục assets
  const backgroundImage = Background;
  const navigate = useNavigate();

  return (
    <>
    <div
      className="hero-section text-white d-flex align-items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 10, 20, 0.85), rgba(10, 10, 20, 0.85)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '80px 0'
      }}
    >
      <Container>
        <Row>
          <Col lg={8} md={10} className="text-start">
            {/* Tag Badge nhỏ ở trên cùng */}
            <div className="mb-4">
              <span
                className="px-3 py-2 rounded-pill d-inline-flex align-items-center"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent) !important',
                  color: 'color-mix(in srgb, var(--accent) 100%, transparent)',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '1px'
                }}
              >
                <span className="me-2" style={{ width: '6px', height: '6px', backgroundColor: 'color-mix(in srgb, var(--accent) 25%, transparent)', borderRadius: '50%' }}></span>
                AI-POWERED CAREER PLATFORM
              </span>
            </div>

            {/* Tiêu đề chính */}
            <h1 className="fw-bold mb-3 display-4" style={{ lineHeight: '1.2' }}>
              Lộ trình nghề nghiệp <br />
              <span style={{ color: 'color-mix(in srgb, var(--accent) 100%, transparent)' }}>được AI cá nhân hóa</span> <br />
              <span className="fw-light" style={{ fontStyle: 'italic' }}>chỉ dành cho bạn.</span>
            </h1>

            {/* Đoạn văn tả chi tiết */}
            <p className="text-secondary mb-5 fs-5 style-description" style={{ color: '#9ca3af', maxWidth: '650px', fontWeight: '300' }}>
              Hệ thống đánh giá năng lực ẩn, tạo lộ trình học tập động, cung cấp thông tin thị trường
              trực tiếp cho những người đang muốn học lập trình.
            </p>

            {/* Khu vực nút bấm */}
            <div className="d-flex flex-wrap gap-3 mb-5">
              <Button
                onClick={() => navigate('/skill-assessment')}
                variant="success"
                className="px-4 py-2.5 fw-semibold d-flex align-items-center rounded-pill"
                style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 100%, transparent)', border: 'none' }}
              >
                <i className="py-2"></i> Bắt đầu miễn phí
              </Button>

              <Button
                variant="outline-light"
                className="px-4 py-2.5 fw-semibold d-flex align-items-center rounded-pill"
                style={{ borderColor: 'rgba(255,255,255,0.3)' }}
              >
                <i className="bi bi-play-circle me-2"></i> Xem cách hoạt động
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
    <MyFooter />
    </>
  );
}

export default Home;
