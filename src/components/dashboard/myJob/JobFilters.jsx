import React, { useState } from 'react';
import { Form, Dropdown } from 'react-bootstrap';

function JobFilters({ 
  currentTab, onTabChange, totalCount = 0, tabCounts = {},
  filters = {}, onFilterChange 
}) {
  const [showAdvancedFilters] = useState(true);

  const jobTypes = ['Tất cả', 'Remote', 'Hybrid', 'Onsite', 'Part-time'];
  const jobLevels = ['Tất cả', 'Junior', 'Mid-level', 'Senior'];
  const skillsList = ['JavaScript', 'React', 'TypeScript', 'Node.js', 'HTML5', 'CSS3', 'Git', 'C#', '.NET Core', 'SQL Server']; // Bổ sung kỹ năng .NET theo đồ án

  const tabs = [
    { id: 'all', text: 'Tất cả việc làm', count: totalCount },
    { id: 'matched', text: 'Phù hợp cao', count: tabCounts?.matched || 0 },
    { id: 'applied', text: 'Mới ứng tuyển', count: tabCounts?.applied || 0 },
  ];

  return (
    <div className="mb-4">
      {/* 1. Ô tìm kiếm và Dropdown */}
      <div className="d-flex gap-3 mb-4">
        <div className="flex-grow-1 position-relative">
          <Form.Control
            type="text"
            placeholder="🔍 Tìm công ty, vị trí, kỹ năng..."
            value={filters.search || ''}
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
            {filters.sortBy === 'newest' ? 'Mới nhất' : 'Match % cao nhất'}
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item onClick={() => onFilterChange('sortBy', 'match')}>Match % cao nhất</Dropdown.Item>
            <Dropdown.Item onClick={() => onFilterChange('sortBy', 'newest')}>Mới nhất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 2. Khối lọc nâng cao */}
      {showAdvancedFilters && (
        <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
          <div className="row g-4 mb-4">
            
            <div className="col-12 col-md-4">
              <div className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                HÌNH THỨC LÀM VIỆC
              </div>
              <div className="d-flex flex-wrap gap-2">
                {jobTypes.map(t => {
                  const isSelected = filters.type === t;
                  return (
                    <button 
                      key={t} type="button"
                      className="btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 transition-all"
                      style={{ 
                        backgroundColor: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)', 
                        color: isSelected ? '#000' : '#a0aec0', fontSize: '12.5px'
                      }}
                      onClick={() => onFilterChange('type', t)}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                CẤP ĐỘ
              </div>
              <div className="d-flex flex-wrap gap-2">
                {jobLevels.map(l => {
                  const isSelected = filters.level === l;
                  return (
                    <button 
                      key={l} type="button"
                      className="btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 transition-all"
                      style={{ 
                        backgroundColor: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)', 
                        color: isSelected ? '#000' : '#a0aec0', fontSize: '12.5px'
                      }}
                      onClick={() => onFilterChange('level', l)}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-white-50 text-uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  MATCH TỐI THIỂU: <span style={{ color: '#10b981' }}>{filters.minMatch || 0}%</span>
                </span>
              </div>
              <div className="px-1">
                <Form.Range 
                  min="0" max="90" step="10"
                  value={filters.minMatch || 0}
                  onChange={(e) => onFilterChange('minMatch', parseInt(e.target.value))}
                  className="custom-range-slider"
                />
                <div className="d-flex justify-content-between text-white-50 mt-1" style={{ fontSize: '10px' }}>
                  <span>0%</span><span>50%</span><span>90%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Lọc kỹ năng */}
          <div className="pt-4 border-top border-secondary border-opacity-10">
            <div className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
              LỌC THEO KỸ NĂNG
            </div>
            <div className="d-flex flex-wrap gap-2">
              {skillsList.map(skill => {
                const safeSkills = filters.skills || [];
                const isSelected = safeSkills.includes(skill);
                return (
                  <button 
                    key={skill} type="button"
                    className="btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 transition-all"
                    style={{ 
                      backgroundColor: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)', 
                      color: isSelected ? '#fff' : '#a0aec0', fontSize: '12.5px'
                    }}
                    onClick={() => {
                      const nextSkills = isSelected 
                        ? safeSkills.filter(s => s !== skill) 
                        : [...safeSkills, skill];
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

      {/* 3. Danh sách các Tab trạng thái */}
      <div className="d-flex gap-2 align-items-center mb-2 flex-wrap">
        {tabs.map((tab) => {
          const isTargetActive = currentTab === tab.id;
          return (
            <button
              key={tab.id} type="button"
              className={`btn btn-sm rounded-3 px-3 py-1.5 border-0 small transition-all ${isTargetActive ? 'text-dark fw-semibold' : 'text-white-50'}`}
              style={{ backgroundColor: isTargetActive ? 'var(--accent)' : 'transparent', fontSize: '13px' }}
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