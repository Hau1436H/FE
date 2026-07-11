import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Thêm dòng này

import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import axiosClient from "../../api/axiosClient";

import CareerSnapshot from "../../components/dashboard/overview/CareerSnapshot";
import NextAction from "../../components/dashboard/overview/NextAction";
import TopSkillGaps from "../../components/dashboard/overview/TopSkillGaps";
import GithubPortfolio from "../../components/dashboard/overview/GithubPortfolio";
import MarketPulse from "../../components/dashboard/overview/MarketPulse";

const COLORS = {
  bgContainer: "#000000",
  accentCyan: "#34D399",
  textSecondary: "#8C8C8C",
};

function Dashboard() {
  const navigate = useNavigate(); // Khởi tạo điều hướng

  const [data, setData] = useState({
    overview: null,
    topGaps: [],
    topTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [timeLeftStr, setTimeLeftStr] = useState("Đang tính...");

  // TRẠM GÁC: Kiểm tra Role ngay khi component vừa mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
          base64 += "=";
        }
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        const role = (payload?.role || payload?.Role || localStorage.getItem("role") || "").toLowerCase();

        // Chuyển hướng nếu không phải là student
        if (role === "admin") {
          navigate("/dashboard/admin");
        } else if (role === "mentor") {
          navigate("/dashboard/mentor");
        } else if (role === "counselor") {
          navigate("/dashboard/counselor");
        }
      } catch (e) {
        console.error("Lỗi parse token ở trạm gác Dashboard", e);
      }
    }
  }, [navigate]);

  const getStudentId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const base64Url = token.split(".")[1];
      let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      const payload = JSON.parse(jsonPayload);
      return payload.studentId || payload.StudentId || payload.userId;
    } catch (e) {
      return null;
    }
  };

  const studentId = getStudentId();

  // Fetch dữ liệu song song từ API thực tế
  useEffect(() => {
    if (!studentId) return;
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [overviewRes, gapRes, marketRes] = await Promise.all([
          axiosClient.get(`/api/v1/Dashboard/${studentId}/overview`),
          axiosClient.get(`/api/SkillGapReports/${studentId}/skill-gap`),
          axiosClient.get(`/api/v1/MarketPulse/trends?days=30`),
        ]);

        const overview = overviewRes.data?.data || overviewRes.data;

        // Xử lý dữ liệu Skill Gaps nâng cao
        const gapsRaw =
          gapRes.data?.data?.gapItems || gapRes.data?.gapItems || [];
        const topGaps = gapsRaw
          .filter(
            (item) =>
              (item.currentScore || item.current || 0) <
              (item.targetScore || item.required || 0),
          )
          .sort(
            (a, b) =>
              (b.targetScore || b.required || 0) -
              (b.currentScore || b.current || 0) -
              ((a.targetScore || a.required || 0) -
                (a.currentScore || a.current || 0)),
          )
          .slice(0, 3)
          .map((item) => ({
            subject: item.nodeName || item.skillName || item.subject,
            gapSize:
              (item.targetScore || item.required || 0) -
              (item.currentScore || item.current || 0),
          }));

        // Xử lý dữ liệu Market Pulse thực tế
        const rawTrends = marketRes.data?.data || marketRes.data || [];
        const latestDemand = {};
        rawTrends.forEach((g) => {
          const name = g.nodeName || g.NodeName;
          const points = g.dataPoints || g.DataPoints || [];
          if (points.length > 0) {
            const sorted = [...points].sort(
              (a, b) =>
                new Date(b.analyzedDate || b.AnalyzedDate) -
                new Date(a.analyzedDate || a.AnalyzedDate),
            );
            latestDemand[name] =
              sorted[0].demandPercent || sorted[0].DemandPercent || 0;
          }
        });
        const topTrends = Object.entries(latestDemand)
          .map(([name, demand]) => ({ name, demand }))
          .sort((a, b) => b.demand - a.demand)
          .slice(0, 3);

        setData({ overview, topGaps, topTrends });
      } catch (err) {
        console.error("Lỗi fetch Dashboard Command Center:", err);
        setError(
          "Chưa thiết lập mục tiêu nghề nghiệp. Vui lòng cập nhật trong Hồ sơ của bạn.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [studentId, refreshTrigger]);

  // Đồng bộ thời gian thực qua SignalR Hub
  useEffect(() => {
    if (!studentId) return;
    const token = localStorage.getItem("token");
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7196/hubs/roadmap", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        connection.invoke("SubscribeToRoadmapUpdates", studentId.toString());
        connection.on("ReceiveRoadmapUpdate", () =>
          setRefreshTrigger((prev) => prev + 1),
        );
      })
      .catch((e) =>
        console.warn("SignalR chưa kích hoạt hoặc thiếu cấu hình CORS Hub."),
      );

    return () => {
      if (connection.state === "Connected") connection.stop();
    };
  }, [studentId]);

  // Bộ đếm ngược thời gian (Countdown Timer)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeftStr(`${h}h ${m < 10 ? "0" + m : m}m ${s < 10 ? "0" + s : s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { overview, topGaps, topTrends } = data;

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
        <DashboardHeader />

        {loading ? (
          <div className="text-center py-5 mt-5">
            <div
              className="spinner-border mb-3"
              style={{ color: COLORS.accentCyan }}
            ></div>
            <p style={{ color: COLORS.textSecondary }}>
              AI đang tổng hợp chiến lược học tập cho bạn...
            </p>
          </div>
        ) : error || !overview ? (
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
          <div className="d-flex flex-column gap-4">
            {/* Header thông tin tiến độ */}
            <CareerSnapshot overview={overview} />

            <div className="row g-4">
              {/* Cột chính (Nhiệm vụ trọng tâm) */}
              <div className="col-xl-8 col-lg-7">
                <NextAction
                  nextAction={overview.nextAction}
                  timeLeftStr={timeLeftStr}
                />
              </div>

              {/* Cột phụ (Báo cáo tổng hợp từ AI) */}
              <div className="col-xl-4 col-lg-5 d-flex flex-column gap-4">
                <TopSkillGaps topGaps={topGaps} />
                <GithubPortfolio studentId={studentId} />
                <MarketPulse
                  topTrends={topTrends}
                  aiPulseSummary={overview?.marketPulse?.aiPulseSummary}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;