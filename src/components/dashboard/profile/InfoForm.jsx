import React, { useState, useEffect } from 'react';
import { FiEdit2, FiUser, FiMail, FiHash, FiAward, FiTarget, FiCheck, FiX } from 'react-icons/fi';
import axiosClient from '../../../api/axiosClient';

/**
 * COMPONENT: InfoForm
 * CHỨC NĂNG CHÍNH:
 * - Trình diễn và cho phép CHỈNH SỬA chi tiết các thông tin học viên theo API mới.
 * - Tự động chuyển đổi giữa chế độ Xem (View Mode) và chế độ Sửa (Edit Mode).
 * - Kết nối API cập nhật thông tin (Chỉ gửi các trường cần thiết, KHÔNG gửi email).
 */
function InfoForm({ info, onUpdateSuccess }) {
  // Trạng thái bật/tắt chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  
  // State quản lý form
  const [formData, setFormData] = useState({
    fullName: info?.fullName || '',
    studentCode: info?.studentCode || '',
    latentTalentSummary: info?.latentTalentSummary || '',
    targetRoleId: info?.targetRoleId || '',
  });

  // ĐÃ THÊM: Tạo một bản backup local độc lập để hiển thị ở chế độ VIEW ngay lập tức khi lưu xong
  const [localDisplayInfo, setLocalDisplayInfo] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lắng nghe props `info` thay đổi từ component cha (ví dụ lúc mới tải trang hoặc cha fetch lại)
  useEffect(() => {
    if (info) {
      const initialData = {
        fullName: info.fullName || '',
        studentCode: info.studentCode || '',
        latentTalentSummary: info.latentTalentSummary || '',
        targetRoleId: info.targetRoleId || '',
      };
      setFormData(initialData);
      setLocalDisplayInfo({ ...initialData, email: info.email }); // Lưu lại cả email để hiển thị
    }
  }, [info]);

  // Hàm xử lý khi người dùng thay đổi dữ liệu trong ô input/textarea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm hủy bỏ trạng thái chỉnh sửa, khôi phục lại dữ liệu ban đầu từ bản backup local gần nhất
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

  // Hàm xử lý gửi dữ liệu cập nhật lên Server API
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validation cơ bản
    if (!formData.fullName.trim()) {
      setErrorMessage('Họ tên không được để trống.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Gọi API cập nhật thông tin
      const response = await axiosClient.put('/api/Profile/me', formData);
      
      const updatedUser = response.data?.user || response.data;

      if (updatedUser) {
        // Cập nhật lại object 'user' trong localStorage
        const currentLocalStorageUser = JSON.parse(localStorage.getItem('user')) || {};
        const newUserData = { ...currentLocalStorageUser, ...formData };
        localStorage.setItem('user', JSON.stringify(newUserData));

        // Kích hoạt sự kiện toàn cục thông báo đổi tên hiển thị lập tức cho Navbar/Sidebar
        window.dispatchEvent(new Event('authChange'));
      }

      // ĐÃ SỬA: Cập nhật ngay lập tức vào State hiển thị tại local của Component để UI đổi lập tức mà không cần reload
      setLocalDisplayInfo(prev => ({
        ...prev,
        ...formData
      }));

      // Gọi hàm callback từ component cha để cập nhật state tổng ở component lớn (Profile.jsx)
      if (typeof onUpdateSuccess === 'function') {
        onUpdateSuccess({ ...formData, email: localDisplayInfo?.email }); 
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Update Profile Error:", error);
      setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      
      {/* TIÊU ĐỀ KHỐI & NÚT HÀNH ĐỘNG */}
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

      {/* HIỂN THỊ BÁO LỖI NẾU CÓ */}
      {errorMessage && (
        <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '12px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* HÀNG 1: Họ và tên & Mã số học viên (studentCode) */}
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

        {/* HÀNG 2: Địa chỉ Email (Chỉ xem) & ID vai trò mục tiêu (targetRoleId) */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Địa chỉ Email (Không được sửa)</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px', opacity: 0.65 }}>
              <FiMail size={15} className="opacity-50" />
              <span className="text-white-50">{localDisplayInfo?.email || 'Chưa cập nhật'}</span>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>ID Vai trò mục tiêu (Target Role)</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
              <FiTarget size={15} className="opacity-50" />
              {isEditing ? (
                <input 
                  type="text" 
                  name="targetRoleId"
                  placeholder="Nhập ID vai trò công việc..."
                  className="bg-transparent border-0 text-white w-100 p-0 shadow-none" 
                  style={{ outline: 'none' }}
                  value={formData.targetRoleId}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              ) : (
                <span className="text-white">{localDisplayInfo?.targetRoleId || 'Chưa thiết lập (Null)'}</span>
              )}
            </div>
          </div>
        </div>

        {/* HÀNG 3: Tóm tắt năng lực tiềm ẩn (latentTalentSummary) */}
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