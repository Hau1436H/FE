// src/components/learning/FilterTabs.jsx
import React, { useState } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { FaSlidersH } from 'react-icons/fa';

function FilterTabs({ 
  currentTab, onTabChange, totalCount, tabCounts,
  filters, onFilterChange 
}) {
  // State quản lý việc ẩn/hiện bảng bộ lọc nâng cao
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Mảng danh sách cấu trúc các nút bộ lọc nâng cao
  const categories = ['Tất cả', 'Frontend', 'Backend', 'CS Fundamentals', 'DevOps'];
  const levels = ['Tất cả', 'Beginner', 'Intermediate', 'Advanced'];
  const types = ['Tất cả loại', 'Video', 'Bài viết', 'Project', 'Kết hợp'];

  const tabs = [
    { id: 'all', text: 'Tất cả', count: totalCount },
    { id: 'learning', text: 'Đang học', count: tabCounts.learning || 0 },
    { id: 'completed', text: 'Hoàn thành', count: tabCounts.completed || 0 },
    { id: 'saved', text: 'Đã lưu', count: tabCounts.saved || 0 },
  ];

  return (
    <div className="mb-4">
      {/* Ô tìm kiếm, nút Lọc và nút Sắp xếp */}
      <div className="d-flex gap-3 mb-3">
        <div className="flex-grow-1">
          <Form.Control
            type="text"
            placeholder="Tìm khoá học, kỹ năng, giảng viên..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            className="border-0 text-white py-2 px-3 small rounded-3"
            style={{ backgroundColor: '#0f111a', fontSize: '14px', border: '1px solid #1e2235' }}
          />
        </div>

        {/* Nút bấm Đóng/Mở bảng bộ lọc nâng cao */}
        <Button 
          variant={showAdvancedFilters ? 'success' : 'outline-secondary'} 
          className={`d-flex align-items-center gap-2 rounded-3 px-3 ${showAdvancedFilters ? 'text-dark fw-bold' : 'text-white border-secondary'}`}
          style={showAdvancedFilters ? { backgroundColor: '#e6fcf5', color: '#0ca678 !important', border: '1px solid #0ca678' } : {}}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <FaSlidersH /> Lọc
        </Button>

        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" className="text-white border-secondary rounded-3 px-3">
            Phổ biến nhất
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item>Mới nhất</Dropdown.Item>
            <Dropdown.Item>Đánh giá cao</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* KHỐI BỘ LỌC NÂNG CAO (Chỉ hiển thị khi showAdvancedFilters = true) */}
      {showAdvancedFilters && (
        <div className="p-4 rounded-4 mb-4 transition-all" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
          <h6 className="fw-bold text-white mb-3" style={{ fontSize: '15px' }}>Bộ lọc</h6>
          
          <div className="d-flex flex-row flex-shrink-1 gap-3 small">
            {/* 1. Hàng Danh Mục */}
            <div>
              <div className="text-white-50 text-uppercase fw-bold mb-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Danh mục</div>
              {/* d-flex flex-wrap gap-2 giúp các nút tự động xếp hàng ngang và xuống dòng khi hết chỗ */}
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {categories.map(cat => (
                  <Button 
                    key={cat}
                    variant={filters.category === cat ? 'success' : 'secondary'}
                    className={`rounded-pill px-3 py-1 btn-sm border-0 ${filters.category === cat ? 'text-dark fw-semibold' : 'bg-secondary bg-opacity-10 text-white-50'}`}
                    style={filters.category === cat ? { backgroundColor: '#10b981' } : {}}
                    onClick={() => onFilterChange('category', cat)}
                  >
                    {cat} {/* ĐÃ SỬA: Đưa chữ hiển thị đầy đủ vào đây */}
                  </Button>
                ))}
              </div>
            </div>

            {/* 2. Hàng Độ Khó */}
            <div>
              <div className="text-white-50 text-uppercase fw-bold mb-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Độ khó</div>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {levels.map(lvl => (
                  <Button 
                    key={lvl}
                    variant={filters.level === lvl ? 'warning' : 'secondary'}
                    className={`rounded-pill px-3 py-1 btn-sm border-0 ${filters.level === lvl ? 'text-dark fw-semibold' : 'bg-secondary bg-opacity-10 text-white-50'}`}
                    style={filters.level === lvl ? { backgroundColor: '#f59e0b' } : {}}
                    onClick={() => onFilterChange('level', lvl)}
                  >
                    {lvl} {/* ĐÃ SỬA: Đưa chữ hiển thị đầy đủ vào đây */}
                  </Button>
                ))}
              </div>
            </div>

            {/* 3. Hàng Loại bài học */}
            <div>
              <div className="text-white-50 text-uppercase fw-bold mb-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Loại</div>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {types.map(typ => (
                  <Button 
                    key={typ}
                    variant={filters.type === typ ? 'warning' : 'secondary'}
                    className={`rounded-pill px-3 py-1 btn-sm border-0 ${filters.type === typ ? 'text-white fw-semibold' : 'bg-secondary bg-opacity-10 text-white-50'}`}
                    style={filters.type === typ ? { backgroundColor: '#f97316' } : {}}
                    onClick={() => onFilterChange('type', typ)}
                  >
                    {typ} {/* ĐÃ SỬA: Đưa chữ hiển thị đầy đủ vào đây */}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Danh sách các Tab trạng thái khóa học nằm dưới */}
      <div className="d-flex gap-2 align-items-center mb-2 flex-wrap">
        {tabs.map((tab) => {
          const isTargetActive = currentTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isTargetActive ? 'success' : 'transparent'}
              className={`rounded-3 px-3 py-1.5 border-0 small ${isTargetActive ? 'text-dark fw-semibold' : 'text-white-50'}`}
              style={isTargetActive ? { backgroundColor: '#10b981' } : {}}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.text}{" "}
              <span className={`badge ms-1 ${isTargetActive ? 'bg-dark text-success' : 'bg-secondary text-white-50'}`}>
                {tab.count}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterTabs;
