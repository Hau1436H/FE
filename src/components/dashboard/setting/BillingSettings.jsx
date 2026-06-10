import React, { useMemo, useState } from 'react';
import { useAppSettings } from './AppSettingsContext';
import { pricingPlans, usageMetrics, invoiceHistory } from '../../../data/billingData';

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
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="card border-0 rounded-4 p-4 h-100" style={{ backgroundColor: '#101827', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-white-50 small mb-2">Ưu tiên hỗ trợ</div>
                <h6 className="text-white mb-4">Hạ cấp</h6>
                <p className="text-white-50 small">Thu gọn gói nếu bạn muốn tiết kiệm hơn nữa.</p>
                <button type="button" className="btn btn-outline-light rounded-pill mt-4">Hạ cấp</button>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 rounded-4 h-100" style={{ backgroundColor: accentObj.value, color: '#fff' }}>
                <div className="p-4">
                  <div className="text-white-50 small mb-2">Gói hiện tại</div>
                  <h5 className="fw-semibold mb-3">{currentPlan.name}</h5>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <div className="fw-bold fs-4">{formatPrice(planPrice)}</div>
                      <div className="small opacity-75">{billingCycle === 'monthly' ? '/ tháng' : '/ năm'}</div>
                    </div>
                    <span className="badge rounded-pill bg-white text-dark">Pro</span>
                  </div>
                  <p className="mb-3 small opacity-75">Gia hạn tiếp theo: 15/06/2026</p>
                  <button type="button" className="btn btn-light text-dark rounded-pill w-100">Đang dùng</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 rounded-4 p-4 h-100" style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-white-50 small mb-2">Ưu tiên hỗ trợ 24/7</div>
                <h6 className="text-white mb-4">Nâng cấp</h6>
                <p className="text-white-50 small">Mở khóa toàn bộ tính năng cao cấp và ưu tiên hỗ trợ.</p>
                <button type="button" className="btn btn-warning rounded-pill mt-4 w-100">Nâng cấp</button>
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
                  <div key={plan.id} className="col-12 col-xl-4">
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
          <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-3">
            <div>
              <h5 className="text-white mb-1">Sử dụng tháng này</h5>
              <p className="text-white-50 mb-0 small">Theo dõi giới hạn và mức sử dụng hiện tại.</p>
            </div>
            <span className="badge rounded-pill bg-primary bg-opacity-10 text-info">Cập nhật gần nhất</span>
          </div>
          <div className="row g-3">
            {usageMetrics.map((metric) => {
              const percent = Math.round((metric.used / metric.total) * 100);
              return (
                <div key={metric.label} className="col-12 col-md-6 col-xl-4">
                  <div className="card border-0 rounded-4 p-4 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <div className="text-white small mb-1">{metric.label}</div>
                        <div className="text-white fw-semibold" style={{ fontSize: '1.35rem' }}>{metric.used}/{metric.total} {metric.unit}</div>
                      </div>
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, backgroundColor: metric.color + '33' }}>
                        <span className="text-white small">{percent}%</span>
                      </div>
                    </div>
                    <div className="progress" style={{ height: 10, backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${percent}%`, backgroundColor: metric.color }} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" />
                    </div>
                    <div className="text-white-50 small mt-2">{percent}% đã dùng</div>
                  </div>
                </div>
              );
            })}
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
              <table className="table table-borderless mb-0 text-white align-middle">
                <thead>
                  <tr className="text-white-50 small">
                    <th>Ngày</th>
                    <th>Gói</th>
                    <th className="text-end">Số tiền</th>
                    <th>Trạng thái</th>
                    <th>Hoá đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceHistory.map((invoice) => (
                    <tr key={invoice.invoiceId} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <td className="align-middle text-white-50" style={{ width: '100px' }}>{invoice.date}</td>
                      <td className="align-middle text-white">{invoice.plan}</td>
                      <td className="align-middle text-end text-white fw-semibold">{invoice.amount}</td>
                      <td className="align-middle">
                        <span className="badge rounded-pill bg-success bg-opacity-10 text-success small">{invoice.status}</span>
                      </td>
                      <td className="align-middle text-white-50 small">{invoice.invoiceId}</td>
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
