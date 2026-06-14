// .\src\pages\dashboard\SkillAssessment.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AssessmentTest from '../components/skillAssessment/AssessmentTest';
import GoalTab from '../components/skillAssessment/GoalTab';
import StatsTab from '../components/skillAssessment/StatsTab';
import RoadmapTab from '../components/skillAssessment/RoadmapTab';
import Logo from '../components/Logo';

const TAB_ORDER = ['goal', 'test', 'stats', 'roadmap'];

function SkillAssessment() {
  const [activeTab, setActiveTab] = useState('goal');
  const [maxUnlockedIdx, setMaxUnlockedIdx] = useState(0);

  // Mảng danh sách các skillNodeId cần test lần lượt
  const skillNodeIds = [1, 2];
  // State theo dõi xem đang làm bài test cho vị trí index nào trong mảng skillNodeIds
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);

  // Cấu trúc lưu trữ kết quả test tích lũy (Có thể sửa tùy thuộc cấu trúc dữ liệu Backend của bạn)
  const [testResult, setTestResult] = useState({
    hasTaken: false,
    score: 0,
    total: 0,
    history: {} // Lưu chi tiết kết quả từng skillNodeId dưới dạng: { '1': score1, '2': score2 }
  });

  const tabs = [
    { id: 'goal', label: 'Mục tiêu' },
    { id: 'test', label: 'Assessment Test' },
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

  // HÀM XỬ LÝ KHI HOÀN THÀNH MỘT BÀI TEST THÀNH PHẦN
  const handleTestComplete = (score, total) => {
    const currentNodeId = skillNodeIds[currentSkillIdx];

    // Cập nhật kết quả cộng dồn và lưu lịch sử test của Node ID đó
    setTestResult(prev => ({
      hasTaken: true,
      score: prev.score + score,
      total: prev.total + total,
      history: {
        ...prev.history,
        [currentNodeId]: { score, total }
      }
    }));

    // KIỂM TRA: Xem còn skillNodeId tiếp theo để làm test tiếp không
    if (currentSkillIdx + 1 < skillNodeIds.length) {
      // Nếu còn -> Tăng index lên để ép AssessmentTest chuyển sang Node tiếp theo
      setCurrentSkillIdx(prevIdx => prevIdx + 1);
      // Giữ nguyên tab 'test' để user tiếp tục làm bài khảo sát tiếp theo
    } else {
      // Nếu đã làm hết toàn bộ danh sách skillNodeIds -> Mới mở khóa chuyển sang tab Thống kê
      unlockNextTab('test');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'goal': 
        return <GoalTab onNextTab={() => unlockNextTab('goal')} />;
      case 'test': 
        return (
          <AssessmentTest 
            key={skillNodeIds[currentSkillIdx]} // QUAN TRỌNG: Dùng key để React buộc re-mount lại component mới xóa sạch state cũ của bài test trước khi đổi ID
            skillNodeId={skillNodeIds[currentSkillIdx]} // Truyền ID kỹ năng hiện tại xuống cho component con fetch API câu hỏi
            currentStep={currentSkillIdx + 1} // Gửi thông tin bước hiện tại (Ví dụ: Bài test số 1/2)
            totalSteps={skillNodeIds.length}  // Gửi tổng số bài test cần làm
            onComplete={handleTestComplete} 
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
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white m-0">
            <Logo size="md" />
          </Link>

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