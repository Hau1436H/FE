// src/pages/dashboard/Profile.jsx
import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ProfileCard from '../../components/dashboard/profile/ProfileCard';
import ProfileNav from '../../components/dashboard/profile/ProfileNav';
import InfoForm from '../../components/dashboard/profile/InfoForm';
import GithubPortfolioSync from '../../components/dashboard/profile/GithubPortfolioSync';
import AssessmentTab from '../../components/dashboard/profile/AssessmentTab';
import FeedbackHistoryTab from '../../components/dashboard/profile/FeedbackHistoryTab';
import TechIdentity from '../../components/dashboard/profile/TechIdentity'; 
import axiosClient from '../../api/axiosClient';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({});
  
  // States cho việc upload bảng điểm
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      // Giải mã an toàn hỗ trợ Base64Url
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
      console.error("Lỗi parse token trong Profile:", e);
      return null; 
    }
  };

  const studentId = getStudentId();

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get('/api/Profile/me');
      if (response.data.data) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi nạp dữ liệu", error);
    }
  };

  useEffect(() => {
    let isMounted = true; // Tránh set state khi component đã unmount

    const loadUser = async () => {
      try {
        const response = await axiosClient.get('/api/Profile/me');
        if (isMounted && response.data.data) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi nạp dữ liệu", error);
      }
    };

    loadUser();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  // Hàm xử lý Upload Transcript (FR1.3)
  const handleTranscriptUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadMessage({ type: 'danger', text: 'Chỉ hỗ trợ file định dạng PDF.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadMessage({ type: 'info', text: 'AI đang phân tích bảng điểm, vui lòng đợi...' });

    try {
      const response = await axiosClient.post('/api/Profile/upload-transcript', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUploadMessage({ type: 'success', text: 'Phân tích thành công! Đã cập nhật hồ sơ năng lực.' });
      
      // Load lại thông tin user để hiển thị LatentTalentSummary mới
      fetchUser();
    } catch (error) {
      setUploadMessage({ 
        type: 'danger', 
        text: `Lỗi: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      <Sidebar />

      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />
        
        {/* Đã gỡ bỏ style={{ maxWidth: '1200px' }} để giao diện tràn viền theo ý bạn */}
        <div className="container-fluid px-0 w-100">
  {/* SỬA LỖI Ở ĐÂY: Thêm lại ProfileCard để truyền user thật vào và hết lỗi báo chưa sử dụng */}
  <ProfileCard user={user} />
  
  <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />

  {activeTab === 'profile' ? (
    <>
      <TechIdentity user={user} />
      <InfoForm info={user} />

      {/* KHU VỰC ĐÃ ĐƯỢC REDESIGN: MODULE PHÂN TÍCH BẢNG ĐIỂM (TRANSCRIPT AI) */}
      <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ fontSize: '1.2rem' }}>✨</span>
          <h5 className="text-white mb-0 fw-bold tracking-tight">AI Phân tích Bảng điểm</h5>
        </div>
        <p className="text-white-50 small mb-4">
          Hệ thống AI sẽ quét file PDF bảng điểm của bạn, phân tích dữ liệu môn học và trích xuất điểm mạnh tiềm ẩn (Latent Talent).
        </p>
        
        {/* Custom Upload Box phong cách Tech */}
        <div className="mb-4">
          <label 
            htmlFor="transcript-upload" 
            className={`d-flex flex-column align-items-center justify-content-center p-4 rounded-3 w-100 transition-all ${isUploading ? 'opacity-50' : ''}`}
            style={{ 
              backgroundColor: '#0a0b10', 
              border: '1px dashed #2d3748', 
              cursor: isUploading ? 'not-allowed' : 'pointer',
              minHeight: '120px'
            }}
          >
            <div className="mb-2">
              {isUploading ? (
                <span className="spinner-border text-info" style={{ width: '2rem', height: '2rem' }}></span>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              )}
            </div>
            <span className="text-info fw-bold mb-1">{isUploading ? 'Hệ thống đang xử lý...' : 'Click để tải lên bảng điểm PDF'}</span>
            <span className="text-white-50 small font-monospace">Hỗ trợ file định dạng .pdf</span>
          </label>
          <input 
            id="transcript-upload"
            type="file" 
            accept=".pdf" 
            className="d-none" // Ẩn input mặc định của browser
            ref={fileInputRef}
            onChange={handleTranscriptUpload}
            disabled={isUploading}
          />
        </div>

        {/* Cảnh báo hệ thống (Console Alert) */}
        {uploadMessage.text && (
          <div className={`alert py-2 small border-0 font-monospace d-flex align-items-center gap-2 ${
            uploadMessage.type === 'danger' ? 'bg-danger bg-opacity-10 text-danger' : 
            uploadMessage.type === 'success' ? 'bg-success bg-opacity-10 text-success' : 
            'bg-info bg-opacity-10 text-info'
          }`}>
            {uploadMessage.type === 'danger' ? '✖' : uploadMessage.type === 'success' ? '✔' : '⚙'} 
            {uploadMessage.text}
          </div>
        )}

        {/* Khung kết quả hiển thị dạng Terminal Output */}
        {user.latentTalentSummary && (
          <div className="mt-4 rounded-3 overflow-hidden shadow-sm" style={{ border: '1px solid #1e2235' }}>
            <div className="px-3 py-2 d-flex align-items-center justify-content-between font-monospace" style={{ backgroundColor: '#1e2235', borderBottom: '1px solid #2d3748', fontSize: '12px' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="text-success">●</span>
                <span className="text-white-50">ai_analysis_output.log</span>
              </div>
              <span className="text-white-50 opacity-50">UTF-8</span>
            </div>
            <div className="p-3 font-monospace text-light position-relative" style={{ backgroundColor: '#0a0b10', fontSize: '13.5px', lineHeight: '1.7' }}>
              <div className="text-success mb-2">
                <span className="opacity-50">root@techcompass:~$</span> cat ai_analysis_output.log
              </div>
              <div className="text-info mb-2">{'[SYSTEM_SUCCESS] Latent talent profile generated.'}</div>
              <div style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0', paddingLeft: '1rem', borderLeft: '2px solid #2d3748' }}>
                {user.latentTalentSummary}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* END MODULE PHÂN TÍCH BẢNG ĐIỂM */}

      {/* MODULE E-PORTFOLIO */}
      {studentId ? (
        <GithubPortfolioSync studentId={studentId} />
      ) : (
        <div className="alert alert-warning mt-4 text-center border-0 bg-warning bg-opacity-10 text-warning w-100">
          Đang tải thông tin định danh để đồng bộ GitHub...
        </div>
      )}
    </>
  ) : activeTab === 'assessment' ? (
    
    <AssessmentTab studentId={studentId} />

  ) : activeTab === 'chat' ? (
    <div className="text-center text-white-50 py-5 bg-secondary bg-opacity-5 rounded-4 border border-secondary border-opacity-10 mt-4 w-100">
      <FeedbackHistoryTab />
    </div>
  ) : (
    <div className="text-center text-white-50 py-5 bg-secondary bg-opacity-5 rounded-4 border border-secondary border-opacity-10 mt-4 w-100">
      Nội dung tab Cài đặt hệ thống...
    </div>
  )}
</div>
      </div>
    </div>
  );
}

export default Profile;