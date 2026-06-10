import React, { useMemo, useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAppSettings } from '../../components/dashboard/setting/AppSettingsContext';
import AppearanceTab from '../../components/dashboard/setting/AppearanceTab';
import NotificationsTab from '../../components/dashboard/setting/NotificationsTab';
import PrivacyTab from '../../components/dashboard/setting/PrivacyTab';
import BillingSettings from '../../components/dashboard/setting/BillingSettings';
import { SETTINGS_DATA } from '../../data/settingsData';

function Settings() {
  const [activeTab, setActiveTab] = useState('appearance');
  const [savedMessage, setSavedMessage] = useState('');
  const { t } = useAppSettings();

  const [notificationPrefs, setNotificationPrefs] = useState({
    channels: Object.fromEntries(SETTINGS_DATA.notifications.channels.map((item) => [item.id, item.defaultEnabled])),
    types: Object.fromEntries(SETTINGS_DATA.notifications.types.map((item) => [item.id, Object.values(item.defaults).some(Boolean)])),
  });
  const [privacyPrefs, setPrivacyPrefs] = useState({ publicProfile: true, twoFactor: false });

  const activeChannelCount = useMemo(
    () => Object.values(notificationPrefs.channels).filter(Boolean).length,
    [notificationPrefs.channels],
  );

  const navItems = SETTINGS_DATA.settingsNav.map((item) => ({
    ...item,
    label: t(`nav.${item.id}.label`) || item.label,
    sub: t(`nav.${item.id}.sub`) || item.sub,
  }));

  const handleSave = () => {
    setSavedMessage('Đã lưu cài đặt thành công.');
  };

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

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      <Sidebar />

      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />

        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>

          {/* 2b. Tiêu đề trang */}
          <div className="mb-3">
            <h4 className="fw-bold text-white mb-1">{t('settings.title')}</h4>
            <p className="text-white-50 mb-0" style={{ fontSize: 13 }}>
              {t('settings.subtitle')}
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
            <div className="col-12 col-md-4 col-lg-3">
              <div className="card border-0 rounded-4 p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {navItems.map((item) => (
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
                      <span className="fw-semibold">{item.label}</span>
                      {item.badge ? <span className="badge rounded-pill bg-light text-dark">{item.badge}</span> : null}
                    </div>
                    <div className="small text-white-50 mt-1">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="col-12 col-md-8 col-lg-9">
              {activeTab === 'appearance' ? (
                <>
                  <AppearanceTab />
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
                    <button type="button" onClick={handleSave} className="btn btn-success rounded-pill px-4">Lưu cài đặt</button>
                    {savedMessage ? <span className="text-success small">{savedMessage}</span> : null}
                  </div>
                </>
              ) : activeTab === 'notifications' ? (
                <>
                  <NotificationsTab notificationPrefs={notificationPrefs} toggleChannel={toggleChannel} toggleType={toggleType} activeChannelCount={activeChannelCount} />
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
                    <button type="button" onClick={handleSave} className="btn btn-success rounded-pill px-4">Lưu cài đặt</button>
                    {savedMessage ? <span className="text-success small">{savedMessage}</span> : null}
                  </div>
                </>
              ) : activeTab === 'privacy' ? (
                <>
                  <PrivacyTab privacyPrefs={privacyPrefs} togglePrivacy={togglePrivacy} />
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
                    <button type="button" onClick={handleSave} className="btn btn-success rounded-pill px-4">Lưu cài đặt</button>
                    {savedMessage ? <span className="text-success small">{savedMessage}</span> : null}
                  </div>
                </>
              ) : activeTab === 'billing' ? (
                <BillingSettings />
              ) : (
                <div className="card border-0 rounded-4 p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
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