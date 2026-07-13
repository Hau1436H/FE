import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssessmentTest from '../components/skillAssessment/AssessmentTest';
import CodeAssessment from '../components/skillAssessment/CodeAssessment';
import GoalTab from '../components/skillAssessment/GoalTab';
import StatsTab from '../components/skillAssessment/StatsTab';
import RoadmapTab from '../components/skillAssessment/RoadmapTab';
import Logo from '../components/Logo';
import axiosClient from "../api/axiosClient";

const TAB_ORDER = ['goal', 'test', 'code', 'stats', 'roadmap'];
const DRAFT_KEY = 'aicareer_exam_draft'; 

// HÀM ĐỌC NHÁP 1 LẦN DUY NHẤT LÚC KHỞI ĐỘNG
const getInitialDraft = () => {
  try {
    const draft = sessionStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch {
    return null;
  }
};

function SkillAssessment() {
  // Lấy bản nháp ra trước (nếu có)
  const [draftData] = useState(getInitialDraft); // Dùng useState truyền func để nó chỉ chạy 1 lần lúc Mount

  // Truyền thẳng giá trị nháp vào các state khởi tạo
  const [activeTab, setActiveTab] = useState(draftData?.activeTab || 'goal');
  const [maxUnlockedIdx, setMaxUnlockedIdx] = useState(draftData?.maxUnlockedIdx || 0);
  const [targetRoleId, setTargetRoleId] = useState(draftData?.targetRoleId || null);
  const [targetSkillId, setTargetSkillId] = useState(draftData?.targetSkillId || null);

  const [examData, setExamData] = useState(draftData?.examData || {
    quizAnswers: [],
    codeSubmission: null
  });

  const [testResult, setTestResult] = useState(draftData?.testResult || {
    hasTaken: false,
    sessionId: null,
    quizScore: 0,
    codeScore: 0,
    score: 0,
    total: 20,
    aiFeedback: ''
  });

  // TÍNH NĂNG MỚI: Auto-save xuống Session Storage mỗi khi có tiến độ mới
  useEffect(() => {
    const stateToSave = {
      activeTab,
      maxUnlockedIdx,
      targetRoleId,
      targetSkillId,
      examData,
      testResult
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(stateToSave));
  }, [activeTab, maxUnlockedIdx, targetRoleId, targetSkillId, examData, testResult]);

  const handleClearSession = () => {
    sessionStorage.removeItem(DRAFT_KEY);
  };

  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

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
        skillNodeId: targetSkillId, 
        quizAnswers: examData.quizAnswers,
        codeSubmission: codePayload
      };

      const response = await axiosClient.post('/api/assessments/submit-exam', fullPayload);
      const data = response.data;

      setTestResult({
        hasTaken: true,
        sessionId: data.sessionId || data.SessionId, 
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
            <Link 
              to="/dashboard" 
              onClick={handleClearSession}
              className="btn btn-sm btn-success px-3 py-2 fw-medium rounded-2 shadow-sm"
            >
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
            // 1. Tab tương lai chưa tới lượt
            const isFutureStep = index > maxUnlockedIdx; 
            
            // 2. Tab đã hoàn thành trong lúc thi (Mục tiêu, Lý thuyết)
            const isPassedStepDuringTest = index < maxUnlockedIdx && maxUnlockedIdx < 3; 
            
            // 3. Tab làm bài (index 0, 1, 2) bị khóa vĩnh viễn sau khi đã nhấn Nộp Bài
            const isSubmittedExamStep = maxUnlockedIdx >= 3 && index < 3; 

            // NÚT BỊ KHÓA NẾU RƠI VÀO 1 TRONG 3 TRƯỜNG HỢP TRÊN
            const isLocked = isFutureStep || isPassedStepDuringTest || isSubmittedExamStep;
            
            // Gắn icon ✅ cho các tab đã vượt qua
            const isCompletedStep = isPassedStepDuringTest || isSubmittedExamStep;
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
                {tab.label} {isCompletedStep ? '✅' : (isFutureStep && '🔒')}
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