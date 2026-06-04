// src/components/dashboard/learning/FilterTabs.jsx
import React from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { FaSlidersH } from 'react-icons/fa';

function FilterTabs() {
  const tabs = [
    { id: 'all', text: 'Tất cả', count: 12, active: true },
    { id: 'learning', text: 'Đang học', count: 1 },
    { id: 'completed', text: 'Hoàn thành', count: 2 },
    { id: 'saved', text: 'Đã lưu', count: 2 },
  ];

  return (
    <div className="mb-4">
      {/* Ô tìm kiếm nội bộ khóa học */}
      <div className="d-flex gap-3 mb-3">
        <div className="flex-grow-1">
          <Form.Control
            type="text"
            placeholder="Tìm khóa học, kỹ năng, giảng viên..."
            className="border-0 text-white py-2 px-3 small rounded-3"
            style={{ backgroundColor: '#0f111a', fontSize: '14px', border: '1px solid #1e2235' }}
          />
        </div>
        <Button variant="outline-secondary" className="d-flex align-items-center gap-2 border-secondary text-white rounded-3 px-3">
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

      {/* Danh sách các Tab trạng thái */}
      <div className="d-flex gap-2 align-items-center mb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={tab.active ? 'success' : 'transparent'}
            className={`rounded-3 px-3 py-1.5 border-0 small ${tab.active ? 'text-dark fw-semibold' : 'text-white-50'}`}
            style={tab.active ? { backgroundColor: '#10b981' } : {}}
          >
            {tab.text} <span className={`badge ms-1 ${tab.active ? 'bg-dark text-success' : 'bg-secondary text-white-50'}`}>{tab.count}</span>
          </Button>
        ))}
        <span className="text-muted small ms-auto" style={{ fontSize: '13px' }}>Hiển thị 12 khóa học</span>
      </div>
    </div>
  );
}

export default FilterTabs;
