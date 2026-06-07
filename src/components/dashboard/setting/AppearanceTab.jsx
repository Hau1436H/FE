import React from 'react';
import { ACCENT_COLORS, DATE_FORMATS, FONT_SIZES, LANGUAGES, TIMEZONES } from './themeOptions';
import { useAppSettings } from './AppSettingsContext';

function AppearanceTab() {
  const {
    accentColor,
    fontSize,
    language,
    timezone,
    dateFormat,
    setAccentColor,
    setFontSize,
    setLanguage,
    setTimezone,
    setDateFormat,
  } = useAppSettings();

  return (
    <div className="card border-0 rounded-4 p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <h5 className="text-white mb-1">Giao diện & Chủ đề</h5>
      <p className="text-white-50 small mb-4">Chọn màu sắc, cỡ chữ và các tùy chọn hiển thị cho toàn bộ website.</p>

      <div className="mb-4">
        <div className="text-white fw-semibold mb-2">Màu accent</div>
        <div className="d-flex flex-wrap gap-3">
          {ACCENT_COLORS.map((color) => {
            const active = accentColor === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setAccentColor(color.id)}
                className="btn btn-link p-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 42, height: 42, backgroundColor: color.value, boxShadow: active ? '0 0 0 3px rgba(255,255,255,0.18)' : '0 0 0 1px rgba(255,255,255,0.08)' }}
                aria-label={color.label}
              >
                {active ? <span className="text-white fw-bold">✓</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-white fw-semibold mb-2">Cỡ chữ</div>
        <div className="d-flex flex-wrap gap-2">
          {FONT_SIZES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFontSize(option.id)}
              className={`btn btn-sm rounded-pill ${fontSize === option.id ? 'btn-light text-dark' : 'btn-outline-light'}`}
            >
              {option.label} ({option.value}px)
            </button>
          ))}
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label text-white small">Ngôn ngữ</label>
          <select className="form-select bg-transparent text-white border-secondary" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGES.map((item) => <option key={item.id} value={item.id} className="text-dark">{item.label}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label text-white small">Múi giờ</label>
          <select className="form-select bg-transparent text-white border-secondary" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {TIMEZONES.map((item) => <option key={item.id} value={item.id} className="text-dark">{item.label}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label text-white small">Định dạng ngày</label>
          <select className="form-select bg-transparent text-white border-secondary" value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            {DATE_FORMATS.map((item) => <option key={item.id} value={item.id} className="text-dark">{item.label}</option>)}
          </select>
        </div>
      </div>

      <div className="text-white-50 small">Các thiết lập này sẽ áp dụng cho toàn bộ giao diện và các thành phần chính của ứng dụng.</div>
    </div>
  );
}

export default AppearanceTab;
