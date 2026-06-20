// src/components/dashboard/profile/AssessmentTab.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';

function AssessmentTab({ studentId }) {
  const [skillNodes, setSkillNodes] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);

  // 1. Lấy toàn bộ danh sách kỹ năng VÀ danh sách đã khai báo
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Dùng Promise.all để gọi 2 API cùng một lúc cho tốc độ nhanh nhất
        const [skillsRes, historyRes] = await Promise.all([
          axiosClient.get('/api/Assessments/all-skill-nodes'),
          axiosClient.get(`/api/assessments/my-history/${studentId}`)
        ]);

        if (skillsRes.data?.data) {
          setSkillNodes(skillsRes.data.data);
        }

        const historyData = historyRes.data?.data || historyRes.data || [];
        
        // Lọc ra các bài có type là SELF_DECLARED và lấy ra mảng ID của chúng
        const declaredIds = historyData
          .filter(session => session.assessmentType === 'SELF_DECLARED')
          .map(session => session.skillNodeId);

        // Đổ mảng ID đó vào state để các checkbox tự động tick
        setSelectedSkills(declaredIds);

      } catch (error) {
        console.error("Lỗi lấy dữ liệu Assessment Tab:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    }
  }, [studentId]);

  // Xử lý khi tick/untick chọn checkbox
  const handleCheckboxChange = (nodeId) => {
    setSelectedSkills(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId) 
        : [...prev, nodeId]
    );
  };

  // 2. Submit API khai báo
  const handleSubmit = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        studentId: studentId,
        acquiredSkillNodeIds: selectedSkills
      };
      
      const res = await axiosClient.post('/api/Assessments/self-declare', payload);
      setMessage({ type: 'success', text: res.data?.message || 'Đã cập nhật vốn kỹ năng thành công!' });
      
    } catch (error) {
      setMessage({ type: 'danger', text: 'Lỗi khi cập nhật kỹ năng. Vui lòng thử lại.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-white-50 py-5">Đang tải dữ liệu khai báo...</div>;
  }

  return (
    <div className="card bg-dark border-secondary border-opacity-25 mt-4 p-4 rounded-4">
      <h5 className="text-white mb-3 d-flex align-items-center gap-2">
        <span className="text-info">🎯</span> Khai báo vốn kỹ năng ban đầu
      </h5>
      <p className="text-white-50 small">
        Đánh dấu các công nghệ bạn đã tự tin làm chủ. Hệ thống sẽ bỏ qua bài kiểm tra cho các kỹ năng này và điều chỉnh lộ trình của bạn.
      </p>

      {message.text && (
        <div className={`alert alert-${message.type} py-2 small border-0 bg-opacity-10`} style={{ backgroundColor: message.type === 'danger' ? '#dc3545' : message.type === 'success' ? '#198754' : '#ffc107', color: '#fff' }}>
          {message.text}
        </div>
      )}

      {/* Render danh sách kỹ năng dạng lưới */}
      <div className="row g-3 mt-2">
        {skillNodes.map(node => {
          const nodeId = node.skillNodeId || node.id;
          const isChecked = selectedSkills.includes(nodeId);

          return (
            <div key={nodeId} className="col-md-4 col-sm-6">
              <div 
                className={`form-check custom-checkbox p-3 border rounded transition-all hover-bg-secondary ${isChecked ? 'border-info bg-info bg-opacity-10' : 'border-secondary border-opacity-25 bg-black bg-opacity-50'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleCheckboxChange(nodeId)}
              >
                <input 
                  className="form-check-input ms-0 me-2" 
                  type="checkbox" 
                  id={`skill-${nodeId}`}
                  checked={isChecked}
                  onChange={() => {}} 
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className={`form-check-label ${isChecked ? 'text-info fw-bold' : 'text-white-50'}`} 
                  htmlFor={`skill-${nodeId}`} 
                  style={{ cursor: 'pointer' }}
                >
                  {node.nodeName || node.name}
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-end">
        <button 
          className="btn btn-success px-4" 
          onClick={handleSubmit} 
          disabled={isSaving}
        >
          {isSaving ? 'Đang lưu...' : 'Lưu khai báo'}
        </button>
      </div>
    </div>
  );
}

export default AssessmentTab;