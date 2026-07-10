import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import AssessmentStats from "./components/AssessmentStats";
import RoleDistributionChart from "./components/RoleDistributionChart";
import MarketAlignmentChart from "./components/MarketAlignmentChart";
import StudentProgressList from "./components/StudentProgressList";

// 1. IMPORT SIDEBAR
import Sidebar from "../../../components/dashboard/Sidebar"; 

function CounselorDashboard() {
  const [loading, setLoading] = useState(true);
  
  const [assessmentStats, setAssessmentStats] = useState(null);
  const [roleStats, setRoleStats] = useState([]);
  const [marketAlignment, setMarketAlignment] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Chạy 4 API song song để tối ưu thời gian tải trang
        const [
          statsRes, 
          rolesRes, 
          marketRes, 
          studentsRes
        ] = await Promise.all([
          axiosClient.get("/api/counselors/dashboard/assessment-stats"),
          axiosClient.get("/api/counselors/dashboard/student-stats"),
          axiosClient.get("/api/counselors/dashboard/market-alignment"),
          axiosClient.get("/api/counselors/students?pageNumber=1&pageSize=10")
        ]);

        setAssessmentStats(statsRes.data);
        setRoleStats(rolesRes.data?.length ? rolesRes.data : []);
        setMarketAlignment(marketRes.data || []);
        
        // PagedResult trả về danh sách trong property Items
        setStudents(studentsRes.data?.items || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Cố vấn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "100vh", backgroundColor: "#0a0a14" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 2. CẬP NHẬT LAYOUT D-FLEX ĐỂ CHỨA SIDEBAR
  return (
    <div className="d-flex" style={{ backgroundColor: "#0a0a14", minHeight: "100vh" }}>
      
      {/* CỘT TRÁI: SIDEBAR */}
      <Sidebar />

      {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
      <div className="flex-grow-1 p-4 text-white" style={{ overflowY: "auto", height: "100vh" }}>
        <h2 className="fw-bold mb-4">Dashboard Giám Sát Học Tập (Counselor)</h2>

        {/* Dòng 1: 3 Thẻ thống kê */}
        <AssessmentStats data={assessmentStats} />

        {/* Dòng 2: Các biểu đồ */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <RoleDistributionChart data={roleStats} />
          </div>
          <div className="col-lg-8">
            <MarketAlignmentChart data={marketAlignment} />
          </div>
        </div>

        {/* Dòng 3: Danh sách sinh viên */}
        <StudentProgressList data={students} />
      </div>

    </div>
  );
}

export default CounselorDashboard;