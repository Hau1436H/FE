export const ADMIN_METRICS = [
  {
    id: 'users',
    title: 'Người dùng đăng ký',
    value: '12.480',
    subtitle: '+8.2% so với tuần trước',
    icon: 'FaUsers',
    color: '#38bdf8',
    bg: '#0f172a'
  },
  {
    id: 'courses',
    title: 'Khoá học',
    value: '68',
    subtitle: '+5 khoá mới',
    icon: 'FaBookOpen',
    color: '#7c3aed',
    bg: '#1f0f3f'
  },
  {
    id: 'newAccounts',
    title: 'Tài khoản mới',
    value: '412',
    subtitle: 'Số đăng ký trong 30 ngày',
    icon: 'FaUserPlus',
    color: '#22c55e',
    bg: '#0f2f1e'
  },
  {
    id: 'lessons',
    title: 'Bài học',
    value: '1.280',
    subtitle: 'Bài học hoàn thành',
    icon: 'FaChalkboardTeacher',
    color: '#f59e0b',
    bg: '#312905'
  },
  {
    id: 'revenue',
    title: 'Doanh thu',
    value: '₫1,245,000,000',
    subtitle: 'Tháng trước',
    icon: 'FaDollarSign',
    color: '#10b981',
    bg: '#052e18'
  },
  {
    id: 'activity',
    title: 'Hoạt động hệ thống',
    value: '9.2k',
    subtitle: 'Phiên & tương tác',
    icon: 'FaChartLine',
    color: '#f97316',
    bg: '#2a1202'
  }
];

export const REVENUE_TREND = [
  { period: 'T1', revenue: 740, accounts: 85 },
  { period: 'T2', revenue: 920, accounts: 122 },
  { period: 'T3', revenue: 1040, accounts: 156 },
  { period: 'T4', revenue: 980, accounts: 140 },
  { period: 'T5', revenue: 1130, accounts: 185 },
  { period: 'T6', revenue: 1290, accounts: 210 }
];

export const ACTIVITY_FEED = [
  { id: 1, title: 'Khởi chạy chiến dịch email', desc: 'Gửi 14.200 email mời học viên mới đăng ký khoá học.', time: '1 giờ trước' },
  { id: 2, title: 'Cập nhật nội dung khoá React', desc: 'Thêm 5 bài học mới vào khoá React 19.', time: '2 giờ trước' },
  { id: 3, title: 'Tăng tốc API học viên', desc: 'Giảm thời gian tải trang quản trị xuống 18%.', time: '4 giờ trước' },
  { id: 4, title: 'Báo cáo doanh thu', desc: 'Doanh thu tháng này tăng 12% so với tháng trước.', time: '6 giờ trước' }
];
