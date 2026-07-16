import React from "react";
import MyNavbar from "./components/MyNavbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Learning from "./pages/dashboard/Learning";
import Practice from "./pages/dashboard/Practice";
import Jobs from "./pages/dashboard/Jobs";
import Profile from "./pages/dashboard/Profile";
import Setting from "./pages/dashboard/Setting";
import SkillAssessment from "./pages/SkillAssessment";
import AssessmentHistory from "./pages/dashboard/AssessmentHistory";
import PublicPortfolio from "./pages/PublicPortfolio";
import VirtualMentor from "./pages/dashboard/VirtualMentor";
import { AppSettingsProvider } from "./components/dashboard/setting/AppSettingsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Import các Component cho phân hệ Admin Quản trị
import AdminStats from "./pages/dashboard/admin/AdminStats";
import AdminUserManagement from "./pages/dashboard/admin/AdminUserManagement";
import AdminResourceList from "./pages/dashboard/admin/AdminResourceList";
import AdminCreateResource from "./pages/dashboard/admin/AdminCreateResource";
import AdminEditResource from "./pages/dashboard/admin/AdminEditResource";

// Import các Component cho Counselor và Mentor
import CounselorDashboard from "./pages/dashboard/counselor/CounselorDashboard";
import MentorDashboard from "./pages/dashboard/mentor/MentorDashboard";
import CounselorStudentList from "./pages/dashboard/counselor/CounselorStudentList";
import MentorFeedbackHistory from "./pages/dashboard/mentor/MentorFeedbackHistory";
import CounselorStudentDetail from "./pages/dashboard/counselor/CounselorStudentDetail";

function App() {
  const location = useLocation();

  const noNavarPaths = [
    "/login",
    "/register",
    "/dashboard",
    "/skill-assessment",
    "/learning-hub",
    "/p/",
  ];
  const showNavbar = !noNavarPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <AppSettingsProvider>
      <div className="position-relative" style={{ backgroundColor: "#0a0a14" }}>
        {showNavbar && <MyNavbar />}

        <Routes>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/p/:slug" element={<PublicPortfolio />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/learning" element={<Learning />} />
            <Route path="/dashboard/practice" element={<Practice />} />
            <Route path="/dashboard/jobs" element={<Jobs />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/setting" element={<Setting />} />
            <Route path="/skill-assessment" element={<SkillAssessment />} />

            <Route
              path="/dashboard/assessment-history/:studentId"
              element={<AssessmentHistory />}
            />

            <Route
              path="/dashboard/virtual-mentor"
              element={<VirtualMentor />}
            />

            {/* Các route bảo vệ dành riêng cho Quản trị viên (Admin) */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard/admin" element={<AdminStats />} />
              <Route path="/dashboard/admin/users" element={<AdminUserManagement />} />
              
              {/* Hệ thống định tuyến CRUD phân trang cho Tài nguyên học tập */}
              <Route path="/dashboard/admin/management" element={<AdminResourceList />} />
              <Route path="/dashboard/admin/resources/create" element={<AdminCreateResource />} />
              <Route path="/dashboard/admin/resources/edit/:id" element={<AdminEditResource />} />
            </Route>

            {/* Các route dành cho Cố vấn học tập (Counselor) */}
            <Route path="/dashboard/counselor" element={<CounselorDashboard />} />
            <Route path="/dashboard/counselor/students" element={<CounselorStudentList />} />
            <Route path="/dashboard/counselor/students/:studentId" element={<CounselorStudentDetail />} />

            {/* Các route dành cho Chuyên gia doanh nghiệp (Mentor) */}
            <Route path="/dashboard/mentor" element={<MentorDashboard />} />
            <Route path="/dashboard/mentor/history" element={<MentorFeedbackHistory />} /> {/* THÊM DÒNG NÀY */}
            
          </Route>
        </Routes>
      </div>
    </AppSettingsProvider>
  );
}

export default App;