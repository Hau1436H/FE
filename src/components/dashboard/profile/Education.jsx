import React from 'react';
import { FiGrid, FiBookOpen, FiCalendar } from 'react-icons/fi';

/**
 * COMPONENT: Education
 * CHỨC NĂNG CHÍNH:
 * - Trình bày lịch sử học vấn và cơ sở đào tạo đại học của học viên.
 * - Phân chia layout thành 3 cột đều nhau (`col-md-4`) bao gồm: Tên trường, Chuyên ngành, và Năm tốt nghiệp dự kiến.
 * - Gắn sẵn cấu trúc style `p-3` và `gap-3` đồng bộ thiết kế chung của trang hồ sơ cá nhân.
 */
function Education({ edu }) {
  return (
    <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      <div className="text-white-50 text-uppercase fw-bold mb-4" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
        Học vấn
      </div>
      <div className="row g-4">
        {/* Cột 1: Tên Trường Đại học */}
        <div className="col-12 col-md-4">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Trường đại học</label>
          <div className="p-3 rounded-3 text-white d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiBookOpen size={15} className="opacity-50" />
            <span>{edu.school}</span>
          </div>
        </div>
        {/* Cột 2: Tên khối Chuyên ngành */}
        <div className="col-12 col-md-4">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Chuyên ngành</label>
          <div className="p-3 rounded-3 text-white d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiGrid size={15} className="opacity-50" />
            <span>{edu.major}</span>
          </div>
        </div>
        {/* Cột 3: Khối mốc Thời gian / Năm tốt nghiệp */}
        <div className="col-12 col-md-4">
          <label className="text-white-50 extra-small d-block mb-2" style={{ fontSize: '12px', opacity: 0.6 }}>Năm tốt nghiệp</label>
          <div className="p-3 rounded-3 text-white d-flex align-items-center gap-3" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235', fontSize: '13.5px' }}>
            <FiCalendar size={15} className="opacity-50" />
            <span>{edu.gradYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
