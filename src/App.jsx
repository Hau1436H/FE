import React from "react";
import MyNavbar from "./components/MyNavbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Learning from "./pages/dashboard/Learning";
import Practice from "./pages/dashboard/Practice";
import Jobs from "./pages/dashboard/Jobs";
import Profile from "./pages/dashboard/Profile";
import Notifications from "./pages/dashboard/Notifications";
import Setting from "./pages/dashboard/Setting";
import SkillAssessment from './pages/SkillAssessment';
import AssessmentHistory from './pages/dashboard/AssessmentHistory';
import PublicPortfolio from './pages/PublicPortfolio';
import VirtualMentor from './pages/dashboard/VirtualMentor'; // <-- IMPORT FILE MỚI VÀO ĐÂY
import AdminStats from './pages/dashboard/AdminStats';
import AdminCreateCourse from './pages/dashboard/AdminCreateCourse';
//import AdminManagement from './pages/dashboard/AdminManagement';  
import { AppSettingsProvider } from './components/dashboard/setting/AppSettingsContext';
// import { GoogleOAuthProvider } from '@react-oauth/google'; // (Uncomment nếu dùng Google Auth)
import ProtectedRoute from './components/ProtectedRoute';
import AdminManagement from './pages/dashboard/AdminManagement';
import AdminRoute from './components/AdminRoute';
function App() {
  const location = useLocation();

  // Ẩn Navbar chung mặc định cho các đường dẫn này (Thêm '/p/' để nhà tuyển dụng không thấy Navbar)
  const noNavarPaths = ['/login', '/register', '/dashboard', '/skill-assessment', '/learning-hub', '/p/'];
  const showNavbar = !noNavarPaths.some(path => location.pathname.startsWith(path));

  return (
    <AppSettingsProvider>
      <div className="position-relative" style={{ backgroundColor: '#0a0a14' }}>
        {showNavbar && <MyNavbar />}
        
        <Routes>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ROUTE PUBLIC: Dành cho nhà tuyển dụng xem E-Portfolio (Bắt buộc nằm ngoài ProtectedRoute) */}
          <Route path="/p/:slug" element={<PublicPortfolio />} />
          
          {/* Các route yêu cầu đăng nhập */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/learning" element={<Learning />}/>
            <Route path="/dashboard/practice" element={<Practice />}/>
            <Route path="/dashboard/jobs" element={<Jobs />}/>
            <Route path="/dashboard/profile" element={<Profile />}/>
            <Route path="/dashboard/notifications" element={<Notifications />}/>
            <Route path="/dashboard/setting" element={<Setting />}/>
            <Route path="/skill-assessment" element={<SkillAssessment />} />
            
            {/* Route Lịch sử đánh giá với ID động */}
            <Route path="/dashboard/assessment-history/:studentId" element={<AssessmentHistory />} />

            {/* THÊM ROUTE VIRTUAL MENTOR VÀO ĐÂY */}
            <Route path="/dashboard/virtual-mentor" element={<VirtualMentor />} />

            {/* Các route dành riêng cho Admin */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard/admin" element={<AdminStats />} />
              <Route path="/dashboard/admin/create-course" element={<AdminCreateCourse />} />
              <Route path="/dashboard/admin/management" element={<AdminManagement />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </AppSettingsProvider>
  );
}

export default App;