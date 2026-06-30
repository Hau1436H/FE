// src/components/dashboard/myJob/MarketTrendChart.jsx
import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../api/axiosClient';

// ===== Token màu lấy đúng từ mockup HTML =====
const COLORS = {
  bgCard: '#131313',
  border: '#232323',
  borderSoft: '#1A1A1A',
  textPrimary: '#ECECEC',
  textSecondary: '#8C8C8C',
  textTertiary: '#5C5C5C',
};

// Bảng màu mỗi cột, đồng bộ tông nền đen + xanh lá chủ đạo (giữ đúng dải màu
// trong mockup .bars-list, bỏ đỏ ra khỏi palette vì không hợp ngữ nghĩa "độ HOT")
const BAR_COLORS = [
  '#34D399', '#34D399', '#F5C453', '#F5A623', '#F58A4D',
  '#A78BFA', '#F472B6', '#2DD4BF', '#60A5FA', '#8B5CF6',
];

function MarketTrendChart() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/api/v1/MarketPulse/trends?days=30');
        
        const actualData = response.data?.data || response.data;
        setRawData(Array.isArray(actualData) ? actualData : []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu xu hướng:", error);
        setRawData([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  // Xử lý dữ liệu cho thanh bar (Lấy ngày mới nhất và sắp xếp theo % Demand)
  const chartData = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) return [];

    const latestSkillDemand = {};

    rawData.forEach(skillGroup => {
      const skillName = skillGroup.nodeName || skillGroup.NodeName;
      if (!skillName) return;

      const points = skillGroup.dataPoints || skillGroup.DataPoints || [];
      if (Array.isArray(points) && points.length > 0) {
        // Sắp xếp giảm dần theo thời gian để lấy record mới nhất của kỹ năng đó
        const sortedPoints = [...points].sort((a, b) => 
          new Date(b.analyzedDate || b.AnalyzedDate) - new Date(a.analyzedDate || a.AnalyzedDate)
        );
        latestSkillDemand[skillName] = sortedPoints[0].demandPercent || sortedPoints[0].DemandPercent || 0;
      }
    });

    // Chuyển object thành mảng, sắp xếp giảm dần theo Demand và lấy Top 10
    return Object.entries(latestSkillDemand)
      .map(([name, demand]) => ({ name, demand }))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 10);
  }, [rawData]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#34D399' }}></div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center py-5" style={{ color: COLORS.textSecondary }}>
        Chưa có đủ dữ liệu để vẽ biểu đồ. Hãy chạy tính năng Lấy dữ liệu Market mới.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '14px',
        padding: '24px',
      }}
    >
      <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '18px' }}>
        Xu hướng thị trường hiện tại
      </div>

      <div className="d-flex flex-column" style={{ gap: '14px' }}>
        {chartData.map((d, index) => (
          <div
            key={d.name}
            className="d-grid align-items-center"
            style={{ gridTemplateColumns: '130px 1fr 42px', gap: '12px', display: 'grid' }}
          >
            <div
              style={{
                fontSize: '12.5px',
                color: COLORS.textSecondary,
                fontWeight: 500,
                textAlign: 'right',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={d.name}
            >
              {d.name}
            </div>
            <div style={{ height: '9px', background: COLORS.borderSoft, borderRadius: '5px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${d.demand}%`,
                  background: BAR_COLORS[index % BAR_COLORS.length],
                  borderRadius: '5px',
                }}
              ></div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, monospace", fontSize: '11.5px', color: COLORS.textTertiary }}>
              {d.demand}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketTrendChart;