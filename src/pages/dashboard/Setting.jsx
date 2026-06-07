import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';


function Settings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const activeItem = SETTINGS_DATA.settingsNav.find((item) => item.id === activeTab) || SETTINGS_DATA.settingsNav[0];

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      <Sidebar />

      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />

        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>

          {/* 2b. Tiêu đề trang */}
          <div className="mb-3">
            <h4 className="fw-bold text-white mb-1">Cài đặt</h4>
            <p className="text-white-50 mb-0" style={{ fontSize: 13 }}>
              Quản lý tài khoản, giao diện và bảo mật của bạn
            </p>
          </div>

          <div className="card border-0 rounded-4 p-3 mb-4" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.14), rgba(139, 92, 246, 0.12))' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)' }}>
                  {SETTINGS_DATA.user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h5 className="mb-1 text-white">{SETTINGS_DATA.user.name}</h5>
                  <p className="mb-0 text-white-50 small">{SETTINGS_DATA.user.email} · {SETTINGS_DATA.user.role}</p>
                </div>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge rounded-pill bg-success bg-opacity-10 text-success">{SETTINGS_DATA.user.plan}</span>
                <span className="badge rounded-pill bg-primary bg-opacity-10 text-info">Streak {SETTINGS_DATA.user.streak} ngày</span>
                <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning">{SETTINGS_DATA.user.points} điểm</span>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-3">
              <div className="card border-0 rounded-4 p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {SETTINGS_DATA.settingsNav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`btn w-100 text-start rounded-3 mb-2 px-3 py-3 ${activeTab === item.id ? 'text-white' : 'text-white-50'}`}
                    style={{
                      background: activeTab === item.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      border: activeTab === item.id ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <span className="fw-semibold">{item.icon} {item.label}</span>
                      {item.badge ? <span className="badge rounded-pill bg-light text-dark">{item.badge}</span> : null}
                    </div>
                    <div className="small text-white-50 mt-1">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-9">
              {activeTab === 'notifications' ? (
                <div className="card border-0 rounded-4 p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <h5 className="text-white mb-1">Thông báo</h5>
                  <p className="text-white-50 small mb-4">Điều chỉnh kênh, tần suất và loại thông báo bạn muốn nhận.</p>
                  <div className="row g-3 mb-4">
                    {SETTINGS_DATA.notifications.channels.map((channel) => (
                      <div key={channel.id} className="col-12 col-md-6 col-xl-4">
                        <div className="rounded-4 p-3 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <strong className="text-white">{channel.icon} {channel.label}</strong>
                            <span className={`badge rounded-pill ${channel.defaultEnabled ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-white-50'}`}>
                              {channel.defaultEnabled ? 'Bật' : 'Tắt'}
                            </span>
                          </div>
                          <p className="text-white-50 small mb-0">{channel.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-grid gap-3">
                    {SETTINGS_DATA.notifications.types.map((type) => (
                      <div key={type.id} className="rounded-4 p-3 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="d-flex align-items-center justify-content-between gap-3">
                          <div>
                            <strong className="text-white">{type.emoji} {type.label}</strong>
                            <p className="text-white-50 small mb-0">{type.desc}</p>
                          </div>
                          <span className="badge rounded-pill text-white" style={{ background: type.color }}>
                            {Object.entries(type.defaults).filter(([, enabled]) => enabled).length} kênh
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card border-0 rounded-4 p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <h5 className="text-white mb-1">{SETTINGS_DATA.settingsNav.find((item) => item.id === activeTab)?.label || 'Cài đặt'}</h5>
                  <p className="text-white-50 mb-0">{SETTINGS_DATA.settingsNav.find((item) => item.id === activeTab)?.sub || 'Mục này đang được chuẩn bị.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
