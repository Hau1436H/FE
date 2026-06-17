// src/components/skillAssessment/GoalTab.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

function GoalTab({ onNextTab }) {
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // GỌI API LẤY DANH SÁCH TARGET CAREER ROLES TỪ BACKEND
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        // Gọi API mới tạo ở Backend
        const response = await axiosClient.get('/api/v1/roles');
        const rolesData = response.data.data || response.data;
        if (rolesData && rolesData.length > 0) {
          setRoles(rolesData);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách Ngành nghề:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="card border-secondary border-opacity-25 text-white p-5 mx-auto" style={{ backgroundColor: '#0b0c16', maxWidth: '900px' }}>
      <div className="text-center mb-5">
        <span className="badge text-success border border-success border-opacity-25 px-3 py-2 rounded-pill mb-3" style={{backgroundColor: 'color-mix(in srgb, var(--accent) 25%, transparent) !important'}}>
          Bước 1 / 4
        </span>
        <h3 className="fw-bold text-white mb-3">Định Hướng Nghề Nghiệp Mục Tiêu</h3>
        <p className="text-white-50">
          Bạn muốn trở thành ai trong tương lai? Hãy chọn một vị trí để AI thiết lập bài đánh giá chuyên sâu cho lộ trình đó.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-white-50 mt-2 small">Đang tải danh sách ngành nghề...</p>
        </div>
      ) : (
        <div className="row g-4 mb-5">
          {roles.map(role => (
            <div key={role.id} className="col-12 col-md-6">
              <div 
                className={`card h-100 p-4 transition-all cursor-pointer ${
                  selectedRoleId === role.id 
                    ? 'border-success bg-success bg-opacity-10 shadow' 
                    : 'border-secondary border-opacity-25'
                }`}
                style={{ backgroundColor: selectedRoleId === role.id ? '' : '#111324', cursor: 'pointer' }}
                onClick={() => setSelectedRoleId(role.id)}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className={`fw-bold mb-0 ${selectedRoleId === role.id ? 'text-success' : 'text-white'}`}>
                    {role.name}
                  </h5>
                  {/* Icon trang trí (tùy chọn) */}
                  <i className={`bi bi-briefcase-fill fs-4 ${selectedRoleId === role.id ? 'text-success' : 'text-secondary'}`}></i>
                </div>
                <p className="text-white-50 small mb-3">{role.description}</p>
                <div className="mt-auto">
                  <span className="badge bg-dark border border-secondary text-secondary">
                    Độ hot thị trường: {role.demandIndex}/10
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center border-top border-secondary border-opacity-25 pt-4">
        <button 
          className="btn btn-success px-5 py-2 fw-medium fs-5"
          disabled={!selectedRoleId || loading}
          onClick={() => onNextTab(selectedRoleId)} // Truyền ID của ngành nghề đi
        >
          Tiếp tục tạo bài đánh giá 🚀
        </button>
      </div>
    </div>
  );
}

export default GoalTab;