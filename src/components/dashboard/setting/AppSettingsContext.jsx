import React, { createContext, useContext, useEffect, useState } from 'react';
import { ACCENT_COLORS, FONT_SIZES, LANGUAGES, TIMEZONES, DATE_FORMATS } from './themeOptions';

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [accentColor, setAccentColorState] = useState('green');
  const [fontSize, setFontSizeState] = useState('medium');
  const [language, setLanguageState] = useState('vi');
  const [timezone, setTimezoneState] = useState('Asia/Ho_Chi_Minh');
  const [dateFormat, setDateFormatState] = useState('dd/MM/yyyy');

  const translations = {
    vi: {
      'settings.title': 'Cài đặt',
      'settings.subtitle': 'Quản lý tài khoản, giao diện và bảo mật của bạn',
      'nav.billing.label': 'Gói & Thanh toán',
      'nav.billing.sub': 'Quản lý gói đăng ký, hoá đơn và sử dụng',
      'nav.appearance.label': 'Giao diện',
      'nav.appearance.sub': 'Theme, màu sắc, cỡ chữ',
      'nav.notifications.label': 'Thông báo',
      'nav.notifications.sub': 'Kênh, tần suất, loại thông báo',
      'nav.privacy.label': 'Quyền riêng tư & Bảo mật',
      'nav.privacy.sub': 'Hiển thị hồ sơ, 2FA, thiết bị, dữ liệu',
      'nav.support.label': 'Cần hỗ trợ?',
      'nav.support.sub': 'Liên hệ team hỗ trợ qua chat hoặc email',
    },
    en: {
      'settings.title': 'Settings',
      'settings.subtitle': 'Manage your account, appearance, and security',
      'nav.billing.label': 'Plan & Billing',
      'nav.billing.sub': 'Manage your subscription, invoices, and usage',
      'nav.appearance.label': 'Appearance',
      'nav.appearance.sub': 'Theme, colors, text size',
      'nav.notifications.label': 'Notifications',
      'nav.notifications.sub': 'Channels, frequency, notification types',
      'nav.privacy.label': 'Privacy & Security',
      'nav.privacy.sub': 'Public profile, 2FA, devices, data',
      'nav.support.label': 'Need help?',
      'nav.support.sub': 'Contact support via chat or email',
    },
  };

  const t = (key) => translations[language]?.[key] || translations.vi[key] || key;

  useEffect(() => {
    const color = ACCENT_COLORS.find((item) => item.id === accentColor) || ACCENT_COLORS[0];
    const size = FONT_SIZES.find((item) => item.id === fontSize) || FONT_SIZES[1];

    document.documentElement.style.setProperty('--accent', color.value);
    document.documentElement.style.setProperty('--accent-dark', color.dark);
    document.documentElement.style.setProperty('--app-font-size', `${size.value}px`);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.style.setProperty('--app-timezone', timezone);
    document.documentElement.style.setProperty('--app-date-format', dateFormat);
  }, [accentColor, fontSize, language, timezone, dateFormat]);

  const value = {
    accentColor,
    fontSize,
    language,
    timezone,
    dateFormat,
    setAccentColor: setAccentColorState,
    setFontSize: setFontSizeState,
    setLanguage: setLanguageState,
    setTimezone: setTimezoneState,
    setDateFormat: setDateFormatState,
    t,
    accentObj: ACCENT_COLORS.find((item) => item.id === accentColor) || ACCENT_COLORS[0],
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

// ─── 9. Hook tiện lợi ────────────────────────────────────────────────────────
export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used inside <AppSettingsProvider>');
  return ctx;
}