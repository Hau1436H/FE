// src/pages/Learning.jsx
import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import FilterTabs from '../../components/dashboard/learning/learningFilter';
import CourseGrid from '../../components/dashboard/learning/CourseGrid';
import { Button } from 'react-bootstrap';
import { FaFolderOpen, FaRoute } from 'react-icons/fa';
import { INITIAL_COURSES } from '../../data/coursesData';

function Learning() {
  // 1. Quản lý State
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'Tất cả',
    level: 'Tất cả',
    type: 'Tất cả loại'
  });

  // Nạp dữ liệu từ file tách riêng vào State ban đầu
  const [allCourses, setAllCourses] = useState(INITIAL_COURSES);

  // Hàm cập nhật động từng thuộc tính lọc riêng lẻ khi click nút
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // 3. Logic lọc danh sách khóa học theo Tab đang chọn
  const displayedCourses = allCourses.filter(course => {
    if (activeTab !== 'all' && course.status !== activeTab) return false;

    if (filters.searchQuery && 
        !course.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !course.instructor.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }

    if (filters.category !== 'Tất cả' && course.category !== filters.category) return false;

    if (filters.level !== 'Tất cả' && course.level !== filters.level) return false;

    if (filters.type !== 'Tất cả loại') {
      const normalizedType = course.type.replace(/[^\w\s\dÀ-ỹ]/g, '').trim();
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
