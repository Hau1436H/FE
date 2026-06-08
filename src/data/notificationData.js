export const NOTI_STATS = [
  { id: 1, icon: "bi bi-bell", count: "4", label: "Tổng thông báo", desc: "4 chưa đọc", bg: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" },
  { id: 2, icon: "bi bi-briefcase", count: "3", label: "Job Matches", desc: "Tuần này", bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" },
  { id: 3, icon: "bi bi-fire", count: "2", label: "Streak alerts", desc: "Chuẩn bị rớt học", bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" },
  { id: 4, icon: "bi bi-clock", count: "5", label: "Hoạt động hôm nay", desc: "+930 XP tổng", bg: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }
];

export const NOTIFICATIONS = [
  {
    id: 1,
    type: "streak",
    icon: "bi bi-fire",
    time: "34 phút trước",
    title: "Streak 21 ngày – Kỷ lục mới!",
    desc: "Bạn vừa đạt streak 21 ngày liên tiếp. Điều này đặt bạn vào top 5% học viên tích cực nhất tháng này!",
    tag: "Streak milestone",
    actionText: "Xem huy hiệu →",
    isRead: false
  },
  {
    id: 2,
    type: "job",
    icon: "bi bi-briefcase",
    time: "1 giờ trước",
    title: "Việc làm mới phù hợp 94%",
    desc: "Frontend Developer tại TechViet Corp – Remote, $1,200 - $1,800/tháng. Kỹ năng của bạn khớp 9/10 yêu cầu.",
    tag: "TechViet Corp",
    actionText: "Xem ngay →",
    isRead: false
  },
  {
    id: 3,
    type: "mentor",
    icon: "bi bi-person-check",
    time: "3 giờ trước",
    title: "Nguyễn Minh Tuấn đã trả lời",
    desc: "Mentor đã phản hồi câu hỏi của bạn về System Design: 'Bạn nên tìm hiểu thêm về CAP theorem...'",
    tag: "Senior Engineer | VNG",
    actionText: "Xem tin nhắn →",
    isRead: false
  },
  {
    id: 4,
    type: "course",
    icon: "bi bi-book",
    time: "4 giờ trước",
    title: "Khóa học mới: React 19 & Server Components",
    desc: "Khóa học mới vừa ra mắt phù hợp với lộ trình Frontend của bạn. 24 bài học, giảng viên Đặng Hoàng Nam.",
    tag: "Đặng Hoàng Nam",
    actionText: "Xem khoá học →",
    isRead: false
  },
  {
    id: 5,
    type: "assessment",
    icon: "bi bi-file-earmark-text",
    time: "8 giờ trước",
    title: "Kết quả Assessment: JavaScript Advanced",
    desc: "Điểm của bạn: 88/100 – Xuất sắc! Bạn đã vượt qua 76% học viên khác. Điểm mạnh: Closures & Event Loop.",
    tag: "88/100 điểm",
    actionText: "Xem chi tiết →",
    isRead: false
  }
];

export const ACTIVITIES = [
  {
    id: 1,
    type: "streak",
    icon: "bi bi-fire",
    time: "34 phút trước",
    title: "Streak 21 ngày!",
    desc: "Đạt mốc streak 21 ngày liên tiếp — Top 5% học viên tích cực",
    tag: "Streak",
    subTag: "Kỷ lục mới",
    xp: "+160 XP"
  },
  {
    id: 2,
    type: "coding",
    icon: "bi bi-code-slash",
    time: "2 giờ trước",
    title: "Giải bài Two Sum",
    desc: "Hoàn thành bài Two Sum (Easy) với runtime 72ms, tốt hơn 89% bài nộp",
    tag: "Coding",
    subTag: "Easy",
    xp: "+50 XP"
  },
  {
    id: 3,
    type: "course",
    icon: "bi bi-book",
    time: "4 giờ trước",
    title: "Hoàn thành bài học",
    desc: "TypeScript Advanced — Generics & Conditional Types (45 phút)",
    tag: "Bài học",
    subTag: "TypeScript",
    xp: "+30 XP"
  },
  {
    id: 4,
    type: "assessment",
    icon: "bi bi-file-earmark-text",
    time: "8 giờ trước",
    title: "Hoàn thành Assessment",
    desc: "JavaScript Advanced — Đạt 88/100 điểm, cải thiện +12 so với lần trước",
    tag: "Kiểm tra",
    subTag: "88/100",
    xp: "+120 XP"
  }
];
