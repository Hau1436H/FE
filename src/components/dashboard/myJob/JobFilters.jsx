import React, { useState } from 'react';
import { Form, Dropdown } from 'react-bootstrap';

function JobFilters({ 
  currentTab, onTabChange, totalCount, tabCounts,
  filters, onFilterChange 
}) {
  const [showAdvancedFilters] = useState(true); // Luôn mở mặc định đồng bộ với Mentor

  const jobTypes = ['Tất cả', 'Remote', 'Hybrid', 'Onsite', 'Part-time'];
  const jobLevels = ['Tất cả', 'Junior', 'Mid-level', 'Senior'];
  const skillsList = ['JavaScript', 'React', 'TypeScript', 'Node.js', 'HTML5', 'CSS3', 'Git', 'Vue.js', 'Python'];

  const tabs = [
    { id: 'all', text: 'Tất cả việc làm', count: totalCount },
    { id: 'matched', text: 'Phù hợp cao', count: tabCounts.matched || 0 },
    { id: 'applied', text: 'Mới ứng tuyển', count: tabCounts.applied || 0 },
  ];

  return (
    <div className="mb-4">
      {/* 1. Ô tìm kiếm và Dropdown Sắp xếp nằm ngang hàng */}
      <div className="d-flex gap-3 mb-4">
        <div className="flex-grow-1 position-relative">
          <Form.Control
            type="text"
            placeholder="🔍 Tìm công ty, vị trí, kỹ năng..."
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
            Match % cao nhất
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item onClick={() => onFilterChange('sortBy', 'match')}>Match % cao nhất</Dropdown.Item>
            <Dropdown.Item onClick={() => onFilterChange('sortBy', 'newest')}>Mới nhất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 2. Khối chứa bộ lọc nâng cao đồng bộ cấu trúc với MentorFilters */}
      {showAdvancedFilters && (
        <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
          <div className="row g-4 mb-4">
            
            {/* Cột Trái: HÌNH THỨC LÀM VIỆC */}
            <div className="col-12 col-md-4">
              <div className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                HÌNH THỨC LÀM VIỆC
              </div>
              <div className="d-flex flex-wrap gap-2">
                {jobTypes.map(t => {
                  const isSelected = filters.type === t;
                  return (
                    <button 
                      key={t}
                      type="button"
                      className="btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 transition-all"
                      style={{ 
                        backgroundColor: isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.05)', 
                        color: isSelected ? '#000' : '#a0aec0',
                        fontSize: '12.5px'
                      }}
                      onClick={() => onFilterChange('type', t)}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cột Giữa: CẤP ĐỘ (Đổi sang tông màu Cam đồng điệu Mentor) */}
            <div className="col-12 col-md-4">
              <div className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                CẤP ĐỘ
              </div>
              <div className="d-flex flex-wrap gap-2">
                {jobLevels.map(l => {
                  const isSelected = filters.level === l;
                  return (
                    <button 
                      key={l}
                      type="button"
                      className="btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 transition-all"
                      style={{ 
                        backgroundColor: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.05)', 
                        color: isSelected ? '#000' : '#a0aec0',
                        fontSize: '12.5px'
                      }}
                      onClick={() => onFilterChange('level', l)}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cột Phải: MATCH TỐI THIỂU */}
            <div className="col-12 col-md-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-white-50 text-uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  MATCH TỐI THIỂU: <span style={{ color: '#10b981' }}>{filters.minMatch}%</span>
                </span>
              </div>
              <div className="px-1">
                <Form.Range 
                  min="0" 
                  max="90" 
                  step="10"
                  value={filters.minMatch}
                  onChange={(e) => onFilterChange('minMatch', parseInt(e.target.value))}
                  className="custom-range-slider"
                />
                <div className="d-flex justify-content-between text-white-50 mt-1" style={{ fontSize: '10px' }}>
                  <span>0%</span>
                  <span>50%</span>
                  <span>90%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Hàng Dưới: LỌC THEO KỸ NĂNG (Giống hàng Chuyên Môn của Mentor) */}
          <div className="pt-4 border-top border-secondary border-opacity-10">
            <div className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
              LỌC THEO KỸ NĂNG
            </div>
            <div className="d-flex flex-wrap gap-2">
              {skillsList.map(skill => {
                const isSelected = filters.skills.includes(skill);
                return (
                  <button 
                    key={skill}
                    type="button"
                    className="btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 transition-all"
                    style={{ 
                      backgroundColor: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)', 
                      color: isSelected ? '#fff' : '#a0aec0',
                      fontSize: '12.5px'
                    }}
                    onClick={() => {
                      const nextSkills = isSelected 
                        ? filters.skills.filter(s => s !== skill) 
                        : [...filters.skills, skill];
                      onFilterChange('skills', nextSkills);
                    }}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Danh sách các Tab trạng thái (Nằm dưới cùng của khối Filter) */}
      <div className="d-flex gap-2 align-items-center mb-2 flex-wrap">
        {tabs.map((tab) => {
          const isTargetActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`btn btn-sm rounded-3 px-3 py-1.5 border-0 small transition-all ${isTargetActive ? 'text-dark fw-semibold' : 'text-white-50'}`}
              style={{ backgroundColor: isTargetActive ? '#10b981' : 'transparent', fontSize: '13px' }}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.text}{" "}
              <span className={`badge ms-1 ${isTargetActive ? 'bg-dark text-success' : 'bg-secondary text-white-50'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default JobFilters;
