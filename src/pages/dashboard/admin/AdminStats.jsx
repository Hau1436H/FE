// src/pages/dashboard/admin/AdminStats.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import axiosClient from '../../../api/axiosClient';
import { FaDatabase, FaUsers, FaSearch, FaRobot } from 'react-icons/fa';

function AdminStats() {
  const [stats, setStats] = useState({ totalStudents: 0, totalJobs: 0, lastScraped: '' });
  const [marketTrends, setMarketTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, marketRes] = await Promise.all([
          axiosClient.get('/api/admin/dashboard/student-stats'),
          axiosClient.get('/api/admin/dashboard/market-analytics')
        ]);
        setStats(statsRes.data);
        setMarketTrends(marketRes.data?.data || []);
      } catch (err) {
        console.error("Lỗi fetch dữ liệu dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#07090f' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto text-white">
        <DashboardHeader />

        {/* METRICS ROW */}
        <div className="row g-3 mb-4">
          <MetricCard title="Tổng sinh viên" value={stats.totalStudents} icon={<FaUsers />} color="#38bdf8" />
          <MetricCard title="Jobs đã Scraped" value={stats.totalJobs} icon={<FaDatabase />} color="#10b981" />
          <MetricCard title="Lần Scrape cuối" value={new Date(stats.lastScraped).toLocaleDateString()} icon={<FaSearch />} color="#f59e0b" />
        </div>

        {/* MARKET TRENDS CHART */}
        <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h5 className="text-white fw-bold mb-4">Xu hướng kỹ năng thị trường (Trend Score)</h5>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketTrends}>
                <XAxis dataKey="skillName" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0e1724' }} />
                <Bar dataKey="trendScore" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {marketTrends.map((entry, index) => <Cell key={index} fill={index % 2 === 0 ? "#10b981" : "#38bdf8"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component hiển thị card số liệu
function MetricCard({ title, value, icon, color }) {
  return (
    <div className="col-12 col-md-4">
      <div className="p-3 rounded-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-white-50 small">{title}</div>
            <h4 className="fw-bold my-2">{value}</h4>
          </div>
          <div style={{ color: color, fontSize: '1.5rem' }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;