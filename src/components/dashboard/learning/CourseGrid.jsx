// src/components/learning/CourseGrid.jsx
import React from 'react';
import CourseCard from './CourseCard';

function CourseGrid({ filteredCourses }) {
  return (
    <div className="row g-4">
      {filteredCourses.map((course) => (
        <div className="col-12 col-md-6 col-xl-4" key={course.id}>
          <CourseCard course={course} />
        </div>
      ))}

      {/* Hiển thị thông báo nếu không tìm thấy khóa học nào phù hợp bộ lọc */}
      {filteredCourses.length === 0 && (
        <div className="col-12 text-center py-5">
          <h5 className="text-muted">Không tìm thấy khóa học nào ở danh mục này.</h5>
        </div>
      )}
    </div>
  );
}

export default CourseGrid;
