/**
 * DATA STORE: settingsData.js
 * Kho lưu trữ dữ liệu thô cho trang Cài đặt.
 * Mirrors cùng pattern với profileData.js để nhất quán cấu trúc dự án.
 */

export const SETTINGS_DATA = {

  // ─── Thông tin user (dùng cho SettingsCard - tương đương ProfileCard) ───
  user: {
    name: 'Minh Tú',
    email: 'nguyenvanan@gmail.com',
    role: 'Junior Developer',
    streak: 12,
    points: 2840,
    plan: 'Pro',
    planActive: true,
    avatar: null, // null = dùng initials fallback
  },

  // ─── Danh sách các tab điều hướng bên trong Settings ───
  settingsNav: [
    {
      id: 'billing',
      icon: '💳',
      label: 'Gói & Thanh toán',
      sub: 'Quản lý gói đăng ký, hoá đơn và sử dụng',
      badge: 'Pro',
    },
    {
      id: 'appearance',
      icon: '🎨',
      label: 'Giao diện',
      sub: 'Theme, màu sắc, cỡ chữ',
    },
    {
      id: 'notifications',
      icon: '🔔',
      label: 'Thông báo',
      sub: 'Kênh, tần suất, loại thông báo',
    },
    {
      id: 'privacy',
      icon: '🔒',
      label: 'Quyền riêng tư & Bảo mật',
      sub: 'Hiển thị hồ sơ, 2FA, thiết bị, dữ liệu',
    },
    {
      id: 'support',
      icon: '❓',
      label: 'Cần hỗ trợ?',
      sub: 'Liên hệ team hỗ trợ qua chat hoặc email',
      link: 'Mở chat hỗ trợ →',
    },
  ],

  // ─── Dữ liệu Thông báo ───
  notifications: {
    // 3 kênh nhận thông báo chính
    channels: [
      {
        id: 'inApp',
        icon: '🔔',
        label: 'Trong ứng dụng',
        desc: 'Hiển thị trong trang Thông báo',
        defaultEnabled: true,
      },
      {
        id: 'email',
        icon: '✉️',
        label: 'Email',
        desc: 'Gửi đến hộp thư của bạn',
        defaultEnabled: true,
      },
      {
        id: 'browser',
        icon: '🌐',
        label: 'Trình duyệt',
        desc: 'Push notification desktop/mobile',
        defaultEnabled: false,
      },
    ],

    // 8 loại thông báo với trạng thái mặc định cho từng kênh
    types: [
      {
        id: 'streak',
        emoji: '🔥',
        color: '#ff6b35',
        bgColor: 'rgba(255,107,53,0.12)',
        label: 'Streak & Mục tiêu',
        desc: 'Nhắc nhở giữ streak và đạt mục tiêu hàng ngày',
        defaults: { inApp: true, email: true, browser: true },
      },
      {
        id: 'jobs',
        emoji: '💼',
        color: '#10b981',
        bgColor: 'rgba(16,185,129,0.12)',
        label: 'Job Matches',
        desc: 'Thông báo khi có việc làm mới phù hợp kỹ năng',
        defaults: { inApp: true, email: true, browser: false },
      },
      {
        id: 'mentor',
        emoji: '👤',
        color: '#06b6d4',
        bgColor: 'rgba(6,182,212,0.12)',
        label: 'Mentor & Lịch hẹn',
        desc: 'Xác nhận, nhắc nhở và trả lời từ mentor',
        defaults: { inApp: true, email: true, browser: true },
      },
      {
        id: 'course',
        emoji: '📖',
        color: '#f59e0b',
        bgColor: 'rgba(245,158,11,0.12)',
        label: 'Khoá học mới',
        desc: 'Thông báo khi có khoá học mới phù hợp lộ trình',
        defaults: { inApp: true, email: false, browser: false },
      },
      {
        id: 'assessment',
        emoji: '📋',
        color: '#f43f5e',
        bgColor: 'rgba(244,63,94,0.12)',
        label: 'Assessment & Điểm số',
        desc: 'Kết quả kiểm tra và bài test mới mở',
        defaults: { inApp: true, email: true, browser: false },
      },
      {
        id: 'report',
        emoji: '📊',
        color: '#6b7280',
        bgColor: 'rgba(107,114,128,0.12)',
        label: 'Báo cáo tuần',
        desc: 'Tổng kết tiến độ học tập mỗi tuần',
        defaults: { inApp: true, email: true, browser: false },
      },
      {
        id: 'product',
        emoji: '✨',
        color: '#8b5cf6',
        bgColor: 'rgba(139,92,246,0.08)',
        label: 'Cập nhật sản phẩm',
        desc: 'Tính năng mới và thay đổi giao diện',
        defaults: { inApp: false, email: false, browser: false },
      },
      {
        id: 'promo',
        emoji: '🏷️',
        color: '#6b7280',
        bgColor: 'rgba(107,114,128,0.08)',
        label: 'Khuyến mãi',
        desc: 'Ưu đãi nâng cấp gói và chương trình đặc biệt',
        defaults: { inApp: false, email: false, browser: false },
      },
    ],
  },
};
