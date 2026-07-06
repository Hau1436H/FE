import React, { useMemo } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  ADMIN_METRICS,
  REVENUE_TREND,
  ACTIVITY_FEED,
  QUICK_RESULTS
} from '../../../data/adminStatsData';
import {
  FaUserPlus,
  FaChalkboardTeacher,
  FaBookOpen,
  FaDollarSign,
  FaChartLine,
  FaUsers
} from 'react-icons/fa';

const ICONS = {
  FaUsers: <FaUsers />,
  FaBookOpen: <FaBookOpen />,
  FaUserPlus: <FaUserPlus />,
  FaChalkboardTeacher: <FaChalkboardTeacher />,
  FaDollarSign: <FaDollarSign />,
  FaChartLine: <FaChartLine />
};

function AdminStats() {
  const chartData = REVENUE_TREND;

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#07090f' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />

        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>
          <div className="mb-4">
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
              <div>
                <h4 className="fw-bold text-white mb-1">Bảng điều khiển Admin</h4>
                <p className="text-white-50 mb-0">Theo dõi số liệu đăng ký, khoá học, tài khoản, bài học, doanh thu và hoạt động hệ thống.</p>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            {ADMIN_METRICS.map(metric => (
              <div key={metric.id} className="col-12 col-md-6 col-xl-4">
                <div className="p-3 rounded-4" style={{ backgroundColor: metric.bg, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div>
                      <span className="text-white-50 small">{metric.title}</span>
                      <h3 className="text-white my-2 fw-bold">{metric.value}</h3>
                      <p className="text-white-50 small mb-0">{metric.subtitle}</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: '54px', height: '54px', backgroundColor: 'rgba(255,255,255,0.08)', color: metric.color, fontSize: '1.2rem' }}>
                      {ICONS[metric.icon]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-12 col-xl-7">
              <div className="p-4 rounded-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h5 className="text-white fw-bold mb-1">Xu hướng doanh thu</h5>
                    <p className="text-white-50 small mb-0">So sánh doanh thu và tài khoản mới theo 6 kỳ gần nhất.</p>
                  </div>
                </div>

                <div style={{ width: '100%', height: '360px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="accountsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="period" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0e1724', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }} />
                      <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10b981" fill="url(#revenueGradient)" strokeWidth={3} />
                      <Area type="monotone" dataKey="accounts" name="Tài khoản mới" stroke="#38bdf8" fill="url(#accountsGradient)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-5">
              <div className="p-4 rounded-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h5 className="text-white fw-bold mb-1">Hoạt động hệ thống</h5>
                    <p className="text-white-50 small mb-0">Những sự kiện và cập nhật quan trọng nhất.</p>
                  </div>
                </div>

                <div className="d-grid gap-3">
                  {ACTIVITY_FEED.map(item => (
                    <div key={item.id} className="p-3 rounded-4" style={{ backgroundColor: '#02050d', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div>
                          <h6 className="text-white mb-1">{item.title}</h6>
                          <p className="text-white-50 mb-0 small">{item.desc}</p>
                        </div>
                        <span className="text-white-50 small">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-4" style={{ backgroundColor: '#09101c', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="text-white fw-bold mb-1">Kết quả nhanh</h5>
                <p className="text-white-50 small mb-0">Các chỉ số quan trọng mà admin cần nắm.</p>
              </div>
            </div>

            <div className="row g-3">
              {QUICK_RESULTS.map(item => (
                <div key={item.id} className="col-12 col-sm-6 col-xl-4">
                  <div className="p-3 rounded-4" style={{ backgroundColor: '#02060f', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-white-50 small mb-2">{item.label}</div>
                    <h4 className="text-white fw-bold mb-1">{item.value}</h4>
                    <div className={`text-${item.tone} small`}>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
