// .\src\pages\dashboard\SkillAssessment.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AssessmentTest from '../components/skillAssessment/AssessmentTest';
import GoalTab from '../components/skillAssessment/GoalTab';
import StatsTab from '../components/skillAssessment/StatsTab';
import RoadmapTab from '../components/skillAssessment/RoadmapTab';

const TAB_ORDER = ['goal', 'test', 'stats', 'roadmap'];

function SkillAssessment() {
  const [activeTab, setActiveTab] = useState('goal');
  const [maxUnlockedIdx, setMaxUnlockedIdx] = useState(0);

  const [testResult, setTestResult] = useState({
    hasTaken: false,
    score: 0,
    total: 3
  });

  const tabs = [
    { id: 'goal', label: '🎯 Mục tiêu' },
    { id: 'test', label: '🧠 Assessment Test' },
    { id: 'stats', label: '📊 Thống kê kỹ năng' },
    { id: 'roadmap', label: '🗺️ Lộ trình học tập' }
  ];

  const unlockNextTab = (currentTabId) => {
    const currentIdx = TAB_ORDER.indexOf(currentTabId);
    const nextIdx = currentIdx + 1;
    
    if (nextIdx < TAB_ORDER.length) {
      if (nextIdx > maxUnlockedIdx) {
        setMaxUnlockedIdx(nextIdx);
      }
      setActiveTab(TAB_ORDER[nextIdx]);
    }
  };

  const handleTestComplete = (score, total) => {
    setTestResult({
      hasTaken: true,
      score: score,
      total: total
    });
    unlockNextTab('test');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'goal': 
        return <GoalTab onNextTab={() => unlockNextTab('goal')} />;
      case 'test': 
        return <AssessmentTest onComplete={handleTestComplete} />;
      case 'stats': 
        return (
          <StatsTab 
            result={testResult} 
            onNavigateToRoadmap={() => unlockNextTab('stats')} 
          />
        );
      case 'roadmap': 
        return <RoadmapTab result={testResult} />;
      default: 
        return <GoalTab onNextTab={() => unlockNextTab('goal')} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#020205', minHeight: '100vh', fontFamily: 'system-ui' }}>
      
      {/* THANH NAVBAR ĐÃ CẬP NHẬT: Thêm nút chuyển hướng Dashboard khi hoàn thành */}
      <nav className="navbar navbar-dark border-bottom border-secondary border-opacity-10 py-3" style={{ backgroundColor: '#0b0c16' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white m-0">
            <span style={{
                background: 'linear-gradient(to right, #00bfa5 0%, #00bfa5 30%, #ffffff 70%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                fontWeight: '900',
                fontSize: '1.25rem'
            }}>AICareer</span>
          </Link>

          {/* Điều kiện check hiển thị: Chỉ xuất hiện khi testResult.hasTaken là true */}
          {testResult.hasTaken && (
            <Link 
              to="/dashboard" 
              className="btn btn-sm btn-success px-3 py-2 fw-medium rounded-2 transition-all shadow-sm"
              style={{ backgroundColor: '#198754', borderColor: '#198754', fontSize: '0.85rem' }}
            >
              Về Dashboard
            </Link>
          )}
        </div>
      </nav>

      <div className="container pt-4 pb-5">
        
        {/* Tiêu đề & mô tả được căn giữa sạch sẽ */}
        <div className="mb-4 text-center">
          <h2 className="text-white fw-bold mb-1">Đánh Giá Kỹ Năng</h2>
          <p className="text-white-50 small">Xây dựng lộ trình học tập tối ưu cá nhân hóa bằng AI</p>
        </div>

        {/* Thanh quản lý các Tab tuyến tính */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          {tabs.map((tab, index) => {
            const isLocked = index > maxUnlockedIdx;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                disabled={isLocked}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm px-4 py-2 rounded-pill fw-medium transition-all ${
                  isActive
                    ? 'btn-success text-white shadow'
                    : isLocked
                    ? 'btn-dark text-secondary border-0 opacity-25'
                    : 'btn-outline-secondary border-secondary border-opacity-25 text-white-50'
                }`}
                style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                title={isLocked ? "Bạn cần hoàn thành bước trước để mở khóa tab này" : ""}
              >
                {tab.label} {isLocked && '🔒'}
              </button>
            );
          })}
        </div>

        {/* Khối hiển thị nội dung động */}
        <div className="mt-2">
          {renderTabContent()}
        </div>
      </div>

    </div>
  );
}

export default SkillAssessment;