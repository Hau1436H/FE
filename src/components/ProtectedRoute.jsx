import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  // Kiểm tra xem token bảo mật có tồn tại trong localStorage hay chưa
  const token = localStorage.getItem('token');

  // 1. Nếu CHƯA login (không có token): Chuyển hướng ngay lập tức sang trang /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu ĐÃ login: Cho phép đi tiếp vào các trang con bên trong
  return <Outlet />;
}

export default ProtectedRoute;
