// src/pages/dashboard/admin/AdminStats.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import axiosClient from '../../../api/axiosClient';
import ReactMarkdown from 'react-markdown';

import { 
  FaDatabase, FaUsers, FaServer, FaBrain, 
  FaBolt, FaSync, FaChartPie, FaExternalLinkAlt, FaCheckCircle
} from 'react-icons/fa';

function AdminStats() {
  const [stats, setStats] = useState({ totalStudents: 0, totalJobsScraped: 0, jobsToday: 0, lastScraped: '' });
  const [marketTrends, setMarketTrends] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemHealth, setSystemHealth] = useState(null);
  
  // State mới hứng dữ liệu AI Insight
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    // Đồng hồ chạy ngầm cho Dashboard
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Sử dụng .catch() ngầm định để không văng lỗi đỏ rực lên Console
        const [statsRes, marketRes, logsRes, healthRes, aiSummaryRes] = await Promise.all([
          axiosClient.get('/api/admin/dashboard/student-stats')
            .catch(() => ({ data: { totalStudents: 0, totalJobsScraped: 0, jobsToday: 0, lastScraped: '' } })),
          
          axiosClient.get('/api/admin/dashboard/market-analytics')
            .catch(() => ({ data: { data: [] } })),
          
          axiosClient.get('/api/admin/monitor/system-logs')
            .catch(() => ({ data: { data: [] } })),
          
          axiosClient.get('/api/admin/monitor/system-health')
            .catch(() => ({ data: { data: null } })),
          
          axiosClient.get('/api/admin/monitor/ai-summary')
            .catch(() => ({ 
              data: { data: { summary: "⚠️ **Hệ thống AI hiện đang tạm gián đoạn.**\n\nXin vui lòng kiểm tra lại cấu hình *Gemini API Key* (AIzaSy...) tại Backend." } } 
            }))
        ]);
        
        setStats(statsRes.data);
        
        // Tính toán Delta % cho Market Trends
        const rawTrends = marketRes.data?.data || [];
        const processedTrends = rawTrends.map((t, index) => {
          let delta = 0;
          if (t.scoreYesterday > 0) {
            delta = ((t.scoreToday - t.scoreYesterday) / t.scoreYesterday) * 100;
          } else if (t.scoreToday > 0) {
            delta = 100; // Skill mới nổi
          }
          return { ...t, rank: index + 1, delta: delta };
        });
        
        setMarketTrends(processedTrends);
        setSystemLogs(logsRes.data?.data || []);
        setSystemHealth(healthRes.data?.data || null);
        
        // Hứng data từ Gemini AI trả về
        setAiSummary(aiSummaryRes.data?.data?.summary || "Không có dữ liệu phân tích.");
      } catch (err) {
        console.error("Lỗi fetch dữ liệu dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Auto refresh mỗi 30s
    const autoRefresh = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(autoRefresh);
  }, []);

  // --- BẮT ĐẦU: Logic tính toán System Health động ---
  let healthScore = "---%";
  let healthStatus = "Checking";
  let healthColor = "#64748b"; // Màu xám mặc định khi đang tải

  if (systemHealth) {
    const services = Object.values(systemHealth);
    // Lọc lấy các object có thuộc tính isGood, bỏ qua các object cấu trúc khác nếu có
    const healthServices = services.filter(s => typeof s === 'object' && s !== null && 'isGood' in s);
    const totalServices = healthServices.length;
    
    if (totalServices > 0) {
      const activeServices = healthServices.filter(service => service.isGood).length;
      const percentage = (activeServices / totalServices) * 100;
      healthScore = `${percentage.toFixed(0)}%`;

      if (percentage === 100) {
        healthStatus = "Stable";
        healthColor = "#10b981";
      } else if (percentage >= 60) {
        healthStatus = "Degraded";
        healthColor = "#f59e0b";
      } else {
        healthStatus = "Critical";
        healthColor = "#ef4444";
      }
    }
  }
  // --- KẾT THÚC: Logic tính toán System Health động ---

  const maxTrendScore = Math.max(...marketTrends.map(t => t.scoreToday), 1);

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#030712', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 p-xl-5 overflow-auto text-white">
        
        {/* === HEADER COMMAND CENTER === */}
        <div className="d-flex justify-content-between align-items-end mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div>
            <h3 className="fw-bold mb-1 text-white">Welcome, Administrator</h3>
            <div className="d-flex align-items-center gap-3 text-secondary small">
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>•</span>
              <span>{currentTime.toLocaleTimeString('en-US')}</span>
              <span>•</span>
              <span className="text-success d-flex align-items-center gap-1">
                <FaCheckCircle /> Everything is running normally.
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="text-secondary small d-flex align-items-center gap-2">
              <div className="spinner-grow spinner-grow-sm text-success" role="status" style={{width: '0.75rem', height: '0.75rem'}}></div>
              Auto-refresh 30s
            </div>
          </div>
        </div>

        {/* === ROW 1: KPI CARDS === */}
        <div className="row g-3 mb-4">
          <KpiCard 
            title="Total Students" 
            value={stats.totalStudents} 
            delta="+12%" 
            deltaLabel="This Week" 
            sparkline="▅▆▇██▇▆▅" 
            color="#38bdf8" 
          />
          
          <KpiCard 
            title="Jobs Scraped Today" 
            value={stats.jobsToday || 0} 
            delta={`Total: ${stats.totalJobsScraped || 0}`} 
            deltaLabel="in Database" 
            sparkline="▂▃▄▅▆▇██" 
            color="#10b981" 
          />
          
          <KpiCard 
            title="Trend Skills" 
            value={marketTrends.length} 
            delta="+2" 
            deltaLabel="New Detected" 
            sparkline="▃▄▅▆▇█▇▆" 
            color="#a855f7" 
          />
          
          {/* Truyền biến phần trăm thực tế và trạng thái */}
          <KpiCard 
            title="System Health" 
            value={healthScore}        
            delta={healthStatus}       
            deltaLabel="Status" 
            sparkline="████████" 
            color={healthColor}        
            isStatus
          />
        </div>

        {/* === ROW 2: MARKET TRENDS & SYSTEM HEALTH === */}
        <div className="row g-4 mb-4">
          {/* Market Trend Chart */}
          <div className="col-12 col-xl-8">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <FaChartPie className="text-info" /> Market Trend Top 10
                </h6>
                <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-25 px-2 py-1">Realtime</span>
              </div>
              
              <div className="d-flex flex-column gap-3" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' }}>
                {loading ? <div className="text-secondary small">Loading trends...</div> : marketTrends.map((trend) => (
                  <div key={trend.skillName} className="d-flex align-items-center">
                    <div className="fw-bold text-secondary text-end me-3" style={{ width: '25px', fontSize: '0.85rem' }}>
                      {trend.rank === 1 ? '🥇' : trend.rank === 2 ? '🥈' : trend.rank === 3 ? '🥉' : `#${trend.rank}`}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-end mb-1">
                        <span className="text-light fw-medium" style={{ fontSize: '0.9rem' }}>{trend.skillName}</span>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-white-50 fw-semibold" style={{ fontSize: '0.8rem' }}>{trend.scoreToday.toFixed(1)}</span>
                          <span className={`fw-bold ${trend.delta >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.75rem', width: '50px', textAlign: 'right' }}>
                            {trend.delta >= 0 ? '↑' : '↓'} {Math.abs(trend.delta).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="progress" style={{ height: '6px', backgroundColor: '#1e293b' }}>
                        <div 
                          className={`progress-bar ${trend.delta >= 0 ? 'bg-info' : 'bg-secondary'}`} 
                          style={{ width: `${(trend.scoreToday / maxTrendScore) * 100}%`, borderRadius: '4px' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="col-12 col-xl-4">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <h6 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <FaServer className="text-success" /> System Health
              </h6>
              
              <div className="d-flex flex-column gap-0">
                {systemHealth ? (
                  <>
                    <HealthItem name="Backend API" status={systemHealth.backendApi.status} isGood={systemHealth.backendApi.isGood} />
                    <HealthItem name="SQL Database" status={systemHealth.sqlDatabase.status} isGood={systemHealth.sqlDatabase.isGood} />
                    <HealthItem name="Hangfire Queue" status={systemHealth.hangfireQueue.status} isGood={systemHealth.hangfireQueue.isGood} />
                    <HealthItem name="Job Scraper" status={systemHealth.jobScraper.status} isGood={systemHealth.jobScraper.isGood} />
                    <HealthItem name="Gemini AI Service" status={systemHealth.geminiAiService.status} isGood={systemHealth.geminiAiService.isGood} />
                  </>
                ) : (
                  <div className="text-secondary small mt-2">Checking system status...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* === ROW 3: AI SUMMARY, LOGS, QUICK ACTIONS === */}
        <div className="row g-4">
          
          {/* AI Summary */}
          <div className="col-12 col-xl-4">
            <div className="p-4 rounded-4 h-100 position-relative overflow-hidden" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, transparent 100%)', pointerEvents: 'none' }}></div>
              <h6 className="text-white fw-bold mb-4 d-flex align-items-center gap-2 position-relative">
                <FaBrain className="text-purple" style={{ color: '#a855f7' }} /> AI Insight Summary
              </h6>
              
              <div className="position-relative z-1 ai-markdown-content text-light" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                {loading ? (
                  <div className="text-secondary small">Đang chờ AI phân tích dữ liệu...</div>
                ) : (
                  <ReactMarkdown>{aiSummary}</ReactMarkdown>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities (Logs) */}
          <div className="col-12 col-xl-5">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="text-white fw-bold m-0">Recent Activities</h6>
                <button className="btn btn-link text-secondary text-decoration-none p-0 small" style={{ fontSize: '0.8rem' }}>View All →</button>
              </div>
              
              <div className="d-flex flex-column gap-3 custom-scrollbar pe-3" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {loading ? (
                  <div className="text-secondary small">Loading logs...</div>
                ) : (
                  systemLogs.slice(0, 10).map((log, index) => {
                    const logDate = new Date(log.recordedAt || log.createdAt || new Date());
                    const timeStr = logDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                    const dateStr = logDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

                    const action = log.actionType || log.action_type || "";
                    const duration = log.durationSeconds || log.duration_seconds || 0;
                    
                    let message = "";
                    let badgeLabel = "System";
                    let badgeColor = "text-secondary border-secondary bg-secondary bg-opacity-10";

                    switch (action) {
                      case 'SYSTEM_JOB_SCRAPED':
                        message = `Tiến trình cào dữ liệu việc làm hoàn tất trong ${duration} giây.`;
                        badgeLabel = "Scraper";
                        badgeColor = "text-success border-success bg-success bg-opacity-10";
                        break;
                      case 'SYNC_GITHUB_SUCCESS':
                        message = `Đồng bộ Roadmap Github hoàn tất trong ${duration} giây.`;
                        badgeLabel = "Github Sync";
                        badgeColor = "text-purple border-purple bg-purple bg-opacity-10";
                        break;
                      case 'AI_REPO_ANALYZED':
                        message = duration > 0 ? `AI phân tích repository hoàn tất trong ${duration} giây.` : `AI đã phân tích repository thành công.`;
                        badgeLabel = "AI Engine";
                        badgeColor = "text-warning border-warning bg-warning bg-opacity-10";
                        break;
                      case 'VIEW_SKILL_GAP':
                        message = `Người dùng vừa truy cập phân tích khoảng trống kỹ năng.`;
                        badgeLabel = "User Action";
                        badgeColor = "text-info border-info bg-info bg-opacity-10";
                        break;
                      case 'FILTER_JOB_MARKET':
                        message = `Người dùng vừa tra cứu bộ lọc thị trường việc làm.`;
                        badgeLabel = "Job Filter";
                        badgeColor = "text-primary border-primary bg-primary bg-opacity-10";
                        break;
                      case 'ENROLL':
                        message = `Một sinh viên vừa tham gia vào lộ trình học.`;
                        badgeLabel = "Enrollment";
                        badgeColor = "text-success border-success bg-success bg-opacity-10";
                        break;
                      case 'TEST_WORKER':
                        message = `Tiến trình Test Worker chạy kiểm tra mất ${duration} giây.`;
                        badgeLabel = "Worker";
                        badgeColor = "text-danger border-danger bg-danger bg-opacity-10";
                        break;
                      default:
                        message = duration > 0 ? `Tiến trình ${action} thực thi mất ${duration} giây.` : `Tiến trình ${action} đã thực thi.`;
                        break;
                    }

                    return (
                      <div key={log.historyId || log.logId || index} className="d-flex gap-3 align-items-start pb-3 border-bottom border-secondary border-opacity-10 last-border-none">
                        <div className="text-center mt-1" style={{ width: '45px' }}>
                          <div className="fw-bold text-light" style={{ fontSize: '0.8rem' }}>{timeStr}</div>
                          <div className="text-secondary mt-1" style={{ fontSize: '0.65rem' }}>{dateStr}</div>
                        </div>
                        
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className={`badge border ${badgeColor}`} style={{ fontSize: '0.65rem' }}>
                              {badgeLabel}
                            </span>
                            {duration > 0 && (
                              <span className="text-white-50" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>⏱ {duration}s</span>
                            )}
                          </div>
                          
                          <div className="fw-medium text-light text-wrap pe-2" 
                               style={{ fontSize: '0.85rem', lineHeight: '1.5', wordBreak: 'break-word' }}>
                            {message}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-12 col-xl-3">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <h6 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <FaBolt className="text-warning" /> Quick Actions
              </h6>
              
              <div className="d-flex flex-column gap-2">
                <ActionButton icon={<FaDatabase />} label="Scrape Jobs" />
                <ActionButton icon={<FaSync />} label="Sync Skills Data" />
                <ActionButton icon={<FaChartPie />} label="Generate Report" />
                <a 
                  href="https://localhost:7196/hangfire" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn w-100 d-flex align-items-center justify-content-between p-3 rounded-3 mt-2 transition-all hover-bg-dark"
                  style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', textDecoration: 'none' }}
                >
                  <div className="d-flex align-items-center gap-3 fw-medium" style={{ fontSize: '0.85rem' }}>
                    <FaExternalLinkAlt /> Open Hangfire
                  </div>
                  <span className="text-secondary">↗</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// === CÁC COMPONENT PHỤ ===

function KpiCard({ title, value, delta, deltaLabel, sparkline, color, isStatus = false }) {
  return (
    <div className="col-12 col-md-6 col-xl-3">
      <div className="p-4 rounded-4 h-100 position-relative overflow-hidden" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
        
        <div className="position-absolute top-0 end-0 rounded-circle" 
             style={{ width: '80px', height: '80px', backgroundColor: color, filter: 'blur(40px)', opacity: 0.15, transform: 'translate(20%, -20%)' }}>
        </div>

        <div className="text-secondary fw-semibold small text-uppercase tracking-wider mb-2 position-relative z-1" 
             style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
          {title}
        </div>
        
        <div className="d-flex justify-content-between align-items-end mb-3 position-relative z-1">
          <h2 className="fw-bold m-0 text-white lh-1">{value}</h2>
          <div style={{ fontSize: '1.5rem', letterSpacing: '1px', opacity: 0.4, color: color }}>
            {sparkline}
          </div>
        </div>
        
        <div className="d-flex align-items-center gap-2 position-relative z-1">
          <span className="fw-bold px-2 py-1 rounded" 
                style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: isStatus ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                  color: isStatus ? '#0bf5a7' : '#f8fafc', 
                  border: isStatus ? '1px solid rgba(16, 185, 129, 0.3)' : `1px solid ${color}40` 
                }}>
            {delta}
          </span>
          <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{deltaLabel}</span>
        </div>
      </div>
    </div>
  );
}

function HealthItem({ name, status, isGood }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-25 last-border-none">
      <span className="text-light fw-medium" style={{ fontSize: '0.85rem' }}>{name}</span>
      <span className={`d-flex align-items-center gap-2 fw-semibold ${isGood ? 'text-success' : 'text-warning'}`} style={{ fontSize: '0.8rem' }}>
        {status} <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: isGood ? '#10b981' : '#f59e0b', boxShadow: `0 0 8px ${isGood ? '#10b981' : '#f59e0b'}` }}></div>
      </span>
    </div>
  );
}

function ActionButton({ icon, label }) {
  return (
    <button 
      className="btn w-100 d-flex align-items-center gap-3 p-3 rounded-3 text-light text-start transition-all"
      style={{ backgroundColor: 'transparent', border: '1px solid #1e293b', fontSize: '0.85rem' }}
      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; }}
      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <span className="text-secondary">{icon}</span>
      <span className="fw-medium">{label}</span>
    </button>
  );
}

const style = document.createElement('style');
style.innerHTML = `
  .last-border-none:last-child { border-bottom: none !important; }
  .hover-bg-dark:hover { background-color: #0f172a !important; }
  
  /* Bổ sung 2 dòng này để fix lỗi màu text-success trên nền tối */
  .text-success { color: #10b981 !important; }
  .bg-success.bg-opacity-10 { background-color: rgba(16, 185, 129, 0.15) !important; }
  
  /* CSS tối ưu cho text markdown do AI generate ra */
  .ai-markdown-content ul { padding-left: 1rem; margin-bottom: 0; }
  .ai-markdown-content li { margin-bottom: 0.5rem; }
  .ai-markdown-content p { margin-bottom: 0.5rem; }
  .ai-markdown-content strong { color: #c084fc; font-weight: 600; }
`;
document.head.appendChild(style);

export default AdminStats;