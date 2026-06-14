// src/components/skillAssessment/GoalTab.jsx
import { useState } from 'react';

function GoalTab({ onNextTab }) {
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    { id: 'backend', name: 'Backend Developer (.NET/C#)' },
    { id: 'frontend', name: 'Frontend Developer (React)' },
    { id: 'fullstack', name: 'Fullstack Developer' },
    { id: 'devops', name: 'DevOps Engineer' }
  ];

  return (
    <div className="card border-secondary border-opacity-25 text-white p-5 mx-auto" style={{ backgroundColor: '#0b0c16', maxWidth: '800px' }}>
      <div className="text-center mb-5">
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill mb-3">
          Bước 1 / 4
        </span>
        <h3 className="fw-bold text-white mb-3">Xác Định Mục Tiêu Nghề Nghiệp</h3>
        <p className="text-white-50">
          Để AI có thể xây dựng lộ trình và bài kiểm tra chính xác, hãy chọn vị trí (Role) mà bạn mong muốn ứng tuyển trong tương lai.
        </p>
      </div>

      <div className="row g-3 mb-5">
        {roles.map(role => (
          <div className="col-md-6" key={role.id}>
            <button
              className={`w-100 text-start btn p-4 rounded-3 border transition-all ${
                selectedRole === role.id 
                  ? 'btn-success border-success text-white shadow' 
                  : 'btn-outline-secondary border-secondary border-opacity-25 text-white-50'
              }`}
              style={{ backgroundColor: selectedRole === role.id ? '' : '#111324' }}
              onClick={() => setSelectedRole(role.id)}
            >
              <h5 className="fw-bold mb-0">{role.name}</h5>
            </button>
          </div>
        ))}
      </div>

      <div className="text-center border-top border-secondary border-opacity-25 pt-4">
        <button 
          className="btn btn-success px-5 py-2 fw-medium fs-5"
          disabled={!selectedRole}
          onClick={onNextTab}
        >
          Bắt đầu làm bài Test 🚀
        </button>
      </div>
    </div>
  );
}

export default GoalTab;