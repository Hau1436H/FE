import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Logo from '../components/Logo';

// === 1. IMPORT THƯ VIỆN GOOGLE ===
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
    const leftBgImage = 'https://i.pinimg.com/736x/2a/2a/33/2a2a337f02b6c63548fb8e03b24a796a.jpg';
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    
    const [message, setMessage] = useState({ type: '', content: '' });
    const [isLoading, setIsLoading] = useState(false);

    // === 2. XỬ LÝ LOGIC ĐĂNG NHẬP GOOGLE ===
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setMessage({ type: '', content: '' });
            try {
                // Google trả về một access_token tạm thời
                const googleToken = tokenResponse.access_token;

                // Gửi token này lên Backend .NET của bạn để xác thực/tạo tài khoản
                const response = await axiosClient.post('/api/Auth/google-login', {
                    token: googleToken
                });

                console.log("GOOGLE LOGIN RESPONSE:", response.data);
                const { token, user, role } = response.data;

                // Lưu thông tin giống hệt login truyền thống
                localStorage.setItem('token', token);
                if (user) localStorage.setItem('user', JSON.stringify(user));
                if (role) localStorage.setItem('role', role);

                setMessage({ type: 'success', content: 'Đăng nhập bằng Google thành công!' });
                
                setTimeout(() => {
                    window.dispatchEvent(new Event('authChange'));
                    navigate('/');
                }, 800);

            } catch (error) {
                setMessage({ 
                    type: 'error', 
                    content: error.response?.data?.message || 'Đăng nhập bằng Google thất bại.' 
                });
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            setMessage({ type: 'error', content: 'Ủy quyền Google thất bại.' });
        }
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', content: '' });

        try {
            const response = await axiosClient.post('/api/Auth/login', {
                email: email.trim(),
                password: password
            });
            
            // ĐÃ SỬA: Lấy dữ liệu an toàn, hỗ trợ cả JSON viết hoa lẫn viết thường từ C#
            const token = response.data.token || response.data.Token;
            const user = response.data.user || response.data.User;
            const role = response.data.role || response.data.Role;
            
            // Log ra xem Backend thực sự trả về những gì
            console.log("Dữ liệu User từ Backend:", user);

            if (token) localStorage.setItem('token', token);
            if (user) localStorage.setItem('user', JSON.stringify(user));
            if (role) localStorage.setItem('role', role);

            setMessage({ type: 'success', content: 'Đăng nhập thành công! Đang chuyển hướng...' });
            
            setTimeout(() => {
                window.dispatchEvent(new Event('authChange'));
                navigate('/');
            }, 800);

        } catch (error) {
            const errRes = error.response;
            const serverMessage = errRes?.data?.message || '';

            if (errRes && errRes.status === 403 && serverMessage.toLowerCase().includes('chưa được xác thực')) {
                setMessage({ type: 'error', content: errRes.data.message || 'Tài khoản chưa kích hoạt. Vui lòng xác thực OTP.' });
                setStep(2);
            } else {
                setMessage({ 
                    type: 'error', 
                    content: errRes?.data?.message || 'Sai email hoặc mật khẩu hoặc tài khoản không tồn tại.' 
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý Xác thực OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', content: '' });

        try {
            const response = await axiosClient.post('/api/Auth/verify-account', {
                email: email.trim(),
                otpCode: otpCode.trim()
            });
            
            setMessage({ 
                type: 'success', 
                content: response.data?.message || 'Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay.' 
            });
            setOtpCode('');
            setStep(1);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                content: error.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container fluid className="p-0" style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            <Row className="g-0" style={{ minHeight: '100vh' }}>
                {/* --- BÊN TRÁI --- */}
                <Col lg={6} className="d-none d-lg-flex flex-column justify-content-between p-5 position-relative text-white"
                    style={{
                        backgroundImage: `linear-gradient(rgba(10, 25, 20, 0.88), rgba(10, 20, 20, 0.92)), url(${leftBgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}>
                    <div className="fw-bold fs-4" style={{ color: '#10b981', letterSpacing: '0.5px' }}>
                        <Logo size="md" />
                    </div>

                    <div className="mx-auto my-auto w-75" style={{ maxWidth: '420px' }}>
                        <div className="p-4 mb-3 rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }}>
                            <div className="d-flex align-items-center mb-3 text-emerald" style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>
                                <i className="bi bi-cpu me-2"></i> AI đang phân tích
                            </div>
                            <div className="d-flex flex-column gap-3 text-white-50" style={{ fontSize: '0.75rem' }}>
                                <div><div className="d-flex justify-content-between mb-1"><span>Kỹ năng Frontend</span><span className="fw-bold" style={{ color: '#00bfa5' }}>87%</span></div><div className="progress" style={{ height: '6px', backgroundColor: '#30363d' }}><div className="progress-bar" style={{ width: '87%', backgroundColor: '#00bfa5' }}></div></div></div>
                                <div><div className="d-flex justify-content-between mb-1"><span>System Design</span><span className="fw-bold text-warning">47%</span></div><div className="progress" style={{ height: '6px', backgroundColor: '#30363d' }}><div className="progress-bar bg-warning" style={{ width: '47%' }}></div></div></div>
                                <div><div className="d-flex justify-content-between mb-1"><span>DevOps & CI/CD</span><span className="fw-bold text-danger">11%</span></div><div className="progress" style={{ height: '6px', backgroundColor: '#30363d' }}><div className="progress-bar bg-danger" style={{ width: '11%' }}></div></div></div>
                            </div>
                        </div>

                        <div className="p-4 mb-3 rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }}>
                            <div className="rounded-circle d-flex align-items-center justify-content-center text-warning mb-2" style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255, 193, 7, 0.1)' }}><i className="bi bi-lightbulb-fill"></i></div>
                            <div>
                                <p className="m-0 fw-bold text-white" style={{ fontSize: '0.75rem' }}>Minh Tú vừa pass VNG!</p>
                                <p className="m-0 text-white-50" style={{ fontSize: '0.7rem' }}>Sau 3 tháng luyện theo roadmap AI</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-100 ps-3 border-start border-2" style={{ borderColor: '#10b981', maxWidth: '500px' }}>
                        <p className="fst-italic opacity-75 mb-2" style={{ fontSize: '15px', lineHeight: '1.6' }}>"Tôi không ngờ một bài test 15 phút lại lộ ra đúng điểm yếu mà tôi né tránh suốt 2 năm học."</p>
                        <div className="small fw-semibold">Phương Anh <span className="text-muted fw-normal">— Frontend Dev tại FPT</span></div>
                    </div>
                </Col>

                {/* --- BÊN PHẢI --- */}
                <Col lg={6} xs={12} className="d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
                    <div className="w-100" style={{ maxWidth: '420px' }}>
                        <div className="text-center text-lg-start mb-4">
                            <h2 className="fw-bold text-dark mb-1">
                                {step === 1 ? 'Chào mừng trở lại' : 'Xác thực tài khoản'}
                            </h2>
                            <div className="text-muted small">
                                {step === 1 ? (
                                    <>Chưa có tài khoản? <Link to="/register" className="text-decoration-none fw-medium" style={{ color: '#10b981' }}>Đăng ký miễn phí</Link></>
                                ) : (
                                    <>Nhập mã OTP vừa được gửi đến <strong className="text-dark">{email}</strong></>
                                )}
                            </div>
                        </div>

                        {message.content && (
                            <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} py-2 mb-3`} style={{ fontSize: '0.85rem' }}>
                                {message.content}
                            </div>
                        )}

                        {step === 1 ? (
                            <>
                                {/* === 3. THAY ĐỔI SỰ KIỆN CLICK NÚT GOOGLE === */}
                                <button 
                                    onClick={() => loginWithGoogle()} 
                                    disabled={isLoading}
                                    type="button"
                                    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-4 text-dark bg-transparent border-secondary border-opacity-25" 
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    <svg className="bi" width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" /></svg>
                                    {isLoading ? 'Đang xử lý...' : 'Tiếp tục với Google'}
                                </button>

                                <div className="d-flex align-items-center my-4 text-muted small">
                                    <div className="flex-grow-1 border-bottom" style={{ borderColor: '#f3f4f6' }}></div>
                                    <span className="px-3" style={{ fontSize: '12px' }}>hoặc đăng nhập bằng email</span>
                                    <div className="flex-grow-1 border-bottom" style={{ borderColor: '#f3f4f6' }}></div>
                                </div>
                                <form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
                                    <div>
                                        <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: '0.75rem' }}>Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-envelope"></i></span>
                                            <input type="email" placeholder="ten@email.com" className="form-control form-control-sm bg-light border-start-0" style={{ fontSize: '0.85rem' }} required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: '0.75rem' }}>Mật khẩu</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-lock"></i></span>
                                            <input type="password" placeholder="••••••••" className="form-control form-control-sm bg-light border-start-0" style={{ fontSize: '0.85rem' }} required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                                        </div>
                                    </div>
                                    <div className="form-check d-flex gap-1 align-items-start pt-1 m-0">
                                        <input type="checkbox" id="terms" className="form-check-input mt-1 shadow-none" style={{ cursor: 'pointer' }} />
                                        <label htmlFor="terms" className="form-check-label text-muted lh-sm" style={{ fontSize: '0.75rem', cursor: 'pointer' }}>Ghi nhớ đăng nhập</label>
                                    </div>
                                    <Button variant="success" type="submit" className="w-100 py-2 fw-semibold rounded-3 border-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#10b981' }} disabled={isLoading}>
                                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'} <i className="bi bi-arrow-right ms-2"></i>
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <form className="d-flex flex-column gap-3" onSubmit={handleVerifyOtp}>
                                <div>
                                    <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: '0.75rem' }}>Mã OTP (6 chữ số)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-key"></i></span>
                                        <input type="text" placeholder="Ví dụ: 123456" className="form-control form-control-sm bg-light border-start-0" style={{ fontSize: '0.85rem', letterSpacing: '0.2rem' }} required maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} disabled={isLoading} />
                                    </div>
                                </div>
                                <button type="submit" className="btn border-0 w-100 d-flex align-items-center justify-content-center gap-1 py-2 text-white fw-medium shadow-sm mt-2" style={{ backgroundColor: '#10b981', fontSize: '0.85rem' }} disabled={isLoading}>
                                    {isLoading ? 'Đang xác thực...' : 'Xác thực tài khoản'} <i className="bi bi-check-circle ms-1"></i>
                                </button>
                                <button type="button" className="btn btn-link text-muted mt-2 shadow-none text-decoration-none" style={{ fontSize: '0.75rem' }} onClick={() => setStep(1)} disabled={isLoading}>
                                    &larr; Quay lại đăng nhập
                                </button>
                            </form>
                        )}
                        
                        <p className="text-center text-muted mt-4" style={{ fontSize: '11px', lineHeight: '1.5' }}>
                            Bằng cách đăng nhập, bạn đồng ý với <a href="#terms" className="text-dark text-decoration-underline">Điều khoản</a> và <a href="#privacy" className="text-dark text-decoration-underline">Chính sách bảo mật</a> của AiCareer.
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;