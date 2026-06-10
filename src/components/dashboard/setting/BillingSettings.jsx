import React, { useMemo, useState } from 'react';
import { useAppSettings } from './AppSettingsContext';

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Miễn phí cho người mới bắt đầu',
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    buttonText: 'Hạ cấp',
    buttonVariant: 'outline-light',
    isActive: false,
    disabled: false,
    features: [
      { label: 'Truy cập giới hạn thư viện khoá học', included: true },
      { label: 'AI đề xuất cơ bản', included: true },
      { label: 'Job matches cơ bản', included: true },
      { label: 'Hỗ trợ mentor', included: false },
      { label: 'Báo cáo nâng cao', included: false },
      { label: 'Tài liệu premium', included: false },
      { label: 'Ưu tiên hỗ trợ', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Tiết kiệm thời gian với bộ công cụ nâng cao',
    monthlyPrice: 49,
    yearlyPrice: 470,
    badge: 'Phổ biến',
    buttonText: 'Đang dùng',
    buttonVariant: 'success',
    isActive: true,
    disabled: true,
    features: [
      { label: 'Thư viện khoá học không giới hạn', included: true },
      { label: 'AI đề xuất nâng cao', included: true },
      { label: 'Job matches ưu tiên', included: true },
      { label: 'Hỗ trợ mentor cơ bản', included: true },
      { label: 'Báo cáo tiến độ chi tiết', included: true },
      { label: 'Mẫu code premium', included: false },
      { label: 'Ưu tiên hỗ trợ', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Toàn diện cho đội nhóm và dự án lớn',
    monthlyPrice: 99,
    yearlyPrice: 948,
    badge: 'Toàn diện',
    buttonText: 'Nâng cấp',
    buttonVariant: 'warning',
    isActive: false,
    disabled: false,
    features: [
      { label: 'Thư viện khoá học không giới hạn', included: true },
      { label: 'AI đề xuất cao cấp', included: true },
      { label: 'Job matches ưu tiên + phỏng vấn', included: true },
      { label: 'Hỗ trợ mentor 1:1', included: true },
      { label: 'Báo cáo nâng cao & phân tích', included: true },
      { label: 'Tài liệu premium mở rộng', included: true },
      { label: 'Ưu tiên hỗ trợ 24/7', included: true },
    ],
  },
];

const usageMetrics = [
  { label: 'AI Chat', used: 312, total: 500, unit: 'lượt', color: '#22c55e' },
  { label: 'Khoá học', used: 18, total: 30, unit: 'khóa', color: '#38bdf8' },
  { label: 'Job Matches', used: 3, total: 5, unit: 'buổi', color: '#f59e0b' },
  { label: 'Mentor', used: 3, total: 5, unit: 'buổi', color: '#a855f7' },
];

const invoiceHistory = [
  { date: '15/05/2026', description: 'Thanh toán gói Pro - Hàng tháng', amount: '₫49.000', status: 'Đã thanh toán' },
  { date: '15/04/2026', description: 'Thanh toán gói Pro - Hàng tháng', amount: '₫49.000', status: 'Đã thanh toán' },
  { date: '15/03/2026', description: 'Thanh toán gói Pro - Hàng tháng', amount: '₫49.000', status: 'Đã thanh toán' },
];

function BillingSettings() {
  const { accentObj } = useAppSettings();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const currentPlan = pricingPlans.find((plan) => plan.isActive);

  const planPrice = useMemo(
    () => (billingCycle === 'monthly' ? currentPlan.monthlyPrice : currentPlan.yearlyPrice),
    [billingCycle, currentPlan],
  );

  const cycleLabel = billingCycle === 'monthly' ? 'Hàng tháng' : 'Hàng năm (-20%)';

  const formatPrice = (value) => (value === 0 ? 'Miễn phí' : `₫${value.toLocaleString('vi-VN')}`);

  return (
    <>
      <div className="row gy-4">
        <div className="col-12">
          <div className="card border-0 rounded-4 overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
            <div className="p-4" style={{ background: `linear-gradient(135deg, ${accentObj.value}30, ${accentObj.dark}20)` }}>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div>
                  <div className="text-white opacity-75 small">Gói hiện tại</div>
                  <h5 className="mb-1 text-white">{currentPlan.name}</h5>
                  <div className="text-white-50 small">{cycleLabel} · Gia hạn tiếp theo: 15/06/2026</div>
                </div>
                <div className="text-white text-end">
                  <div className="fw-semibold fs-4">{formatPrice(planPrice)}</div>
                  <div className="small text-white-50">{billingCycle === 'monthly' ? '/ tháng' : '/ năm'}</div>
                </div>
                <button type="button" className="btn btn-danger rounded-pill px-4" onClick={() => setShowCancelModal(true)}>
                  Huỷ gói
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card border-0 rounded-4 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-4">
              <div>
                <h5 className="text-white mb-1">Chọn gói</h5>
                <p className="text-white-50 mb-0">Tùy chỉnh gói đăng ký phù hợp với nhu cầu.</p>
              </div>
              <div className="btn-group rounded-pill overflow-hidden" role="group" aria-label="Billing cycle">
                <button
                  type="button"
                  className={`btn btn-sm ${billingCycle === 'monthly' ? 'btn-light text-dark' : 'btn-outline-light text-white-50'}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Hàng tháng
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${billingCycle === 'yearly' ? 'btn-light text-dark' : 'btn-outline-light text-white-50'}`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Hàng năm (-20%)
                </button>
              </div>
            </div>

            <div className="row g-3">
              {pricingPlans.map((plan) => {
                const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
                const isActive = plan.isActive;
                return (
                  <div key={plan.id} className="col-12 col-md-4">
                    <div className={`card h-100 border-0 rounded-4 ${isActive ? 'border border-success' : 'border border-secondary'} p-4`} style={{ backgroundColor: isActive ? '#152e21' : 'rgba(255,255,255,0.04)' }}>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="mb-1 text-white">{plan.name}</h6>
                          <p className="text-white-50 small mb-0">{plan.description}</p>
                        </div>
                        {plan.badge ? (
                          <span className={`badge rounded-pill ${plan.id === 'premium' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{plan.badge}</span>
                        ) : null}
                      </div>
                      <div className="mb-4">
                        <div className="text-white fw-semibold" style={{ fontSize: '1.75rem' }}>{formatPrice(price)}</div>
                        <div className="text-white-50 small">{billingCycle === 'monthly' ? 'mỗi tháng' : 'mỗi năm'}</div>
                      </div>
                      <button
                        type="button"
                        className={`btn btn-${plan.buttonVariant} w-100 rounded-pill ${plan.disabled ? 'disabled' : ''}`}
                        disabled={plan.disabled}
                      >
                        {plan.buttonText}
                      </button>
                      {isActive ? <div className="mt-3 badge bg-success bg-opacity-10 text-success">Đang dùng</div> : null}
                      <div className="mt-4">
                        {plan.features.map((feature) => (
                          <div key={feature.label} className="d-flex align-items-center gap-2 mb-2">
                            <span className={`fw-semibold ${feature.included ? 'text-success' : 'text-white-50'}`} style={{ width: 20 }}>
                              {feature.included ? '✓' : '✕'}
                            </span>
                            <span className={`small ${feature.included ? 'text-white' : 'text-white-50'}`}>{feature.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card border-0 rounded-4 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="text-white mb-1">Sử dụng tháng này</h5>
                <p className="text-white-50 mb-0 small">Theo dõi tốc độ sử dụng tính năng trong tháng.</p>
              </div>
              <span className="badge rounded-pill bg-primary bg-opacity-10 text-info">Cập nhật gần nhất</span>
            </div>
            <div className="mt-3">
              {usageMetrics.map((metric) => {
                const percent = Math.round((metric.used / metric.total) * 100);
                return (
                  <div key={metric.label} className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-white small">{metric.label}</span>
                      <span className="text-white-50 small">{metric.used}/{metric.total} {metric.unit} · {percent}%</span>
                    </div>
                    <div className="progress" style={{ height: 10, backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${percent}%`, backgroundColor: metric.color }} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card border-0 rounded-4 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="text-white mb-1">Lịch sử hoá đơn</h5>
                <p className="text-white-50 mb-0 small">Các hoá đơn thanh toán đã hoàn tất.</p>
              </div>
              <button type="button" className="btn btn-sm btn-outline-light rounded-pill">Xem tất cả</button>
            </div>
            <div className="table-responsive">
              <table className="table table-borderless mb-0 text-white">
                <thead>
                  <tr className="text-white-50 small">
                    <th>Ngày</th>
                    <th>Mô tả</th>
                    <th className="text-end">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceHistory.map((invoice) => (
                    <tr key={invoice.date} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <td className="align-middle text-white-50" style={{ width: '110px' }}>{invoice.date}</td>
                      <td className="align-middle">
                        <div>{invoice.description}</div>
                        <span className="badge rounded-pill bg-success bg-opacity-10 text-success small">{invoice.status}</span>
                      </td>
                      <td className="align-middle text-end text-white fw-semibold">{invoice.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal ? (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="card rounded-4 border-0 p-4" style={{ width: 'min(540px, 95vw)', backgroundColor: '#08101a' }}>
            <div className="mb-3">
              <h5 className="text-white mb-1">Xác nhận huỷ gói</h5>
              <p className="text-white-50 mb-0">Bạn có chắc chắn muốn huỷ gói {currentPlan.name} ({cycleLabel}, {formatPrice(planPrice)})? Bạn sẽ mất quyền truy cập vào các tính năng nâng cao từ lần gia hạn tiếp theo.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap mt-4">
              <button type="button" className="btn btn-danger rounded-pill px-4" onClick={() => setShowCancelModal(false)}>
                Xác nhận huỷ
              </button>
              <button type="button" className="btn btn-outline-light rounded-pill px-4" onClick={() => setShowCancelModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default BillingSettings;
