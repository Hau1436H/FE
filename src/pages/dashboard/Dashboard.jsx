import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaUsers,
  FaChartLine,
  FaRobot,
} from "react-icons/fa";

// Import Layout Components (Đảm bảo đường dẫn import đúng với dự án của bạn)
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

// Tái sử dụng bảng màu Dark Theme
const COLORS = {
  bgContainer: "#000000",
  accentCyan: "#34D399",
  textSecondary: "#8C8C8C",
  cardBg: "rgba(255, 255, 255, 0.04)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
};

function AdminDashboard() {
  const [stats, setStats] = useState({
    market: null,
    students: null,
    activity: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Gọi 3 API Admin song song để tối ưu tốc độ
        const [analyticsRes, statsRes, activityRes] = await Promise.all([
          dashboardService.getMarketAnalytics(),
          dashboardService.getStudentStats(),
          dashboardService.getStudentActivity(), // Nếu bạn có API này
        ]);

        setStats({
          market: analyticsRes.data?.data || analyticsRes.data,
          students: statsRes.data?.data || statsRes.data,
          activity: activityRes.data?.data || activityRes.data,
        });
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Admin Dashboard:", err);
        setError(
          "Không thể kết nối đến máy chủ quản trị. Vui lòng kiểm tra lại quyền truy cập hoặc hệ thống.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div
      className="d-flex"
      style={{
        backgroundColor: COLORS.bgContainer,
        minHeight: "100vh",
        fontFamily: "system-ui",
      }}
    >
      <Sidebar />

      <div
        className="flex-grow-1 p-4 overflow-auto text-white"
        style={{ maxHeight: "100vh", backgroundColor: "#06060c" }}
      >
        <DashboardHeader title="Admin Command Center" />

        {loading ? (
          <div className="text-center py-5 mt-5">
            <div
              className="spinner-border mb-3"
              style={{ color: COLORS.accentCyan }}
            ></div>
            <p style={{ color: COLORS.textSecondary }}>
              Hệ thống đang tải dữ liệu tổng quan...
            </p>
          </div>
        ) : error ? (
          <div
            className="alert mt-4 text-center py-4 rounded-4"
            style={{
              backgroundColor: "rgba(220,53,69,0.1)",
              border: "1px solid rgba(220,53,69,0.3)",
              color: "#E5635B",
            }}
          >
            <FaExclamationTriangle className="fs-2 mb-2 d-block mx-auto" />
            {error}
          </div>
        ) : (
          <div className="d-flex flex-column gap-4 mt-4">
            <h4 className="fw-bold mb-2">Tổng quan Hệ thống</h4>

            <div className="row g-4">
              {/* Card 1: Thống kê Sinh viên */}
              <div className="col-xl-4 col-md-6">
                <div
                  className="p-4 rounded-4 h-100"
                  style={{
                    backgroundColor: COLORS.cardBg,
                    border: `1px solid ${COLORS.cardBorder}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0 text-white-50 fs-6">
                      Tổng số Sinh viên
                    </h5>
                    <div
                      className="p-2 rounded-circle"
                      style={{
                        backgroundColor: "rgba(52, 211, 153, 0.15)",
                        color: COLORS.accentCyan,
                      }}
                    >
                      <FaUsers size={20} />
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1">
                    {stats.students?.totalStudents || 0}
                  </h2>
                  <p className="small m-0 text-success">
                    +12% so với tháng trước
                  </p>
                </div>
              </div>

              {/* Card 2: Phân tích Thị trường AI */}
              <div className="col-xl-4 col-md-6">
                <div
                  className="p-4 rounded-4 h-100"
                  style={{
                    backgroundColor: COLORS.cardBg,
                    border: `1px solid ${COLORS.cardBorder}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0 text-white-50 fs-6">
                      Ngành hot nhất (Trending)
                    </h5>
                    <div
                      className="p-2 rounded-circle"
                      style={{
                        backgroundColor: "rgba(255, 193, 7, 0.15)",
                        color: "#FFC107",
                      }}
                    >
                      <FaChartLine size={20} />
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1 fs-3">
                    {stats.market?.trendingRole || "N/A"}
                  </h2>
                  <p className="small m-0 text-white-50">
                    Dựa trên dữ liệu cào tự động
                  </p>
                </div>
              </div>

              {/* Card 3: Ai Analytics / Activity */}
              <div className="col-xl-4 col-md-12">
                <div
                  className="p-4 rounded-4 h-100"
                  style={{
                    backgroundColor: COLORS.cardBg,
                    border: `1px solid ${COLORS.cardBorder}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0 text-white-50 fs-6">
                      Hoạt động trong ngày
                    </h5>
                    <div
                      className="p-2 rounded-circle"
                      style={{
                        backgroundColor: "rgba(13, 110, 253, 0.15)",
                        color: "#0D6EFD",
                      }}
                    >
                      <FaRobot size={20} />
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1">
                    {stats.activity?.activeToday || 0} user
                  </h2>
                  <p className="small m-0 text-white-50">
                    Đang online trên hệ thống
                  </p>
                </div>
              </div>
            </div>

            {/* Bạn có thể chèn thêm các Component Biểu đồ (Charts) ở bên dưới đây */}
            {/* <AdminCharts marketData={stats.market} /> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
