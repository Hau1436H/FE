import React from "react";
import MyNavbar from "./components/MyNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Learning from "./pages/dashboard/Learning";
import Practice from "./pages/dashboard/Practice";
import Jobs from "./pages/dashboard/Jobs";
import Profile from "./pages/dashboard/Profile";
import Notifications from "./pages/dashboard/Notifications";

function App() {
  // Giờ đây useLocation() sẽ hoạt động bình thường vì App đã nằm trong <BrowserRouter> ở main.jsx
  const location = useLocation();

  const noNavarPaths = ['/login', '/register', '/dashboard'];
  const showNavbar = !noNavarPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="position-relative" style={{ backgroundColor: '#0a0a14' }}>
      {showNavbar && <MyNavbar />}
      
      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/learning" element={<Learning />}/>
        <Route path="/dashboard/practice" element={<Practice />}/>
        <Route path="/dashboard/jobs" element={<Jobs />}/>
        <Route path="/dashboard/profile" element={<Profile />}/>
        <Route path="/dashboard/notifications" element={<Notifications />}/>
      </Routes>
    </div>
  );
}

export default App;