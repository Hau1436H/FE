import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import axiosClient from '../../api/axiosClient';

// ===== Token màu lấy đúng từ mockup HTML =====
const COLORS = {
  bgCard: '#131313',
  border: '#232323',
  textPrimary: '#ECECEC',
  textSecondary: '#8C8C8C',
  accentCyan: '#34D399',
  accentCyanDim: 'rgba(52,211,153,0.12)',
  accentAmber: '#F5A623',
};

// Tooltip tùy biến: nền/viền/chữ khớp với .card trong mockup thay vì tooltip mặc định của recharts
const CustomRadarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#131313',
          border: '1px solid #232323',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '12.5px',
        }}
      >
        <p style={{ margin: 0, marginBottom: 6, color: COLORS.textPrimary, fontWeight: 700 }}>{label}</p>
        {payload.map((p, idx) => (
          <p key={idx} style={{ margin: 0, color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function LearningPath({ studentId }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  
  // ĐÃ THÊM: State lưu trữ AI Summary và Target Role Name
  const [aiSummary, setAiSummary] = useState("");
  const [roleName, setRoleName] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGapData = async () => {
      // SỬA LỖI XOAY VÒNG: Phải tắt loading nếu không có ID
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
        
        setAiSummary(resultObject.latentTalentSummary || resultObject.LatentTalentSummary || "");
        setRoleName(resultObject.targetRoleName || resultObject.TargetRoleName || "Chưa xác định");
        
        const formattedData = rawData.map(item => ({
          subject: item.nodeName || item.skillName || item.subject || 'Unknown Skill',
          current: item.currentScore || item.current || 0,
          required: item.targetScore || item.required || item.requiredScore || 0,
          fullMark: 100
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
      <div className="alert text-center py-4" style={{ backgroundColor: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', color: COLORS.accentAmber }}>
        <i className="bi bi-info-circle fs-2 d-block mb-2"></i>
        Chưa có đủ dữ liệu để phân tích. Hãy đảm bảo bạn đã chọn "Mục tiêu nghề nghiệp" trong phần Hồ sơ nhé.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">

      {/* KHỐI AI SUMMARY - style giống .ai-banner trong mockup */}
      <div
        className="d-flex align-items-center"
        style={{
          background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.05))',
          border: '1px solid rgba(52,211,153,0.25)',
          borderRadius: '14px',
          padding: '16px 20px',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '34px', height: '34px', flexShrink: 0,
            borderRadius: '9px',
            background: COLORS.accentCyanDim,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}
        >
          🤖
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '13.5px', color: COLORS.accentCyan, marginBottom: '2px' }}>
            AI Profile Summary &amp; Lời khuyên
          </div>
          <div style={{ color: COLORS.textSecondary, fontSize: '13px' }}>
            {aiSummary || "Hệ thống đang thu thập thêm dữ liệu để phân tích năng lực cốt lõi của bạn."}
          </div>
        </div>
      </div>

      {/* KHỐI RADAR - style card giống mockup, biểu đồ dùng recharts */}
      <div
        style={{
          backgroundColor: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '14px',
          padding: '24px',
        }}
      >
        <div style={{ fontSize: '13px', color: COLORS.textSecondary, textAlign: 'center', marginBottom: '14px' }}>
          Tương quan năng lực so với: <b style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{roleName}</b>
        </div>

        <div style={{ width: '100%', height: '460px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
              <PolarGrid stroke={COLORS.border} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: COLORS.textSecondary, fontSize: 11.5, fontFamily: 'Inter, sans-serif' }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip content={<CustomRadarTooltip />} />

              {/* Yêu cầu thị trường: amber, vẽ trước (nằm dưới) - khớp mockup */}
              <Radar
                name="Yêu cầu thị trường"
                dataKey="required"
                stroke={COLORS.accentAmber}
                fill={COLORS.accentAmber}
                fillOpacity={0.08}
                strokeWidth={2}
              />
              {/* Năng lực của bạn: cyan, vẽ sau (nằm trên) - khớp mockup */}
              <Radar
                name="Năng lực của bạn"
                dataKey="current"
                stroke={COLORS.accentCyan}
                fill={COLORS.accentCyan}
                fillOpacity={0.16}
                strokeWidth={2.5}
                dot={{ r: 3, fill: COLORS.accentCyan, strokeWidth: 0 }}
              />

              <Legend
                wrapperStyle={{ fontSize: '12.5px', paddingTop: '16px', color: COLORS.textSecondary }}
                iconType="circle"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default LearningPath;