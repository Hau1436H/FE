import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

function NotiList({ 
  notifications = [], 
  activeFilter, 
  setActiveFilter, 
  searchQuery, 
  setSearchQuery, 
  onNotificationClick, 
  onMarkAllAsRead,
  currentPage,
  itemsPerPage
}) {
  const filters = ['Tất cả', 'Streak', 'Job Match', 'Mentor', 'Khoá học', 'Assessment'];

  // Cắt mảng dữ liệu lấy các mục của trang hiện tại
  const displayNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tính toán số lượng thông báo chưa đọc động cho riêng tiêu đề hộp
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div 
      className="rounded-4 p-4 d-flex flex-column" 
      style={{ 
        backgroundColor: '#131520', 
        border: '1px solid #1e2235',
        padding: '32px', 
        height: '650px', 
        minWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      
      {/* 1. Header hộp (Đã cập nhật thông báo động và fix bg-opacity-25) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <h6 className="fw-bold text-white mb-0" style={{ fontSize: '15px' }}>Thông báo</h6>
          {unreadCount > 0 && (
            <span className="badge bg-danger bg-opacity-25 text-danger rounded-pill px-2 py-0.5" style={{ fontSize: '11px' }}>
              {unreadCount} mới
            </span>
          )}
        </div>
        <button 
          type="button"
          className="btn btn-sm text-white-50 p-0 border-0" 
          style={{ fontSize: '12px' }}
          onClick={onMarkAllAsRead}
        >
          Đọc tất cả
        </button>
      </div>

      {/* 2. Ô tìm kiếm */}
      <input 
        type="text" 
        className="form-control border-0 text-white py-1.5 px-3 mb-3" 
        placeholder="Tìm kiếm thông báo..." 
        style={{ backgroundColor: '#1c1e2d', fontSize: '12.5px', borderRadius: '6px' }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* 3. Tabs viên thuốc bộ lọc */}
      <div className="d-flex flex-wrap gap-1.5 mb-3">
        {filters.map(f => {
          const isSelected = activeFilter === f;
          return (
            <button
              key={f}
              type="button"
              className="btn btn-sm rounded-pill px-2.5 py-0.5 border-0 text-nowrap fw-medium"
              style={{
                backgroundColor: isSelected ? 'color-mix(in srgb, var(--accent) 25%, transparent)' : 'rgba(255,255,255,0.03)',
                color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '11.5px'
              }}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'Tất cả' ? '⚙ Tất cả' : f}
            </button>
          );
        })}
      </div>

      <div className="text-white-50 extra-small text-uppercase fw-bold opacity-40 mb-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
        DANH SÁCH CẬP NHẬT
      </div>

      {/* 4. Khu vực chứa danh sách thông báo */}
      <div className="d-flex flex-column gap-3 flex-grow-1 mb-2">
        {displayNotifications.length > 0 ? (
          displayNotifications.map((noti) => (
            <div 
              key={noti.id} 
              className="d-flex gap-3 pb-3 border-bottom border-secondary border-opacity-10 align-items-start position-relative transition-all"
              onClick={() => onNotificationClick(noti)}
              style={{ 
                cursor: 'pointer',
                opacity: noti.isRead ? 0.55 : 1
              }}
            >
              {/* Icon đại diện */}
               <i className={noti.icon} style={{ color: noti.color, fontSize: '20px' }}></i>

              {/* Chi tiết nội dung văn bản */}
              <div className="flex-grow-1 pe-3">
                <div className="d-flex justify-content-between align-items-baseline">
                  <h6 className={`mb-0.5 ${noti.isRead ? 'fw-normal' : 'fw-bold'} text-white`} style={{ fontSize: '13.5px' }}>
                    {noti.title}
                  </h6>
                  <span className="text-white-50 opacity-40 extra-small text-nowrap" style={{ fontSize: '11px' }}>{noti.time}</span>
                </div>
                <p className="text-white-50 mb-1.5 line-clamp-1" style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
                   {noti.desc.length > 80
                    ? `${noti.desc.substring(0, 80)}...` 
                    : noti.desc
                  }
                </p>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge rounded-pill bg-secondary bg-opacity-25 text-white-50 fw-normal px-2 py-0.5" style={{ fontSize: '11px' }}>{noti.tag}</span>
                  <button type="button" className="btn btn-link text-primary p-0 border-0 fw-semibold extra-small" style={{ fontSize: '11px', textDecoration: 'none' }}>
                    {noti.actionText}
                  </button>
                </div>
              </div>

              {/* Chấm tròn tin tức mới */}
              {!noti.isRead && (
                <span 
                  className="position-absolute rounded-circle"
                  style={{ width: '7px', height: '7px', backgroundColor: '#0d9488', top: '8px', end: '4px' }}
                />
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-white-50 small my-auto py-5">
            📭 Không có thông báo nào được hiển thị.
          </div>
        )}
      </div>

    </div>
  );
}

export default NotiList;
