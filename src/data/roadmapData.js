// .\src\data\roadmapData.js

// Hàm tự động tạo lộ trình cá nhân hóa dựa trên điểm số của user
export const generateRoadmapByScore = (score, total = 3) => {
  const percent = total > 0 ? (score / total) * 100 : 0;

  // 1. Nếu điểm thấp (0-1 câu đúng): Tập trung lấy lại căn bản core
  if (percent <= 40) {
    return [
      {
        id: "phase-1",
        title: "Củng Cố Nền Tảng Javascript & DOM",
        duration: "2 tuần",
        level: "Beginner",
        status: "learning", // Trạng thái: 'learning', 'locked', 'completed'
        description: "Ôn tập sâu về Callback, Promise, Async/Await và cách JS xử lý bất đồng bộ trước khi học Framework.",
        topics: ["ES6+ Syntax", "Event Loop", "Fetch API & DOM Manipulation"]
      },
      {
        id: "phase-2",
        title: "React Core Cơ Bản & State Management",
        duration: "3 tuần",
        level: "Intermediate",
        status: "locked",
        description: "Làm quen với các React Hook cơ bản như useState, useEffect và luồng dữ liệu một chiều.",
        topics: ["Component Lifecycle", "Props & State", "Handling Events"]
      },
      {
        id: "phase-3",
        title: "Xây Dựng Dự Án Thực Chiến Với Axios",
        duration: "3 tuần",
        level: "Advanced",
        status: "locked",
        description: "Kết nối API, quản lý token bảo mật, xử lý lỗi trung gian (Interceptors) với Axios Client.",
        topics: ["Axios Integration", "Authentication Flow", "Error Handling"]
      }
    ];
  }

  // 2. Nếu điểm trung bình (2 câu đúng): Tập trung thực chiến dự án và tối ưu nâng cao
  if (percent <= 70) {
    return [
      {
        id: "phase-1",
        title: "Javascript & ES6 Fundamentals",
        duration: "1 tuần",
        level: "Beginner",
        status: "completed", // Đã nắm chắc nên đánh dấu hoàn thành
        description: "Kiến thức nền tảng về mảng, đối tượng và cú pháp ES6.",
        topics: ["Array Methods", "Destructuring", "Arrow Functions"]
      },
      {
        id: "phase-2",
        title: "Tối Ưu React Hooks & Custom Hooks",
        duration: "3 tuần",
        level: "Intermediate",
        status: "learning", // Đang cần bổ sung phần này
        description: "Đi sâu vào tối ưu hiệu năng với useMemo, useCallback và viết các Custom Hooks để tái sử dụng logic.",
        topics: ["useMemo & useCallback", "Custom Hooks", "Context API"]
      },
      {
        id: "phase-3",
        title: "Cấu Trúc Hệ Thống & Quản Lý Dự Án Lớn",
        duration: "4 tuần",
        level: "Advanced",
        status: "locked",
        description: "Tổ chức source code chuẩn hóa, triển khai Middleware bảo mật và tối ưu hóa UI/UX bằng Bootstrap.",
        topics: ["Clean Architecture", "Performance Profiling", "Responsive UI Design"]
      }
    ];
  }

  // 3. Nếu điểm tối đa (3 câu đúng): Đưa thẳng lên lộ trình nâng cao và sẵn sàng đi làm
  return [
    {
      id: "phase-1",
      title: "React & Axios Standard Core",
      duration: "1 tuần",
      level: "Intermediate",
      status: "completed",
      description: "Hệ thống hóa toàn bộ kiến thức nâng cấp giao diện và tích hợp dữ liệu bất đồng bộ.",
      topics: ["React 19 Core", "Axios Interceptors", "Form Validation"]
    },
    {
      id: "phase-2",
      title: "Chuyên Sâu Kiến Trúc Phần Mềm & NextJS",
      duration: "3 tuần",
      level: "Advanced",
      status: "learning",
      description: "Tiếp cận mô hình Server Side Rendering (SSR) và kiến trúc tối ưu SEO của các dự án thực tế.",
      topics: ["Server Component", "Dynamic Routing", "SEO Optimization"]
    },
    {
      id: "phase-3",
      title: "Luyện Phỏng Vấn & Thiết Kế Portfolio Độc Quyền",
      duration: "2 tuần",
      level: "Expert",
      status: "locked",
      description: "Mô phỏng quy trình phỏng vấn chuyên sâu cùng AI, tinh chỉnh portfolio đạt chuẩn tuyển dụng.",
      topics: ["Mock Interview", "System Design", "Portfolio Review"]
    }
  ];
};