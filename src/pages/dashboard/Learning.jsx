// src/pages/Learning.jsx
import React from 'react';
import { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import FilterTabs from '../../components/dashboard/learning/FilterTabs';
import CourseGrid from '../../components/dashboard/learning/CourseGrid';
import { Button } from 'react-bootstrap';
import { FaFolderOpen, FaRoute } from 'react-icons/fa';

function Learning() {
  // 1. Quản lý State Tab đang được chọn (mặc định là 'all')
  const [activeTab, setActiveTab] = useState('all');

    const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'Tất cả',
    level: 'Tất cả',
    type: 'Tất cả loại'
  });

  // Hàm cập nhật động từng thuộc tính lọc riêng lẻ khi click nút
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  

  // 2. Mảng dữ liệu tổng (Sau này khi có API, bạn chỉ cần nạp dữ liệu vào State này)
  const [allCourses, setAllCourses] = useState([
    {
      id: 1,
      status: 'completed',
      type: '📹 Video',
      duration: '8h',
      category: 'Frontend',
      level: 'Beginner',
      title: 'HTML5 & CSS3 Mastery – Semantic & Modern Layout',
      description: 'Nắm vững HTML semantic, Flexbox, Grid layout và responsive design.',
      instructor: 'Nguyễn Văn Hùng',
      lessons: 42,
      students: 12400,
      rating: 4.9,
      progress: 0,
      tags: ['HTML', 'CSS', 'Flexbox'],
      imgBg: '#111827'
    },
    {
      id: 2,
      status: 'completed',
      type: '📹 Video',
      duration: '15h',
      category: 'Frontend',
      level: 'Intermediate',
      title: 'JavaScript ES2024 – Deep Dive từ cơ bản đến nâng cao',
      description: 'Event loop, closures, async/await, Proxy, modules và cấu trúc dữ liệu.',
      instructor: 'Trần Hoàng An',
      lessons: 78,
      students: 9600,
      rating: 4.8,
      progress: 0,
      tags: ['JavaScript', 'ES6+', 'Async'],
      isCodePreview: true,
      imgBg: '#064e3b'
    },
    {
      id: 3,
      status: 'learning',
      type: '⚙ Kết hợp',
      duration: '18h',
      category: 'CS Fundamentals',
      level: 'Intermediate',
      title: 'Data Structures & Algorithms với JavaScript',
      description: 'Arrays, LinkedList, Trees, Graphs, Dynamic Programming – giải 60+ LeetCode.',
      instructor: 'Phạm Đức Anh',
      lessons: 95,
      students: 6700,
      rating: 4.9,
      progress: 61,
      tags: ['DSA', 'Algorithms', 'Big-O'],
      imgBg: '#1e1b4b'
    },
    {
      id: 4,
      status: 'saved', // Đổi thử thành saved để kiểm tra bộ lọc tab Đã lưu
      isRegistered: false,
      type: '🛠 Project',
      duration: '20h',
      category: 'Frontend',
      level: 'Intermediate',
      title: 'React 19 – Hooks, Concurrent Mode & Performance',
      description: 'useTransition, Suspense, Server Components và xây dựng 3 Project thực tế.',
      instructor: 'Hoàng Tuấn Anh',
      lessons: 52,
      students: 8400,
      rating: 4.7,
      progress: 0,
      tags: ['React', 'TypeScript', 'Hooks'],
      imgBg: '#083344'
    }
  ]);

  

  // 3. Logic lọc danh sách khóa học theo Tab đang chọn
  const displayedCourses = allCourses.filter(course => {
    // Lọc theo Tab trạng thái (Đang học, hoàn thành...)
    if (activeTab !== 'all' && course.status !== activeTab) return false;

    // Lọc theo Ô tìm kiếm văn bản (Không phân biệt hoa thường)
    if (filters.searchQuery && !course.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) && !course.instructor.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;

    // Lọc theo Danh mục
    if (filters.category !== 'Tất cả' && course.category !== filters.category) return false;

    // Lọc theo Cấp độ / Độ khó
    if (filters.level !== 'Tất cả' && course.level !== filters.level) return false;

    // Lọc theo Loại bài học (Cần xử lý cắt bỏ icon chuỗi như "📹 Video" thành "Video" để so khớp)
    if (filters.type !== 'Tất cả loại') {
      const normalizedType = course.type.replace(/[^\w\s\dÀ-ỹ]/g, '').trim(); // Xóa icon biểu tượng cảm xúc
      if (!normalizedType.includes(filters.type)) return false;
    }

    return true;
  });

  // 4. Tự động tính toán số lượng số đếm khóa học động cho từng Tab badge
  const counts = allCourses.reduce((acc, course) => {
    acc[course.status] = (acc[course.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="d-flex" style={{ backgroundColor: '#020205', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <Sidebar />

      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />

        <div className="mb-4">
          <h3 className="fw-bold mb-1">Learning Hub</h3>
          <p className="text-white-50 small mb-3">Duyệt, lọc và đăng ký các khóa học theo lộ trình</p>
          
          <div className="d-flex gap-2 border-bottom border-secondary border-opacity-20 pb-3">
            <Button variant="light" className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-semibold btn-sm">
              <FaFolderOpen /> Kho Khóa Học
            </Button>
            <Button variant="transparent" className="d-flex align-items-center gap-2 text-white-50 rounded-3 px-3 py-2 btn-sm">
              <FaRoute /> Tech Path Map
            </Button>
          </div>
        </div>

 {/* 3. Truyền thêm State lọc và Hàm đổi bộ lọc vào Component con */}
        <FilterTabs 
          currentTab={activeTab} 
          onTabChange={setActiveTab} 
          totalCount={displayedCourses.length}
          tabCounts={counts}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <CourseGrid filteredCourses={displayedCourses} />

      </div>
    </div>
  );
}

export default Learning;