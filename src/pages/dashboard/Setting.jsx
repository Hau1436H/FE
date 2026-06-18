import React, { useMemo, useState } from 'react';
import { Bell, Palette, CreditCard, ShieldCheck, HelpCircle, Save } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import AppearanceTab from '../../components/dashboard/setting/AppearanceTab';
import NotificationsTab from '../../components/dashboard/setting/NotificationsTab';
import PrivacyTab from '../../components/dashboard/setting/PrivacyTab';
import BillingSettings from '../../components/dashboard/setting/BillingSettings';
import { SETTINGS_DATA } from '../../data/settingsData';
import discordVideo from '../../data/Discord.mp4';

const navConfig = SETTINGS_DATA.settingsNav.map((item) => ({
  ...item,
  icon: item.id === 'billing' ? CreditCard : item.id === 'appearance' ? Palette : item.id === 'notifications' ? Bell : item.id === 'privacy' ? ShieldCheck : HelpCircle,
}));

function Settings() {
  // Chuyển tab mặc định sang Billing để phù hợp với hình ảnh
  const [activeTab, setActiveTab] = useState('billing');
  const [savedMessage, setSavedMessage] = useState('');

  // Khởi tạo state cho thông báo, đồng bộ với dữ liệu mẫu
  const [notificationPrefs, setNotificationPrefs] = useState({
    channels: Object.fromEntries(SETTINGS_DATA.notifications.channels.map((item) => [item.id, item.defaultEnabled])),
    types: Object.fromEntries(SETTINGS_DATA.notifications.types.map((item) => [item.id, Object.values(item.defaults).some(Boolean)])),
  });

  const [privacyPrefs, setPrivacyPrefs] = useState({ publicProfile: true, twoFactor: false });

  // Số lượng kênh thông báo đang bật
  const activeChannelCount = useMemo(
    () => Object.values(notificationPrefs.channels).filter(Boolean).length,
    [notificationPrefs.channels],
  );

  // Xử lý lưu cài đặt
  const handleSave = () => {
    // Gọi API lưu ở đây
    setSavedMessage('Đã lưu các thay đổi thành công!');
    // Xóa thông báo sau 3 giây
    setTimeout(() => setSavedMessage(''), 3000);
  }
  const toggleChannel = (id) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      channels: { ...prev.channels, [id]: !prev.channels[id] },
    }));
  };

  const toggleType = (id) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      types: { ...prev.types, [id]: !prev.types[id] },
    }));
  };

  const togglePrivacy = (key) => {
    setPrivacyPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Lấy tiêu đề tab hiện tại
  const currentTabLabel = navConfig.find(item => item.id === activeTab)?.label || 'Cài đặt';

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      <Sidebar />

      <div className="flex-grow-1 p-0 overflow-auto" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />

        <div className="container-fluid px-4 py-4">
          <div className="row g-4">
            <div className="col-12 col-md-4 col-lg-3">
              <div className="card border-0 rounded-4 p-4 mb-3" style={{ backgroundColor: '#111827' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, backgroundColor: '#1f2937' }}>
                    <span className="text-white fs-5 fw-semibold">{SETTINGS_DATA.user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                  </div>
                  <div>
                    <h6 className="text-white mb-1">{SETTINGS_DATA.user.name}</h6>
                    <p className="text-white-50 mb-1 small">{SETTINGS_DATA.user.email}</p>
                    <span className="badge rounded-pill" style={{ backgroundColor: '#0f766e', color: '#d1fae5' }}>Gói Pro đang hoạt động</span>
                  </div>
                </div>
              </div>

              <div className="card border-0 rounded-4 p-2" style={{ backgroundColor: '#111827' }}>
                <p className="text-white-50 small fw-bold px-3 pt-2 mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>Danh mục</p>
                {navConfig.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`btn w-100 text-start rounded-4 mb-2 px-3 py-3 d-flex align-items-center gap-3 ${isActive ? 'text-success' : 'text-white-50'}`}
                      style={{
                        border: isActive ? '1px solid rgba(26, 174, 136, 0.25)' : '1px solid transparent',
                        backgroundColor: isActive ? '#1a3a2a' : 'transparent',
                      }}
                    >
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: 34,
                          height: 34,
                          backgroundColor: isActive ? '#0f766e' : '#111827',
                          color: isActive ? '#ffffff' : '#cbd5e1',
                        }}
                      >
                        <Icon size={18} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="mb-1">{item.label}</div>
                        <div className="small text-white-50" style={{ fontSize: '11px' }}>{item.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-12 col-md-8 col-lg-9">
              <div className="card border-0 rounded-4 p-4" style={{ backgroundColor: '#111827' }}>
                <div
                  className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-3"
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <div>
                    <h5 className="fw-semibold text-white mb-1">{currentTabLabel}</h5>
                    <p className="text-white-50 mb-0 small">Quản lý cài đặt cho {currentTabLabel.toLowerCase()}.</p>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    {savedMessage && <span className="text-emerald-400 small">{savedMessage}</span>}
                    <button type="button" className="btn btn-outline-light rounded-pill px-3 btn-sm text-white">
                      Hủy
                    </button>
                    <button type="button" onClick={handleSave} className="btn rounded-pill px-4 btn-success btn-sm d-flex align-items-center gap-2">
                      <Save size={16} />
                      Lưu thay đổi
                    </button>
                  </div>
                </div>

                {activeTab === 'billing' ? (
                  <BillingSettings />
                ) : activeTab === 'appearance' ? (
                  <AppearanceTab />
                ) : activeTab === 'notifications' ? (
                  <NotificationsTab
                    notificationPrefs={notificationPrefs}
                    toggleChannel={toggleChannel}
                    toggleType={toggleType}
                    activeChannelCount={activeChannelCount}
                  />
                ) : activeTab === 'privacy' ? (
                  <PrivacyTab privacyPrefs={privacyPrefs} togglePrivacy={togglePrivacy} />
                ) : (
                  <div className="text-center py-5">
                    <HelpCircle size={48} className="text-white-50 mb-3" />
                    <h6 className="text-white mb-1">{SETTINGS_DATA.support.title}</h6>
                    <p className="text-white-50 mb-4 small">{SETTINGS_DATA.support.description}</p>

                    <div className="row gx-3 gy-3 justify-content-center mb-4">
                      <div className="col-12 col-md-6">
                        <div className="rounded-4 p-3 text-white" style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div className="fw-semibold mb-2">Zalo</div>
                          <a href={SETTINGS_DATA.support.zaloLink} target="_blank" rel="noreferrer" className="small text-success text-decoration-none">{SETTINGS_DATA.support.zaloLink}</a>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="rounded-4 p-3 text-white" style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div className="d-flex flex-column align-items-center gap-3 mb-2">
                            <a href={SETTINGS_DATA.support.discordLink} target="_blank" rel="noreferrer" aria-label="Tham gia Discord" style={{ width: 120, height: 120, overflow: 'hidden', borderRadius: 24, backgroundColor: '#0f172a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              <video
                                src={discordVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </a>
                            <div className="fw-semibold">Discord</div>
                          </div>
                          <div>
                            <a href={SETTINGS_DATA.support.discordLink} target="_blank" rel="noreferrer" className="small text-success text-decoration-none">{SETTINGS_DATA.support.discordLink}</a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
                      <a href={SETTINGS_DATA.support.chatLink} className="btn btn-success rounded-pill px-4" target="_blank" rel="noreferrer">{SETTINGS_DATA.support.chatLabel}</a>
                      <a href={`mailto:${SETTINGS_DATA.support.email}`} className="btn btn-outline-light rounded-pill px-4 text-white">{SETTINGS_DATA.support.email}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;