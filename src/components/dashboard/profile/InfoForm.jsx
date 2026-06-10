import React, { useState } from 'react';
import { FiEdit2, FiUser, FiMail, FiPhone, FiMapPin, FiInfo, FiCheck, FiX } from 'react-icons/fi';
import axiosClient from '../../../api/axiosClient';

/**
 * COMPONENT: InfoForm
 * CHỨC NĂNG CHÍNH:
 * - Trình diễn và cho phép CHỈNH SỬA chi tiết các thông tin liên hệ.
 * - Tự động chuyển đổi giữa chế độ Xem (View Mode) và chế độ Sửa (Edit Mode).
 * - Kết nối API cập nhật thông tin và đồng bộ trực tiếp vào localStorage.
 */
function InfoForm({ info, onUpdateSuccess }) {
  // Trạng thái bật/tắt chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  
  // Trạng thái lưu trữ dữ liệu tạm thời trên form khi người dùng đang gõ
  const [formData, setFormData] = useState({
    fullName: info?.fullName || '',
    email: info?.email || '',
    phone: info?.phone || '',
    location: info?.location || '',
    bio: info?.bio || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hàm xử lý khi người dùng thay đổi dữ liệu trong ô input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm hủy bỏ trạng thái chỉnh sửa, khôi phục lại dữ liệu ban đầu
  const handleCancel = () => {
    setFormData({
      fullName: info?.fullName || '',
      email: info?.email || '',
      phone: info?.phone || '',
      location: info?.location || '',
      bio: info?.bio || ''
    });
    setErrorMessage('');
    setIsEditing(false);
  };

  // Hàm xử lý gửi dữ liệu cập nhật lên Server API
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validation cơ bản (Tránh gửi dữ liệu rỗng)
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMessage('Họ tên và Email không được để trống.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Gọi API cập nhật thông tin (Thay đổi endpoint '/api/User/update-profile' theo backend .NET của bạn nếu cần)
      const response = await axiosClient.put('/api/User/update-profile', formData);
      
      // Giả định backend phản hồi thành công trả về dữ liệu User mới trong response.data.user hoặc response.data
      const updatedUser = response.data?.user || response.data;

      if (updatedUser) {
        // 1. Cập nhật lại object 'user' trong localStorage để MyNavbar lấy được tên mới
        const currentLocalStorageUser = JSON.parse(localStorage.getItem('user')) || {};
        const newUserData = { ...currentLocalStorageUser, ...formData };
        localStorage.setItem('user', JSON.stringify(newUserData));

        // 2. Kích hoạt sự kiện toàn cục thông báo cho thanh MyNavbar đổi tên hiển thị ngay lập tức
        window.dispatchEvent(new Event('authChange'));
      }

      // 3. Gọi hàm callback từ component cha (Profile.jsx) nếu có để cập nhật lại state tổng của trang profile
      if (typeof onUpdateSuccess === 'function') {
        onUpdateSuccess(formData);
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
          Thông tin cá nhân
        </h6>
        
        {!isEditing ? (
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn btn-sm text-white-50 border border-secondary border-opacity-20 rounded-3 px-3 py-1.5 d-flex align-items-center gap-1.5 transition-all" 
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', fontSize: '12px' }}
          >
            <FiEdit2 size={12} /> Chỉnh sửa
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
              type="button"
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
        {/* HÀNG 1: Ô Họ và tên & Ô Địa chỉ Email */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Họ và tên</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
              <FiUser size={15} className="opacity-50" />
              {isEditing ? (
                <input 
                  type="text" 
                  name="fullName"
                  className="bg-transparent border-0 text-white w-100 p-0 shadow-none focus-outline-none" 
                  style={{ outline: 'none' }}
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              ) : (
                <span className="text-white">{info?.fullName}</span>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Email</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
              <FiMail size={15} className="opacity-50" />
              {isEditing ? (
                <input 
                  type="email" 
                  name="email"
                  className="bg-transparent border-0 text-white w-100 p-0 shadow-none focus-outline-none" 
                  style={{ outline: 'none' }}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              ) : (
                <span className="text-white">{info?.email}</span>
              )}
            </div>
          </div>
        </div>

        {/* HÀNG 2: Ô Số điện thoại & Ô Thành phố / Khu vực */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Số điện thoại</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
              <FiPhone size={15} className="opacity-50" />
              {isEditing ? (
                <input 
                  type="text" 
                  name="phone"
                  className="bg-transparent border-0 text-white w-100 p-0 shadow-none focus-outline-none" 
                  style={{ outline: 'none' }}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              ) : (
                <span className="text-white">{info?.phone || 'Chưa cập nhật'}</span>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Thành phố / Khu vực</label>
            <div className="p-3 rounded-3 text-white-50 d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
              <FiMapPin size={15} className="opacity-50" />
              {isEditing ? (
                <input 
                  type="text" 
                  name="location"
                  className="bg-transparent border-0 text-white w-100 p-0 shadow-none focus-outline-none" 
                  style={{ outline: 'none' }}
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              ) : (
                <span className="text-white">{info?.location || 'Chưa cập nhật'}</span>
              )}
            </div>
          </div>
        </div>

        {/* HÀNG 3: Vùng thông tin Giới thiệu bản thân (Bio text) rộng trọn dòng */}
        <div>
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Giới thiệu bản thân</label>
          <div className="p-3 rounded-3 text-white-50 d-flex align-items-start gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px', lineHeight: '1.5' }}>
            <FiInfo size={15} className="opacity-50 mt-1" style={{ minWidth: '15px' }} />
            {isEditing ? (
              <textarea 
                name="bio"
                rows={3}
                className="bg-transparent border-0 text-white w-100 p-0 shadow-none focus-outline-none custom-textarea" 
                style={{ outline: 'none', resize: 'none', inherit: 'text-white' }}
                value={formData.bio}
                onChange={handleChange}
                disabled={isLoading}
              />
            ) : (
              <span className="text-white">{info?.bio || 'Chưa có thông tin giới thiệu.'}</span>
            )}
          </div>
        </div>
      </form>

    </div>
  );
}

export default InfoForm;