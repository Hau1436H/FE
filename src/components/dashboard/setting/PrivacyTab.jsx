import React from 'react';

function PrivacyTab({ privacyPrefs, togglePrivacy }) {
  return (
    <div className="card border-0 rounded-4 p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <h5 className="text-white mb-1">Quyền riêng tư & Bảo mật</h5>
      <p className="text-white-50 small mb-4">Kiểm soát hồ sơ công khai, xác thực hai bước và các thiết bị đang đăng nhập.</p>

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-6">
          <div className="rounded-4 p-3 border h-100" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="d-flex align-items-center justify-content-between mb-2 gap-2">
              <strong className="text-white">Hiển thị hồ sơ công khai</strong>
              <button
                type="button"
                onClick={() => togglePrivacy('publicProfile')}
                className={`btn btn-sm rounded-pill ${privacyPrefs.publicProfile ? 'btn-success' : 'btn-outline-light'}`}
              >
                {privacyPrefs.publicProfile ? 'Bật' : 'Tắt'}
              </button>
            </div>
            <p className="text-white-50 small mb-0">Cho phép người khác xem hồ sơ và thành tích của bạn trên trang cộng đồng.</p>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="rounded-4 p-3 border h-100" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="d-flex align-items-center justify-content-between mb-2 gap-2">
              <strong className="text-white">Xác thực 2 bước</strong>
              <button
                type="button"
                onClick={() => togglePrivacy('twoFactor')}
                className={`btn btn-sm rounded-pill ${privacyPrefs.twoFactor ? 'btn-success' : 'btn-outline-light'}`}
              >
                {privacyPrefs.twoFactor ? 'Bật' : 'Tắt'}
              </button>
            </div>
            <p className="text-white-50 small mb-0">Bảo vệ tài khoản bằng mã xác minh khi đăng nhập trên thiết bị mới.</p>
          </div>
        </div>
      </div>

      <div className="rounded-4 p-3 border mb-3" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div>
            <strong className="text-white">Thiết bị đang đăng nhập</strong>
            <p className="text-white-50 small mb-0">3 thiết bị đang hoạt động gần đây.</p>
          </div>
          <span className="badge rounded-pill bg-info bg-opacity-10 text-info">3 hoạt động</span>
        </div>
      </div>

      <div className="rounded-4 p-3 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div>
            <strong className="text-white">Dữ liệu của bạn</strong>
            <p className="text-white-50 small mb-0">Bạn có thể tải xuống bản sao dữ liệu hoặc xoá lịch sử hoạt động tại đây.</p>
          </div>
          <button type="button" className="btn btn-outline-light btn-sm rounded-pill">Quản lý</button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyTab;
