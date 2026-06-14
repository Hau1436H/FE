// src/pages/dashboard/SkillAssessment.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AssessmentTest from '../components/skillAssessment/AssessmentTest';
import CodeAssessment from '../components/skillAssessment/CodeAssessment';
import GoalTab from '../components/skillAssessment/GoalTab';
import StatsTab from '../components/skillAssessment/StatsTab';
import RoadmapTab from '../components/skillAssessment/RoadmapTab';
import Logo from '../components/Logo';

// 1. Thêm 'code' vào luồng
const TAB_ORDER = ['goal', 'test', 'code', 'stats', 'roadmap'];

function SkillAssessment() {
  const [activeTab, setActiveTab] = useState('goal');
  const [maxUnlockedIdx, setMaxUnlockedIdx] = useState(0);

  // ĐÃ SỬA: Cập nhật thành 13 (JavaScript) và 15 (React) để map đúng với Database
  const skillNodeIds = [13, 15];
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);

  const [testResult, setTestResult] = useState({
    hasTaken: false,
    score: 0,
    total: 0,
    aiFeedback: '',
    history: {}
  });

  const tabs = [
    { id: 'goal', label: 'Mục tiêu' },
    { id: 'test', label: 'Lý thuyết' },
    { id: 'code', label: 'Thực hành Code' }, // 2. Thêm tab hiển thị
    { id: 'stats', label: 'Thống kê kỹ năng' },
    { id: 'roadmap', label: 'Lộ trình học tập' }
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

  const handleTestComplete = (score, total, feedback) => {
    const currentNodeId = skillNodeIds[currentSkillIdx];

    setTestResult(prev => ({
      hasTaken: true,
      score: prev.score + score,
      total: prev.total + total,
      aiFeedback: feedback ? (prev.aiFeedback + '\n\n' + feedback) : prev.aiFeedback, // Nối feedback nếu có nhiều bài
      history: {
        ...prev.history,
        [currentNodeId]: { score, total, feedback }
      }
    }));

    if (currentSkillIdx + 1 < skillNodeIds.length) {
      setCurrentSkillIdx(prevIdx => prevIdx + 1);
    } else {
      unlockNextTab('test'); // Mở khóa tab Code sau khi làm xong trắc nghiệm
    }
  };

  // Hàm xử lý riêng cho bài test Code
  const handleCodeComplete = (score, total, feedback) => {
    setTestResult(prev => ({
      hasTaken: true,
      score: prev.score + score,
      total: prev.total + total,
      aiFeedback: prev.aiFeedback + '\n\n[ĐÁNH GIÁ CODE]: ' + feedback,
    }));
    unlockNextTab('code'); // Xong code thì sang Thống kê
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'goal': 
        return <GoalTab onNextTab={() => unlockNextTab('goal')} />;
      case 'test': 
        return (
          <AssessmentTest 
            key={`quiz-${skillNodeIds[currentSkillIdx]}`} 
            skillNodeId={skillNodeIds[currentSkillIdx]}
            currentStep={currentSkillIdx + 1}
            totalSteps={skillNodeIds.length}
            onComplete={handleTestComplete} 
          />
        );
      case 'code': // 3. Render component CodeAssessment
        return (
          <CodeAssessment 
            // ĐÃ SỬA: Đổi ID từ 999 thành 13 để khớp bài tập JavaScript
            skillNodeId={13} 
            onComplete={handleCodeComplete} 
          />
        );
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
      
      <nav className="navbar navbar-dark border-bottom border-secondary border-opacity-10 py-3" style={{ backgroundColor: '#0b0c16' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white m-0">
            <Logo size="md" />
          </div>

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
        
        <div className="mb-4 text-center">
          <h2 className="text-white fw-bold mb-1">Đánh Giá Kỹ Năng</h2>
          <p className="text-white-50 small">Xây dựng lộ trình học tập tối ưu cá nhân hóa bằng AI</p>
        </div>

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

        <div className="mt-2">
          {renderTabContent()}
        </div>
      </div>

    </div>
  );
}

export default SkillAssessment;