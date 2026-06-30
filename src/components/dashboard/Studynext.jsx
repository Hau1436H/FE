import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axiosClient from '../../api/axiosClient';

// ===== Token màu lấy đúng từ mockup HTML =====
const COLORS = {
  bgCard: '#131313',
  border: '#232323',
  borderSoft: '#1A1A1A',
  textPrimary: '#ECECEC',
  textSecondary: '#8C8C8C',
  accentCyan: '#34D399',
  accentCyanDim: 'rgba(52,211,153,0.12)',
  accentAmber: '#F5A623',
  accentAmberDim: 'rgba(245,166,35,0.12)',
};

function StudyNext({ studentId }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tiến trình Roadmap tổng (X/Y kỹ năng = Z%), đồng bộ với Learning.jsx
  const [roadmapProgress, setRoadmapProgress] = useState({
    completed: 0,
    total: 0,
    percent: 0,
    loading: true,
  });

  // Set chứa tên các kỹ năng đã hoàn thành, dùng để hiện trạng thái cho từng item Gap
  const [completedSkillNames, setCompletedSkillNames] = useState(new Set());

  useEffect(() => {
    const fetchGapData = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axiosClient.get(`/api/SkillGapReports/${studentId}/generate`);

        const resultObject = response.data?.data || response.data;
        const rawData = resultObject.gapItems || resultObject.GapItems || [];

        const formattedData = rawData.map(item => ({
          subject: item.nodeName || item.skillName || item.subject || 'Unknown Skill',
          current: item.currentScore || item.current || 0,
          required: item.targetScore || item.required || item.requiredScore || 0,
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu Skill Gap:", err);
        setError("Không thể tải báo cáo phân tích. Vui lòng kiểm tra lại kết nối hoặc Backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchGapData();
  }, [studentId]);

  // Gọi cùng API roadmap mà NodeDrawer.jsx/Learning.jsx dùng, chỉ 1 lần khi mount.
  // Dùng kết quả này để vừa tính % tổng, vừa xác định từng skill đã hoàn thành hay chưa.
  useEffect(() => {
    const fetchRoadmapProgress = async () => {
      try {
        const response = await axiosClient.get('/api/learning-hub/my-roadmap');

        if (response.data && response.data.data) {
          const nodes = response.data.data;
          const total = nodes.length;
          const completedNodes = nodes.filter(n => n.isCompleted);
          const completed = completedNodes.length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          setRoadmapProgress({ completed, total, percent, loading: false });
          setCompletedSkillNames(new Set(completedNodes.map(n => n.nodeName)));
        } else {
          setRoadmapProgress({ completed: 0, total: 0, percent: 0, loading: false });
        }
      } catch (err) {
        console.error("Lỗi lấy tiến trình Roadmap:", err);
        setRoadmapProgress({ completed: 0, total: 0, percent: 0, loading: false });
      }
    };

    fetchRoadmapProgress();
  }, [studentId]);

  const gaps = data
    .filter(item => item.current < item.required)
    .sort((a, b) => (b.required - b.current) - (a.required - a.current));

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border mb-3" style={{ color: COLORS.accentCyan }}></div>
        <p style={{ color: COLORS.textSecondary }}>AI đang tổng hợp và phân tích dữ liệu kỹ năng của bạn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert text-center py-4" style={{ backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#E5635B' }}>
        <i className="bi bi-exclamation-triangle-fill fs-2 d-block mb-2"></i>
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="alert text-center py-4" style={{ backgroundColor: COLORS.accentAmberDim, border: `1px solid ${COLORS.accentAmber}40`, color: COLORS.accentAmber }}>
        <i className="bi bi-info-circle fs-2 d-block mb-2"></i>
        Chưa có đủ dữ liệu để phân tích. Hãy đảm bảo bạn đã chọn "Mục tiêu nghề nghiệp" trong phần Hồ sơ nhé.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">

      {/* KHỐI TIẾN TRÌNH ROADMAP TỔNG - đồng bộ với Learning.jsx */}
      {!roadmapProgress.loading && roadmapProgress.total > 0 && (
        <div
          style={{
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '14px',
            padding: '16px 20px',
          }}
        >
          <div className="d-flex justify-content-between align-items-baseline mb-2">
            <span style={{ fontSize: '13px', color: COLORS.textSecondary, fontWeight: 600 }}>
              Tiến trình Roadmap
            </span>
            <span style={{ fontSize: '13px', color: COLORS.accentCyan, fontWeight: 700 }}>
              {roadmapProgress.completed}/{roadmapProgress.total} kỹ năng · {roadmapProgress.percent}%
            </span>
          </div>
          <div style={{ height: '6px', background: COLORS.borderSoft, borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${roadmapProgress.percent}%`,
                background: COLORS.accentCyan,
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            ></div>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '14px',
          padding: '20px',
        }}
      >
        <h6
          className="d-flex align-items-center mb-3"
          style={{ color: COLORS.textPrimary, fontWeight: 700, fontSize: '14.5px' }}
        >
          <span
            style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: COLORS.accentAmber,
              boxShadow: `0 0 0 3px ${COLORS.accentAmberDim}`,
              display: 'inline-block', marginRight: '10px',
            }}
          ></span>
          Các kỹ năng cần bổ sung (Gap)
        </h6>

        {gaps.length > 0 ? (
          <div className="d-flex flex-column overflow-auto" style={{ maxHeight: '550px', gap: '12px' }}>
            {gaps.map((item, index) => {
              const gapSize = item.required - item.current;
              let priority = "Thấp";
              let priorityStyle = { background: 'rgba(138,146,163,0.15)', color: COLORS.textSecondary };

              if (gapSize >= 40) {
                priority = "Cao";
                priorityStyle = { background: 'rgba(245,166,35,0.15)', color: COLORS.accentAmber };
              } else if (gapSize >= 20) {
                priority = "Trung bình";
                priorityStyle = { background: 'rgba(138,146,163,0.15)', color: COLORS.textSecondary };
              }

              const isCompleted = completedSkillNames.has(item.subject);

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '10px',
                    padding: '16px',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span style={{ fontWeight: 700, fontSize: '14px', color: COLORS.textPrimary }}>{item.subject}</span>
                    <span
                      style={{
                        ...priorityStyle,
                        fontSize: '10px', fontWeight: 700,
                        padding: '3px 8px', borderRadius: '5px',
                        textTransform: 'uppercase', letterSpacing: '0.03em',
                      }}
                    >
                      Ưu tiên: {priority}
                    </span>
                  </div>

                  {/* ĐÃ SỬA: thay % Hiện tại/Mục tiêu bằng trạng thái hoàn thành kỹ năng,
                      lấy từ roadmap API (cùng nguồn isCompleted mà NodeDrawer/Learning dùng) */}
                  <div className="d-flex align-items-center mb-3" style={{ fontSize: '11.5px' }}>
                    {isCompleted ? (
                      <span className="d-flex align-items-center" style={{ color: COLORS.accentCyan, fontWeight: 600, gap: '6px' }}>
                        <i className="bi bi-check-circle-fill"></i> Đã hoàn thành
                      </span>
                    ) : (
                      <span className="d-flex align-items-center" style={{ color: COLORS.textSecondary, fontWeight: 600, gap: '6px' }}>
                        <i className="bi bi-circle"></i> Chưa hoàn thành
                      </span>
                    )}
                  </div>

                  <div
                    className="d-flex justify-content-between align-items-center pt-3 mt-3"
                    style={{ borderTop: `1px solid ${COLORS.border}` }}
                  >
                    <span style={{ fontSize: '11px', color: COLORS.textSecondary }}>Hệ thống đã chuẩn bị bài học</span>
                    <button
                      onClick={() => navigate(`/dashboard/learning?skill=${encodeURIComponent(item.subject)}`)}
                      style={{
                        fontSize: '11.5px', fontWeight: 700,
                        color: '#04141A',
                        background: COLORS.accentCyan,
                        border: `1px solid ${COLORS.accentCyan}`,
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '5px',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      <i className="bi bi-play-circle"></i>Học ngay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-4 h-100 d-flex flex-column justify-content-center"
            style={{ backgroundColor: COLORS.accentCyanDim, border: `1px solid ${COLORS.accentCyan}40`, borderRadius: '10px', color: COLORS.accentCyan }}
          >
            <i className="bi bi-check-circle-fill fs-1 d-block mb-2"></i>
            Tuyệt vời! Kỹ năng của bạn đã đáp ứng đầy đủ yêu cầu của vị trí mục tiêu. Hãy tự tin ứng tuyển nhé!
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyNext;