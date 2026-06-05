import React from 'react';
import { FiUser, FiFileText, FiMessageSquare, FiSettings } from 'react-icons/fi';

/**
 * COMPONENT: ProfileNav
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị thanh Menu Tab ngang phân mảnh các chức năng trong quản lý tài khoản.
 * - Điều khiển State chuyển trang cục bộ thông qua hàm callback `setActiveTab` từ cha truyền xuống.
 * - Tự động thay đổi phong cách hiển thị (Màu sắc và nền) dựa trên tab đang kích hoạt (`isActive`).
 */
function ProfileNav({ activeTab, setActiveTab }) {
  // Định nghĩa mảng cấu trúc danh sách các Menu Tab phụ
  const tabs = [
    { id: 'profile', text: 'Hồ sơ cá nhân', icon: <FiUser size={14} /> },
    { id: 'assessment', text: 'Assessment', icon: <FiFileText size={14} /> },
    { id: 'chat', text: 'AI Chat History', icon: <FiMessageSquare size={14} /> },
    { id: 'settings', text: 'Cài đặt', icon: <FiSettings size={14} /> }
  ];

  return (
    <div className="d-flex gap-1 mb-4 border-bottom border-secondary border-opacity-10 pb-2 flex-wrap">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className="btn btn-sm border-0 rounded-3 px-3 py-2 d-flex align-items-center gap-2 fw-medium transition-all"
            style={{
              // Sử dụng nền mờ xám nhẹ và chữ trắng sáng khi tab được lựa chọn kích hoạt
              backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: '13px'
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.text}
          </button>
        );
      })}
    </div>
  );
}

export default ProfileNav;
