import React from 'react';
import { Form, Dropdown } from 'react-bootstrap';

function MentorFilters({ filters, onFilterChange }) {
  const specializations = [
    'Frontend', 'Backend', 'React', 'TypeScript', 
    'System Design', 'DevOps', 'Data Engineering', 
    'Career Path', 'Interview Prep'
  ];

  const ratings = [
    { label: 'Tất cả', value: 'all' },
    { label: '4★+', value: '4' },
    { label: '4.5★+', value: '4.5' },
    { label: '4.8★+', value: '4.8' }
  ];

  return (
    <div className="mb-4">
      {/* 1. Ô tìm kiếm và Dropdown Sắp xếp nằm ngang hàng */}
      <div className="d-flex gap-3 mb-4">
        <div className="flex-grow-1">
          <Form.Control
            type="text"
            placeholder="🔍 Tìm mentor theo tên, chuyên môn..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="border-0 text-white py-2 px-3 small rounded-3"
            style={{ backgroundColor: '#0f111a', fontSize: '14px', border: '1px solid #1e2235' }}
          />
        </div>
        <Dropdown>
          <Dropdown.Toggle 
            variant="outline-secondary" 
            className="text-white border-secondary rounded-3 px-3"
            style={{ fontSize: '14px' }}
          >
            Đánh giá cao nhất
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item onClick={() => onFilterChange('sortBy', 'rating')}>Đánh giá cao nhất</Dropdown.Item>
            <Dropdown.Item onClick={() => onFilterChange('sortBy', 'students')}>Học viên đông nhất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 2. Khối chứa bộ lọc Chuyên môn và Đánh giá tối thiểu */}
      <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
        <div className="row g-4">
          
          {/* Cột Trái: CHUYÊN MÔN (Xếp dạng d-flex flex-wrap nha) */}
          <div className="col-12 col-md-7">
            <div className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
              CHUYÊN MÔN
            </div>
            <div className="d-flex flex-wrap gap-2">
              {specializations.map(spec => {
                const isSelected = filters.specialization === spec;
                return (
                  <button
                    key={spec}
                    type="button"
                    className="btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 transition-all"
                    style={{
                      backgroundColor: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#fff' : '#a0aec0',
                      fontSize: '12.5px'
                    }}
                    onClick={() => onFilterChange('specialization', isSelected ? 'all' : spec)}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cột Phải: ĐÁNH GIÁ TỐI THIỂU (Đúng màu Cam chuẩn ảnh mẫu) */}
          <div className="col-12 col-md-5">
            <div className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
              ĐÁNH GIÁ TỐI THIỂU: <span style={{ color: '#f59e0b' }}>{filters.minRating === 'all' ? 'TẤT CẢ' : `${filters.minRating}★+`}</span>
            </div>
            <div className="d-flex flex-wrap gap-3 align-items-center">
              {ratings.map(r => {
                const isSelected = filters.minRating === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    className="btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 transition-all"
                    style={{
                      // Nếu chọn thì ra màu cam rực theo ảnh, ngược lại thì trong suốt
                      backgroundColor: isSelected ? '#f59e0b' : 'transparent',
                      color: isSelected ? '#000' : 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12.5px'
                    }}
                    onClick={() => onFilterChange('minRating', r.value)}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MentorFilters;
