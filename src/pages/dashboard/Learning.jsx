// src/pages/Learning.jsx
import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import FilterTabs from '../../components/dashboard/learning/FilterTabs';
import CourseGrid from '../../components/dashboard/learning/CourseGrid';
import { Button } from 'react-bootstrap';
import { FaFolderOpen, FaRoute } from 'react-icons/fa';

function Learning() {
  return (
    <div className="d-flex" style={{ backgroundColor: '#020205', minHeight: '100vh',  minWidth: 0, fontFamily: 'system-ui' }}>
      {/* 1. Tái sử dụng Sidebar menu trái cố định */}
      <Sidebar />

      {/* 2. Vùng nội dung hiển thị chính tự cuộn bên phải */}
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh' }}>
        
        {/* Tái sử dụng thanh tìm kiếm và thông tin cá nhân trên cùng */}
        <DashboardHeader />

        {/* Khối Tiêu đề trang & Menu phụ (Kho khóa học / Tech Path Map) */}
        <div className="mb-4">
          <h3 className="fw-bold mb-1">Learning Hub</h3>
          <p className="text-white-50 small mb-2">Duyệt, lọc và đăng ký các khóa học theo lộ trình</p>
          
          <div className="d-flex gap-2 border-bottom border-secondary border-opacity-20 pb-3">
            <Button variant="light" className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-semibold btn-sm">
              <FaFolderOpen /> Kho Khóa Học
            </Button>
            <Button variant="transparent" className="d-flex align-items-center gap-2 text-white-50 rounded-3 px-3 py-2 btn-sm">
              <FaRoute /> Tech Path Map
            </Button>
          </div>
        </div>

        {/* 3. Gọi thanh bộ lọc trạng thái */}
        <FilterTabs />

        {/* 4. Gọi lưới danh sách hiển thị thẻ bài học */}
        <CourseGrid />

      </div>
    </div>
  );
}

export default Learning;
