import React from 'react';

/**
 * COMPONENT: Badges
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị bộ sưu tập các Huy chương/Thành tích học viên đã đạt được trong quá trình học tập.
 * - Nhận mảng dữ liệu `badges` để render tự động theo hàng ngang.
 * - Sử dụng thuộc tính `WebkitLineClamp` bảo vệ lề text mô tả ngắn gọn nằm gọn gàng trên 1 dòng.
 */
function Badges({ badges }) {
  return (
    <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: '#131520', border: '1px solid #1e2235' }}>
      <div className="text-white-50 text-uppercase fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
       Thành tích & Huy hiệu
      </div>
      <div className="row g-3">
        {badges.map(badge => (
          <div key={badge.id} className="col-12 col-sm-6 col-lg">
            {/* Khung ô Huy hiệu phụ nền xám tối */}
            <div className="p-3 rounded-4 h-100 d-flex gap-3 align-items-center" style={{ backgroundColor: '#0f111a', border: '1px solid #1e2235' }}>
              {/* Khu vực chứa Icon huy hiệu nền vòng mờ */}
              <div className="fs-4 p-2 rounded-3 d-flex align-items-center justify-content-center bg-secondary bg-opacity-10" style={{ width: '42px', height: '42px', minWidth: '42px' }}>
                {badge.icon}
              </div>
              <div>
                <h6 className="fw-semibold text-white mb-0.5" style={{ fontSize: '13px' }}>{badge.title}</h6>
                {/* Text mô tả huy hiệu - Tự động thu gọn bằng ... nếu chữ quá dài */}
                <small className="text-white-50 d-block" style={{ fontSize: '11.5px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {badge.desc}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Badges;
