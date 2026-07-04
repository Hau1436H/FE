import { useState } from 'react';
import { Link } from 'react-router-dom';
import AssessmentTest from '../components/skillAssessment/AssessmentTest';
import CodeAssessment from '../components/skillAssessment/CodeAssessment';
import GoalTab from '../components/skillAssessment/GoalTab';
import StatsTab from '../components/skillAssessment/StatsTab';
import RoadmapTab from '../components/skillAssessment/RoadmapTab';
import Logo from '../components/Logo';
import axiosClient from "../api/axiosClient";

const TAB_ORDER = ['goal', 'test', 'code', 'stats', 'roadmap'];

function SkillAssessment() {
  const [activeTab, setActiveTab] = useState('goal');
  const [maxUnlockedIdx, setMaxUnlockedIdx] = useState(0);

  // LƯU CẢ ROLE VÀ SKILL ĐỂ DÙNG CHO CÁC API KHÁC NHAU
  const [targetRoleId, setTargetRoleId] = useState(null);
  const [targetSkillId, setTargetSkillId] = useState(null);

  const [examData, setExamData] = useState({
    quizAnswers: [],
    codeSubmission: null
  });

  const [testResult, setTestResult] = useState({
    hasTaken: false,
    sessionId: null, // Thêm sessionId để truyền cho RoadmapTab
    quizScore: 0,
    codeScore: 0,
    score: 0,
    total: 20,
    aiFeedback: ''
  });

  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      // Giải mã an toàn hỗ trợ Base64Url và Unicode (Fix lỗi atob crash)
      const base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
          base64 += '=';
      }
      
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );

      const payload = JSON.parse(jsonPayload);
      return payload.studentId || payload.StudentId || payload.sub;
    } catch (e) {
      console.error("Lỗi parse token trong SkillAssessment:", e);
      return null;
    }
  };
  const tabs = [
    { id: 'goal', label: 'Mục tiêu' },
    { id: 'test', label: 'Lý thuyết' },
    { id: 'code', label: 'Thực hành Code' },
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

  const handleGoalSubmit = async (roleId) => {
    try {
      const response = await axiosClient.get(`/api/v1/roles/${roleId}/skills`);
      const skillsArray = response.data?.data || response.data;

      if (!skillsArray || skillsArray.length === 0) {
        alert("Hiện tại Database chưa có bộ dữ liệu cho ngành nghề này. Vui lòng chọn Backend hoặc Frontend!");
        return;
      }
      
      // LƯU STATE ĐỂ TRUYỀN XUỐNG COMPONENT CON
      setTargetRoleId(roleId);
      setTargetSkillId(skillsArray[0]);        
      unlockNextTab('goal'); 
    } catch {
      alert("Lỗi kết nối máy chủ. Không thể khởi tạo bài test.");
    }
  };

  const handleTestComplete = (answers) => {
    setExamData(prev => ({ ...prev, quizAnswers: answers }));
    unlockNextTab('test');
  };

  const handleCodeComplete = async (codePayload) => {
    const studentId = getStudentId();
    if (!studentId) {
      alert("Phiên đăng nhập hết hạn. Vui lòng thử lại.");
      return;
    }

    try {
      const fullPayload = {
        studentId: studentId,
        skillNodeId: targetSkillId, // Submit vẫn cần 1 skill gốc để tính điểm
        quizAnswers: examData.quizAnswers,
        codeSubmission: codePayload
      };

      const response = await axiosClient.post('/api/assessments/submit-exam', fullPayload);
      const data = response.data;

      setTestResult({
        hasTaken: true,
        sessionId: data.sessionId || data.SessionId, // BẮT BUỘC CÓ ĐỂ ROADMAP HOẠT ĐỘNG
        quizScore: data.quizScore || 0,
        codeScore: data.codeScore || 0,
        score: (data.quizScore || 0) + (data.codeScore || 0),
        total: 20,
        aiFeedback: data.message || "Đã phân tích xong bộ test."
      });
      
      unlockNextTab('code'); 
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi chấm và lưu bài. Vui lòng kiểm tra lại mạng.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'goal': return <GoalTab onNextTab={handleGoalSubmit} />; 
      case 'test': 
        return targetRoleId ? (
          <AssessmentTest key={`quiz-${targetRoleId}`} roleId={targetRoleId} onComplete={handleTestComplete} />
        ) : (<div className="text-center text-white p-5"><div className="spinner-border"></div></div>);
        
      case 'code': 
        return targetRoleId && (
          <CodeAssessment roleId={targetRoleId} onComplete={handleCodeComplete} />
        );
        
      case 'stats': 
        return <StatsTab result={testResult} onNavigateToRoadmap={() => unlockNextTab('stats')} />;
        
      case 'roadmap': 
        return <RoadmapTab sessionId={testResult.sessionId} result={testResult} />;
        
      default: return <GoalTab onNextTab={handleGoalSubmit} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#020205', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <nav className="navbar navbar-dark border-bottom border-secondary border-opacity-10 py-3" style={{ backgroundColor: '#0b0c16' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white m-0"><Logo size="md" /></div>
          {testResult.hasTaken && (
            <Link to="/dashboard" className="btn btn-sm btn-success px-3 py-2 fw-medium rounded-2 shadow-sm">
              Về Dashboard
            </Link>
          )}
        </div>
      </nav>

      <div className="container pt-4 pb-5">
        <div className="mb-4 text-center">
          <h2 className="text-white fw-bold mb-1">Đánh Giá Kỹ Năng Toàn Diện</h2>
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
                  isActive ? 'btn-success text-white shadow' : isLocked ? 'btn-dark text-secondary border-0 opacity-25' : 'btn-outline-secondary border-secondary border-opacity-25 text-white-50'
                }`}
                style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
              >
                {tab.label} {isLocked && '🔒'}
              </button>
            );
          })}
        </div>

        <div className="mt-2">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default SkillAssessment;