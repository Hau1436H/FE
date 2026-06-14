import React, { useEffect, useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { BiMap } from 'react-icons/bi';
import { HiOutlineCalendar } from 'react-icons/hi';
import axiosClient from '../../../api/axiosClient';

/**
 * COMPONENT: ProfileCard
 * CHỨC NĂNG CHÍNH: 
 * - Hiển thị ảnh đại diện (Avatar), Họ tên, Chức danh, Địa điểm và Ngày tham gia của người dùng.
 * - Cung cấp nút nhanh để mở tính năng chỉnh sửa hồ sơ tổng quan.
 * - Render danh sách 5 thông số kỹ thuật cốt lõi (XP, Streak, Số kỹ năng, Giờ học, Điểm Test) dạng lưới ngang.
 */
function ProfileCard({ data }) {

  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try{
        const respone = await axiosClient.get('/api/Profile/me');
        const result = respone.data;

        if (result.data){
          setUser(result.data);
        }
      }
      catch(error){
        console.error("Lỗi nạp dữ liệu", error);
      }
    }
    fetchUser();
  }, []);
  return (
    <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      
      {/* KHỐI TRÊN: Thông tin định danh cá nhân & Nút Chỉnh sửa */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 border-bottom border-secondary border-opacity-10 pb-4 mb-4">
        <div className="d-flex gap-3 align-items-center flex-wrap">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.fullName} 
              className="rounded-circle" 
              style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
            />
          ) : (
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: '40px', height: '40px' }}>
             {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            {/* Tên & Badge chức danh công việc */}
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5 className="fw-bold text-white mb-0 fs-5">{user.fullName}</h5>
              <span className="badge text-success rounded-pill px-2.5 py-0.5 extra-small fw-medium" style={{ fontSize: '11px', backgroundColor: 'color-mix(in srgb, var(--accent) 25%, transparent) !important' }}>
                {user.email}
              </span>
            </div>
            {/* Trường đại học và thông tin phụ (Vị trí, ngày tham gia) */}
            <p className="text-white-50 small mb-2" style={{ fontSize: '13px' }}>{data.user.major}</p>
            <div className="d-flex gap-3 text-white-50 extra-small opacity-60" style={{ fontSize: '12px' }}>
              <span className="d-flex align-items-center gap-1"><BiMap size={14} /> {data.user.location}</span>
              <span className="d-flex align-items-center gap-1"><HiOutlineCalendar size={14} /> {data.user.joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI DƯỚI: Vòng lặp kết xuất 5 ô chỉ số học tập (Stats Grid) */}
      <div className="row g-3 text-center">
        {data.stats.map((stat, idx) => (
          <div key={idx} className="col-6 col-md-2.4 col-lg">
            <div className="p-2.5 rounded-3 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255,255,255,0.01)' }}>
              {/* Định dạng màu sắc icon riêng biệt theo từng loại stats */}
              <span className="fs-5 mb-1" style={{ color: stat.color }}>{stat.icon}</span>
              <h6 className="fw-bold text-white mb-0.5" style={{ fontSize: '15px' }}>{stat.value}</h6>
              <small className="text-white-50 extra-small opacity-50" style={{ fontSize: '11px' }}>{stat.label}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileCard;
