// src/pages/dashboard/Profile.jsx
import { useState, useEffect, useRef } from 'react';import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ProfileCard from '../../components/dashboard/profile/ProfileCard';
import ProfileNav from '../../components/dashboard/profile/ProfileNav';
import InfoForm from '../../components/dashboard/profile/InfoForm';
import SocialLinks from '../../components/dashboard/profile/SocialLinks';
import GithubPortfolioSync from '../../components/dashboard/profile/GithubPortfolioSync';
import { PROFILE_DATA } from '../../data/profileData';
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.studentId || payload.StudentId || payload.sub;
    } catch (e) { 
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

  // Sửa đoạn code gọi fetchUser (khoảng dòng 45) thành:
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
        
        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>
          <ProfileCard data={PROFILE_DATA} />
          <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'profile' ? (
            <>
              <InfoForm info={user} />

              {/* MODULE PHÂN TÍCH BẢNG ĐIỂM (TRANSCRIPT AI) */}
              <div className="card bg-dark border-secondary border-opacity-25 mt-4 p-4 rounded-4">
                <h5 className="text-white mb-3 d-flex align-items-center gap-2">
                  <span className="text-success">✨</span> AI Phân tích Bảng điểm (FAP)
                </h5>
                <p className="text-white-50 small">
                  Tải lên bảng điểm PDF của bạn để AI tự động trích xuất các kỹ năng cốt lõi và điểm mạnh tiềm ẩn (Latent Talent).
                </p>
                
                <div className="d-flex align-items-center gap-3">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="form-control form-control-sm bg-dark text-white border-secondary border-opacity-50 w-auto"
                    ref={fileInputRef}
                    onChange={handleTranscriptUpload}
                    disabled={isUploading}
                  />
                  {isUploading && <span className="spinner-border spinner-border-sm text-success"></span>}
                </div>

                {uploadMessage.text && (
                  <div className={`alert alert-${uploadMessage.type} mt-3 mb-0 py-2 small border-0 bg-opacity-10`} style={{ backgroundColor: uploadMessage.type === 'danger' ? '#dc3545' : uploadMessage.type === 'success' ? '#198754' : '#0dcaf0' }}>
                    {uploadMessage.text}
                  </div>
                )}

                {/* Hiển thị kết quả AI đã phân tích */}
                {user.latentTalentSummary && (
                  <div className="mt-3 p-3 bg-black bg-opacity-25 rounded border border-success border-opacity-25 text-white-50 small" style={{ whiteSpace: 'pre-wrap' }}>
                    <strong className="text-success">Kết luận từ AI:</strong><br/>
                    {user.latentTalentSummary}
                  </div>
                )}
              </div>

              {/* MODULE E-PORTFOLIO */}
              {studentId ? (
                <GithubPortfolioSync studentId={studentId} />
              ) : (
                <div className="alert alert-warning mt-4 text-center border-0 bg-warning bg-opacity-10 text-warning">
                  Đang tải thông tin định danh để đồng bộ GitHub...
                </div>
              )}

              <SocialLinks socials={PROFILE_DATA.socials} />
            </>
          ) : (
            <div className="text-center text-white-50 py-5 bg-secondary bg-opacity-5 rounded-4 border border-secondary border-opacity-10 mt-4">
              Nội dung tab "{activeTab}" đang được đồng bộ dữ liệu hệ thống...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;