import React, { useState, useEffect, useCallback } from 'react';
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

  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await axiosClient.get('/api/Profile/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Get profile failed:', error);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    checkAuth();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, [checkAuth]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);

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
          {/* ĐÃ FIX: Đổi as={Link} thành as="div" và xóa to="/" để tránh lồng thẻ <a> */}
          <Navbar.Brand
            as="div"
            className="fw-bold text-white fs-4 p-0 m-0"
          >
            <Logo size="md" />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="border-secondary"
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-3 my-2 my-lg-0">
              <Nav.Link
                href="#features"
                className="text-white opacity-75"
              >
                Tính năng
              </Nav.Link>

              <Nav.Link
                href="#how-it-works"
                className="text-white opacity-75"
              >
                Cách hoạt động
              </Nav.Link>

              <Nav.Link
                href="#mentors"
                className="text-white opacity-75"
              >
                Mentor
              </Nav.Link>

              <Nav.Link
                href="#about"
                className="text-white opacity-75"
              >
                Về chúng tôi
              </Nav.Link>
            </Nav>

            <Nav className="ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 text-nowrap">
              {user ? (
                <Dropdown
                  align="end"
                  className="w-100 w-lg-auto text-start"
                >
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-user-avatar"
                    className="avatar-dropdown p-0 border-0 d-flex align-items-center gap-2 text-decoration-none text-white"
                  >
                    {user?.avatar?.trim() ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="rounded-circle border"
                        width="38"
                        height="38"
                        style={{
                          objectFit: 'cover',
                          borderColor: '#10b981'
                        }}
                      />
                    ) : (
                      <div className="avatar-letter-fallback">
                        {getFirstLetter(user.fullName)}
                      </div>
                    )}

                    <span className="d-lg-none fw-medium">
                      {user.fullName}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-dark border border-secondary shadow mt-2">
                    <Dropdown.Header className="text-gray-400 border-bottom border-secondary pb-2 mb-2">
                      <div className="fw-bold text-white">
                        {user.fullName}
                      </div>

                      <small className="text-white-50">
                        {user.email}
                      </small>
                    </Dropdown.Header>

                    <Dropdown.Item
                      as={Link}
                      to="/dashboard"
                      className="py-2"
                    >
                      Bảng điều khiển
                    </Dropdown.Item>

                    <Dropdown.Item
                      as={Link}
                      to="/dashboard/profile"
                      className="py-2"
                    >
                      Hồ sơ cá nhân
                    </Dropdown.Item>

                    <Dropdown.Item
                      as={Link}
                      to="/skill-assessment"
                      className="py-2"
                    >
                      Làm bài test
                    </Dropdown.Item>

                    <Dropdown.Divider className="border-secondary" />

                    <Dropdown.Item
                      onClick={handleLogout}
                      className="py-2 text-danger"
                    >
                      Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/login"
                    className="text-white fw-medium"
                  >
                    Đăng nhập
                  </Nav.Link>

                  <Button
                    as={Link}
                    to="/register"
                    className="px-4 py-2 fw-semibold rounded-pill w-100 w-lg-auto text-center"
                    style={{
                      backgroundColor: '#10b981',
                      border: 'none',
                      color: '#0a0a14'
                    }}
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