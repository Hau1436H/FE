import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { FaExclamationTriangle } from "react-icons/fa";

import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import axiosClient from "../../api/axiosClient";

// Import các Component con vừa tạo
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

function AdminDashboard() {
  const [stats, setStats] = useState({
    market: null,
    students: null,
    activity: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [timeLeftStr, setTimeLeftStr] = useState("Đang tính...");

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

  // Fetch dữ liệu song song
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [overviewRes, gapRes, marketRes] = await Promise.all([
          axiosClient.get(`/api/v1/Dashboard/${studentId}/overview`),
          axiosClient.get(`/api/SkillGapReports/${studentId}/skill-gap`),
          axiosClient.get(`/api/v1/MarketPulse/trends?days=30`),
        ]);

        const overview = overviewRes.data?.data || overviewRes.data;

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
        console.error("Lỗi khi tải dữ liệu Admin Dashboard:", err);
        setError(
          "Không thể kết nối đến máy chủ quản trị. Vui lòng kiểm tra lại quyền truy cập hoặc hệ thống.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [studentId, refreshTrigger]);

  // SignalR & Timer
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
      .catch((e) => console.warn("SignalR chưa bật."));

    return () => {
      if (connection.state === "Connected") connection.stop();
    };
  }, [studentId]);

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
          <div className="d-flex flex-column gap-4">
            {/* Lắp ráp các Component con */}
            <CareerSnapshot overview={overview} />

            <div className="row g-4">
              <div className="col-xl-8 col-lg-7">
                <NextAction
                  nextAction={overview.nextAction}
                  timeLeftStr={timeLeftStr}
                />
              </div>

              <div className="col-xl-4 col-lg-5 d-flex flex-column gap-4">
                <TopSkillGaps topGaps={topGaps} />
                {/* Lắp ráp ở file Dashboard.jsx */}
                <GithubPortfolio studentId={studentId} />
                <MarketPulse
                  topTrends={topTrends}
                  aiPulseSummary={overview?.marketPulse?.aiPulseSummary}
                />
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
