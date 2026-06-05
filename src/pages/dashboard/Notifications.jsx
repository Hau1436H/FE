import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import NotiStats from '../../components/dashboard/notification/NotiStats';
import NotiList from '../../components/dashboard/notification/NotiList';
import ActivityList from '../../components/dashboard/notification/ActivityList';

import { NOTIFICATIONS, ACTIVITIES } from '../../data/notificationData';

function Notification() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [selectedNoti, setSelectedNoti] = useState(null);

  // Khởi tạo biến quản lý phân trang tại trang cha
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const handleNotificationClick = (noti) => {
    setSelectedNoti(noti);
    setNotifications(prevNotis => 
      prevNotis.map(item => 
        item.id === noti.id ? { ...item, isRead: true } : item
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotis => 
      prevNotis.map(noti => ({ ...noti, isRead: true }))
    );
  };

  const dynamicStatsData = useMemo(() => {
    const unreadNotis = notifications.filter(n => !n.isRead).length;
    const unreadJobs = notifications.filter(n => n.type === 'job' && !n.isRead).length;
    const unreadStreaks = notifications.filter(n => n.type === 'streak' && !n.isRead).length;

    const totalXPToday = ACTIVITIES.reduce((sum, act) => {
      const xpNum = parseInt(act.xp.replace(/[^0-9]/g, ''), 10) || 0;
      return sum + xpNum;
    }, 0);

    return [
      { id: 1, icon: "🔔", count: unreadNotis, label: "Thông báo chưa đọc", desc: "Mới nhận", bg: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" },
      { id: 2, icon: "💼", count: unreadJobs, label: "Job Matches mới", desc: "Vị trí phù hợp", bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" },
      { id: 3, icon: "🔥", count: unreadStreaks, label: "Cảnh báo chuỗi", desc: "Cần duy trì", bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" },
      { id: 4, icon: "⏰", count: `+${totalXPToday}`, label: "Hoạt động hôm nay", desc: "XP tích luỹ", bg: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }
    ];
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(noti => {
      let matchesFilter = true;
      if (activeFilter === 'Streak') matchesFilter = noti.type === 'streak';
      else if (activeFilter === 'Job Match') matchesFilter = noti.type === 'job';
      else if (activeFilter === 'Mentor') matchesFilter = noti.type === 'mentor';
      else if (activeFilter === 'Khoá học') matchesFilter = noti.type === 'course';
      else if (activeFilter === 'Assessment') matchesFilter = noti.type === 'assessment';

      return matchesFilter && (
        noti.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        noti.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [notifications, activeFilter, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredNotifications.length / itemsPerPage);
  }, [filteredNotifications, itemsPerPage]);

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />
        
        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>
          <div className="mb-3">
            <h4 className="fw-bold text-white mb-1 fs-5">Thông báo & Hoạt động</h4>
            <p className="text-white-50 extra-small mb-0" style={{ fontSize: '12px' }}>Theo dõi tất cả cập nhật, kết quả học tập và sự kiện của bạn</p>
          </div>

          <NotiStats stats={dynamicStatsData} />

          <div className="row g-4">
            <div className="col-12 col-lg-7 d-flex flex-column">
              <NotiList 
                notifications={filteredNotifications}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onNotificationClick={handleNotificationClick}
                onMarkAllAsRead={handleMarkAllAsRead}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />

              {/* THANH PHÂN TRANG ĐƯỢC ĐẨY RA NGOÀI HỘP ĐEN THEO HÌNH MẪU */}
              {totalPages > 1 && (
                <div className="mt-3 d-flex justify-content-center align-items-center" style={{ minHeight: '40px' }}>
                  <nav>
                    <ul className="pagination mb-0 gap-1">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          type="button"
                          className="page-link rounded-2 border-0 text-white-50"
                          style={{ backgroundColor: '#131520', fontSize: '12.5px' }}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          &laquo; Trước
                        </button>
                      </li>

                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNumber = idx + 1;
                        const isActive = currentPage === pageNumber;
                        return (
                          <li key={pageNumber} className={`page-item ${isActive ? 'active' : ''}`}>
                            <button
                              type="button"
                              className="page-link rounded-2 border-0 fw-semibold"
                              style={{
                                backgroundColor: isActive ? '#0d9488' : '#131520',
                                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                                fontSize: '12.5px',
                                minWidth: '32px',
                                textAlign: 'center'
                              }}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        );
                      })}

                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          type="button"
                          className="page-link rounded-2 border-0 text-white-50"
                          style={{ backgroundColor: '#131520', fontSize: '12.5px' }}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Sau &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>

            <div className="col-12 col-lg-5">
              <ActivityList />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL HIỂN THỊ Ô THÔNG BÁO LỚN */}
      <Modal 
        show={selectedNoti !== null} 
        onHide={() => setSelectedNoti(null)} 
        centered
        contentClassName="border-0 rounded-4"
        style={{ '--bs-modal-bg': '#131520' }}
      >
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-10 p-4">
          <Modal.Title className="fs-5 fw-bold text-white d-flex align-items-center gap-2">
            <span>{selectedNoti?.icon}</span> Chi tiết thông báo
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4 text-white">
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <span className="badge rounded-pill bg-secondary bg-opacity-20 text-white-50 px-2.5 py-1.5" style={{ fontSize: '12px' }}>
              {selectedNoti?.tag}
            </span>
            <small className="text-white-50 opacity-50" style={{ fontSize: '12px' }}>
              {selectedNoti?.time}
            </small>
          </div>
          <h5 className="fw-bold text-white mb-3" style={{ fontSize: '16px', lineHeight: '1.4' }}>
            {selectedNoti?.title}
          </h5>
          <p className="text-white-50 mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
            {selectedNoti?.desc}
          </p>
        </Modal.Body>

        <Modal.Footer className="border-top border-secondary border-opacity-10 p-3">
          <Button variant="transparent" className="text-white-50 border-0 px-3 py-2" style={{ fontSize: '13px' }} onClick={() => setSelectedNoti(null)}>Đóng lại</Button>
          <Button className="px-4 py-2 border-0 rounded-3 fw-medium text-white" style={{ backgroundColor: '#0d9488', fontSize: '13px' }} onClick={() => setSelectedNoti(null)}>{selectedNoti?.actionText || 'Xác nhận →'}</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Notification;
