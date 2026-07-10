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
import AdminStats from "./pages/dashboard/admin/AdminStats";
import AdminCreateCourse from "./pages/dashboard/admin/AdminCreateCourse";
import { AppSettingsProvider } from "./components/dashboard/setting/AppSettingsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Import Component quản lý người dùng (Dùng chung cho cả Admin/Mentor/Counselor)
import AdminUserManagement from "./pages/dashboard/admin/AdminUserManagement";

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

            {/* Các route dành riêng cho Admin */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard/admin" element={<AdminStats />} />
              <Route
                path="/dashboard/admin/create-course"
                element={<AdminCreateCourse />}
              />
              {/* Chỉ giữ lại route Quản lý người dùng */}
              <Route
                path="/dashboard/admin/users"
                element={<AdminUserManagement />}
              />
            </Route>
          </Route>
        </Routes>
      </div>
    </AppSettingsProvider>
  );
}

export default App;
