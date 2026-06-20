import React, { useState, useEffect } from 'react';
import { FiEdit2, FiUser, FiMail, FiHash, FiAward, FiTarget, FiCheck, FiX } from 'react-icons/fi';
import axiosClient from '../../../api/axiosClient';

function InfoForm({ info, onUpdateSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [targetRoles, setTargetRoles] = useState([]); // State lưu danh sách ngành nghề
  
  const [formData, setFormData] = useState({
    fullName: info?.fullName || '',
    studentCode: info?.studentCode || '',
    latentTalentSummary: info?.latentTalentSummary || '',
    targetRoleId: info?.targetRoleId || '',
  });

  const [localDisplayInfo, setLocalDisplayInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tải danh sách Target Roles từ Backend
  useEffect(() => {
    const fetchTargetRoles = async () => {
      try {
        const response = await axiosClient.get('/api/Profile/target-roles');
        if (response.data && response.data.data) {
          setTargetRoles(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách ngành nghề:", error);
      }
    };
    fetchTargetRoles();
  }, []);

  useEffect(() => {
    if (info) {
      const initialData = {
        fullName: info.fullName || '',
        studentCode: info.studentCode || '',
        latentTalentSummary: info.latentTalentSummary || '',
        targetRoleId: info.targetRoleId || '',
      };
      setFormData(initialData);
      setLocalDisplayInfo({ ...initialData, email: info.email });
    }
  }, [info]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Ép kiểu về số nguyên nếu field là targetRoleId
      [name]: name === 'targetRoleId' ? (value ? parseInt(value) : '') : value
    }));
  };

  const handleCancel = () => {
    setFormData({
      fullName: localDisplayInfo?.fullName || '',
      studentCode: localDisplayInfo?.studentCode || '',
      latentTalentSummary: localDisplayInfo?.latentTalentSummary || '',
      targetRoleId: localDisplayInfo?.targetRoleId || '',
    });
    setErrorMessage('');
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMessage('Họ tên không được để trống.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axiosClient.put('/api/Profile/me', formData);
      const updatedUser = response.data?.user || response.data;

      if (updatedUser) {
        const currentLocalStorageUser = JSON.parse(localStorage.getItem('user')) || {};
        const newUserData = { ...currentLocalStorageUser, ...formData };
        localStorage.setItem('user', JSON.stringify(newUserData));
        window.dispatchEvent(new Event('authChange'));
      }

      setLocalDisplayInfo(prev => ({
        ...prev,
        ...formData
      }));

      if (typeof onUpdateSuccess === 'function') {
        onUpdateSuccess({ ...formData, email: localDisplayInfo?.email }); 
      }
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm hỗ trợ dịch ID thành Tên
  const getRoleName = (roleId) => {
    if (!roleId) return 'Chưa thiết lập (Null)';
    const role = targetRoles.find(r => r.id === roleId);
    return role ? role.name : 'Đang tải...';
  };

  return (
    <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="fw-bold text-white mb-0" style={{ fontSize: '15px' }}>
          Thông tin tài khoản & Học tập
        </h6>
        
        {!isEditing ? (
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn btn-sm text-white-50 border border-secondary border-opacity-20 rounded-3 px-3 py-1.5 d-flex align-items-center gap-1.5" 
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', fontSize: '12px' }}
          >
            <FiEdit2 size={12} /> Chỉnh sửa thông tin
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button 
              type="button"
              onClick={handleCancel}
              className="btn btn-sm btn-outline-danger rounded-3 px-2.5 py-1.5 d-flex align-items-center gap-1"
              style={{ fontSize: '12px' }}
              disabled={isLoading}
            >
              <FiX size={12} /> Hủy
            </button>
            <button 
              type="submit"
              onClick={handleSave}
              className="btn btn-sm btn-success rounded-3 px-2.5 py-1.5 d-flex align-items-center gap-1"
              style={{ fontSize: '12px', backgroundColor: '#10b981', border: 'none' }}
              disabled={isLoading}
            >
              <FiCheck size={12} /> {isLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '12px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Họ và tên</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
              <FiUser size={15} className="opacity-50" />
              {isEditing ? (
                <input 
                  type="text" 
                  name="fullName"
                  className="bg-transparent border-0 text-white w-100 p-0 shadow-none" 
                  style={{ outline: 'none' }}
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              ) : (
                <span className="text-white">{localDisplayInfo?.fullName || 'Chưa cập nhật'}</span>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Mã số học viên</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
              <FiHash size={15} className="opacity-50" />
              {isEditing ? (
                <input 
                  type="text" 
                  name="studentCode"
                  placeholder="Nhập mã học viên..."
                  className="bg-transparent border-0 text-white w-100 p-0 shadow-none" 
                  style={{ outline: 'none' }}
                  value={formData.studentCode}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              ) : (
                <span className="text-white">{localDisplayInfo?.studentCode || 'Chưa cập nhật (Null)'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Địa chỉ Email (Không được sửa)</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px', opacity: 0.65 }}>
              <FiMail size={15} className="opacity-50" />
              <span className="text-white-50">{localDisplayInfo?.email || 'Chưa cập nhật'}</span>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Định hướng nghề nghiệp (Target Role)</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
              <FiTarget size={15} className="opacity-50" />
              {isEditing ? (
                // THAY THẾ BẰNG THẺ SELECT
                <select 
                  name="targetRoleId"
                  className="bg-transparent border-0 text-white w-100 p-0 shadow-none" 
                  style={{ outline: 'none', cursor: 'pointer' }}
                  value={formData.targetRoleId || ''}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="" className="text-dark">-- Chọn định hướng nghề nghiệp --</option>
                  {targetRoles.map(role => (
                    <option key={role.id} value={role.id} className="text-dark">
                      {role.name}
                    </option>
                  ))}
                </select>
              ) : (
                // DỊCH ID SANG TÊN CHO CHẾ ĐỘ XEM
                <span className="text-white fw-bold text-success">{getRoleName(localDisplayInfo?.targetRoleId)}</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Tóm tắt năng lực tiềm ẩn (Latent Talent Summary)</label>
          <div className="p-3 rounded-3 text-white-50 d-flex align-items-start gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px', lineHeight: '1.5' }}>
            <FiAward size={15} className="opacity-50 mt-1" style={{ minWidth: '15px' }} />
            {isEditing ? (
              <textarea 
                name="latentTalentSummary"
                rows={3}
                placeholder="Nhập phần mô tả đánh giá năng lực tiềm ẩn..."
                className="bg-transparent border-0 text-white w-100 p-0 shadow-none" 
                style={{ outline: 'none', resize: 'none' }}
                value={formData.latentTalentSummary}
                onChange={handleChange}
                disabled={isLoading}
              />
            ) : (
              <span className="text-white">{localDisplayInfo?.latentTalentSummary || 'Chưa có dữ liệu phân tích (Null)'}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default InfoForm;