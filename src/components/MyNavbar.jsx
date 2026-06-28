import { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';

import Logo from './Logo';
import axiosClient from '../api/axiosClient';

function MyNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [portfolioSlug, setPortfolioSlug] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setPortfolioSlug(null);
      return;
    }

    try {
      // 1. Lấy thông tin user
      const response = await axiosClient.get('/api/Profile/me');
      setUser(response.data.data);

      // 2. Lấy studentId từ token
      let studentId = null;
      try {
        const base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // FIX LỖI CRASH ATOB: Tự động bù thêm dấu '=' cho đủ độ dài chuỗi Base64
        while (base64.length % 4) {
            base64 += '=';
        }
        
        // Giải mã an toàn hỗ trợ cả ký tự Unicode (tiếng Việt)
        const jsonPayload = decodeURIComponent(
          atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')
        );

        const payload = JSON.parse(jsonPayload);
        studentId = payload.studentId || payload.StudentId || payload.sub;
      } catch (err) {
        console.warn("Không thể giải mã token để lấy StudentId", err);
        // Nếu giải mã thất bại mới ép đăng xuất
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setPortfolioSlug(null);
        return; // Dừng lại không gọi API tiếp
      }

      // 3. Lấy shareableUrl
      if (studentId) {
        try {
          const portRes = await axiosClient.get(`/api/Portfolios/student/${studentId}`);
          if (portRes.data && portRes.data.shareableUrl) {
            const url = portRes.data.shareableUrl;
            const extractedSlug = url.substring(url.lastIndexOf('/') + 1);
            setPortfolioSlug(extractedSlug);
          }
        } catch (portErr) {
          console.warn('Ứng viên chưa khởi tạo E-Portfolio:', portErr);
          setPortfolioSlug(null);
        }
      }

    } catch (error) {
      console.error('Lỗi xác thực:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setPortfolioSlug(null);
    }
  }, []);
  
  useEffect(() => {
    let isMounted = true;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Bọc việc gọi API khởi tạo vào một hàm async cục bộ để tránh lỗi set-state-in-effect
    const initAuth = async () => {
        if(isMounted) {
            await checkAuth();
        }
    }
    
    initAuth();

    window.addEventListener('scroll', handleScroll);
    
    // Gán trực tiếp reference của hàm useCallback vào event listener
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      isMounted = false; // Cleanup
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, [checkAuth]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setPortfolioSlug(null);

    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  const getFirstLetter = (name) => {
    if (!name) return 'A';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <>
      <style>{`
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background-color: #0a0a14 !important;
            padding: 1.5rem;
            border-radius: 12px;
            margin-top: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.08);
          }
        }

        .avatar-dropdown::after {
          display: none !important;
        }

        .avatar-letter-fallback {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #10b981;
          color: #0a0a14;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          border: 1px solid rgba(255,255,255,0.2);
          user-select: none;
        }
      `}</style>

      <Navbar
        expand="lg"
        variant="dark"
        className="fixed-top w-100 start-0 top-0"
        style={{
          zIndex: 1050,
          backgroundColor: isScrolled ? '#0a0a14' : 'transparent',
          backdropFilter: isScrolled ? 'blur(8px)' : 'none',
          borderBottom: isScrolled
            ? '1px solid rgba(255,255,255,0.08)'
            : 'none',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Container>
          <Navbar.Brand as="div" className="fw-bold text-white fs-4 p-0 m-0">
            <Logo size="md" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-secondary" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-3 my-2 my-lg-0">
              <Nav.Link as={Link} to="/skill-assessment" className="py-2">Làm bài test</Nav.Link>

              {portfolioSlug && (
                <Nav.Link
                  as={Link}
                  to={`/p/${portfolioSlug}`}
                  className="fw-bold"
                  style={{ color: '#10b981' }}
                >
                  🔥 E-Portfolio Của Tôi
                </Nav.Link>
              )}
            </Nav>

            <Nav className="ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 text-nowrap">
              {user ? (
                <Dropdown align="end" className="w-100 w-lg-auto text-start">
                  <Dropdown.Toggle variant="link" id="dropdown-user-avatar" className="avatar-dropdown p-0 border-0 d-flex align-items-center gap-2 text-decoration-none text-white">
                    {user?.avatar?.trim() ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="rounded-circle border"
                        width="38"
                        height="38"
                        style={{ objectFit: 'cover', borderColor: '#10b981' }}
                      />
                    ) : (
                      <div className="avatar-letter-fallback">
                        {getFirstLetter(user.fullName)}
                      </div>
                    )}
                    <span className="d-lg-none fw-medium">{user.fullName}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-dark border border-secondary shadow mt-2">
                    <Dropdown.Header className="text-gray-400 border-bottom border-secondary pb-2 mb-2">
                      <div className="fw-bold text-white">{user.fullName}</div>
                      <small className="text-white-50">{user.email}</small>
                    </Dropdown.Header>
                    <Dropdown.Item as={Link} to="/dashboard" className="py-2">Bảng điều khiển</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/dashboard/profile" className="py-2">Hồ sơ & E-Portfolio</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/skill-assessment" className="py-2">Làm bài test</Dropdown.Item>
                    <Dropdown.Divider className="border-secondary" />
                    <Dropdown.Item onClick={handleLogout} className="py-2 text-danger">Đăng xuất</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="text-white fw-medium">Đăng nhập</Nav.Link>
                  <Button
                    as={Link}
                    to="/register"
                    className="px-4 py-2 fw-semibold rounded-pill w-100 w-lg-auto text-center"
                    style={{ backgroundColor: '#10b981', border: 'none', color: '#0a0a14' }}
                  >
                    Bắt đầu miễn phí
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;