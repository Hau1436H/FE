// src/pages/Learning.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import FilterTabs from '../../components/dashboard/learning/learningFilter';
import CourseGrid from '../../components/dashboard/learning/CourseGrid';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFolderOpen, FaRoute } from 'react-icons/fa';

function Learning() {
  // 1. Quản lý State UI
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'Tất cả',
    level: 'Tất cả',
    type: 'Tất cả loại'
  });

  // 2. Quản lý State Dữ liệu (API)
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. GỌI API THẬT TỪ BACKEND
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const nodeId = 1; // Giả sử gọi tài nguyên của Node số 1 (Bạn có thể thay đổi sau)

        // Gọi Backend .NET với port 7196
        const response = await fetch(`https://localhost:7196/api/learning-hub/nodes/${nodeId}/resources`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Lỗi khi tải dữ liệu từ máy chủ');
        }

        // Map cấu trúc Database (SQL) sang cấu trúc Card UI của Frontend
        const mappedData = result.data.map(item => ({
          id: item.resourceId,
          title: item.title,
          description: item.description || "Nội dung chi tiết đang được cập nhật...",
          imgBg: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", // Ảnh mặc định
          type: item.resourceType || "Khác",
          duration: "2h 30m", // Dữ liệu giả lập cho UI hiển thị đẹp
          category: "Tech Path",
          level: item.difficultyLevel || "Beginner",
          instructor: item.provider || "TechCompass",
          lessons: 1,
          students: Math.floor(Math.random() * 5000) + 100, 
          rating: 4.8,
          progress: 0,
          tags: [item.resourceType, item.difficultyLevel].filter(Boolean),
          status: 'not-started', // Mặc định
          isRegistered: false
        }));

        setAllCourses(mappedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Hàm cập nhật động từng thuộc tính lọc riêng lẻ khi click nút
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // 4. Logic lọc danh sách khóa học
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

  // 5. Tự động tính toán số lượng số đếm khóa học động cho từng Tab badge
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

        {/* Xử lý hiển thị khi đang Load API hoặc gặp Lỗi */}
        {loading ? (
          <div className="text-center py-5 mt-5">
            <Spinner animation="border" variant="success" />
            <p className="text-white-50 mt-3">Đang tải tài nguyên học tập...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="m-3 text-center">
            {error}
          </Alert>
        ) : (
          <CourseGrid filteredCourses={displayedCourses} />
        )}
        
      </div>
    </div>
  );
}

export default Learning;