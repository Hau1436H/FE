import React from 'react';
import { SETTINGS_DATA } from '../../../data/settingsData';

function NotificationsTab({ notificationPrefs, toggleChannel, toggleType, activeChannelCount }) {
  return (
    <div className="card border-0 rounded-4 p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <h5 className="text-white mb-1">Thông báo</h5>
      <p className="text-white-50 small mb-4">Điều chỉnh kênh, tần suất và loại thông báo bạn muốn nhận.</p>

      <div className="row g-3 mb-4">
        {SETTINGS_DATA.notifications.channels.map((channel) => (
          <div key={channel.id} className="col-12 col-md-6 col-xl-4">
            <div className="rounded-4 p-3 border h-100" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="d-flex align-items-center justify-content-between mb-2 gap-2">
                <strong className="text-white">{channel.icon} {channel.label}</strong>
                <button
                  type="button"
                  onClick={() => toggleChannel(channel.id)}
                  className={`btn btn-sm rounded-pill ${notificationPrefs.channels[channel.id] ? 'btn-success' : 'btn-outline-light'}`}
                >
                  {notificationPrefs.channels[channel.id] ? 'Bật' : 'Tắt'}
                </button>
              </div>
              <p className="text-white-50 small mb-0">{channel.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="d-grid gap-3">
        {SETTINGS_DATA.notifications.types.map((type) => (
          <div key={type.id} className="rounded-4 p-3 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
              <div>
                <strong className="text-white">{type.emoji} {type.label}</strong>
                <p className="text-white-50 small mb-0">{type.desc}</p>
              </div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => toggleType(type.id)}
                  className={`btn btn-sm rounded-pill ${notificationPrefs.types[type.id] ? 'btn-success' : 'btn-outline-light'}`}
                >
                  {notificationPrefs.types[type.id] ? 'Đang bật' : 'Tắt'}
                </button>
                <span className="badge rounded-pill text-white" style={{ background: type.color }}>
                  {Object.entries(type.defaults).filter(([, enabled]) => enabled).length} kênh
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-white-50 small mt-3 mb-0">Đang bật {activeChannelCount} kênh thông báo và {Object.values(notificationPrefs.types).filter(Boolean).length} loại thông báo.</p>
    </div>
  );
}

export default NotificationsTab;
