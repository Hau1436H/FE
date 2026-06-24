// src/components/dashboard/myJob/MarketTrendChart.jsx
import { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import axiosClient from '../../../api/axiosClient';

// FIX: Chuyển CustomTooltip ra ngoài để không bị tạo lại mỗi lần render
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 rounded" style={{ backgroundColor: '#131520', border: '1px solid #2b2f3a', color: '#fff' }}>
        <p className="mb-0 fw-bold">{payload[0].payload.name}</p>
        <p className="mb-0 text-info small">Độ HOT (Market Demand): {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

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

  // Xử lý dữ liệu cho Bar Chart (Lấy ngày mới nhất và sắp xếp theo % Demand)
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

  // Bảng màu cho các cột
  const colors = ['#17a2b8', '#28a745', '#ffc107', '#dc3545', '#fd7e14', '#6f42c1', '#e83e8c', '#20c997', '#007bff', '#6610f2'];

  if (loading) {
    return <div className="text-center py-5 text-success"><div className="spinner-border"></div></div>;
  }

  if (chartData.length === 0) {
    return <div className="text-center py-5 text-white-50">Chưa có đủ dữ liệu để vẽ biểu đồ. Hãy chạy tính năng Lấy dữ liệu Market mới.</div>;
  }

  return (
    <div className="card bg-dark border-secondary border-opacity-25 p-4 rounded-4 w-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="text-white fw-bold mb-1"><i className="bi bi-bar-chart-fill text-warning me-2"></i>Top Trending Tech Skills</h5>
          <p className="text-white-50 small mb-0">Bảng xếp hạng kỹ năng được nhà tuyển dụng tìm kiếm nhiều nhất hiện tại</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 400, minHeight: '400px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <BarChart 
            data={chartData} 
            layout="vertical" // Chuyển thành cột ngang để tên kỹ năng dài không bị đè lên nhau
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2b2f3a" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              stroke="#a0aec0" 
              tick={{ fill: '#a0aec0', fontSize: 12 }} 
              domain={[0, 100]} 
              tickFormatter={(val) => `${val}%`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#a0aec0" 
              tick={{ fill: '#a0aec0', fontSize: 12, fontWeight: 'bold' }} 
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
            
            <Bar dataKey="demand" radius={[0, 4, 4, 0]} barSize={25}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MarketTrendChart;