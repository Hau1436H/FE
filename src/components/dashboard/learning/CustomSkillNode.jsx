// src/components/dashboard/learning/CustomSkillNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FaLock, FaPlay, FaCheck, FaFire } from 'react-icons/fa'; // BỔ SUNG: FaFire

function CustomSkillNode({ data }) {
  const isCompleted = data.status === 'completed';
  const isLearning = data.status === 'learning';
  const isLocked = data.status === 'locked';
  const isTrending = data.isTrending; // BỔ SUNG: Nhận cờ Trending từ API

  // Định nghĩa hệ màu chủ đạo (Accent Color)
  const accentColor = isCompleted ? '#10b981' : isLearning ? '#f59e0b' : '#4b5563';
  
  // Nền Gradient tạo chiều sâu
  const bgGradient = isLocked 
    ? 'linear-gradient(145deg, #11131e 0%, #0a0b10 100%)' 
    : 'linear-gradient(145deg, #1c1f2e 0%, #11131e 100%)';
  
  // Hiệu ứng phát sáng (Glow) nâng cao khi có Trend
  let glowEffect = '0 4px 6px rgba(0, 0, 0, 0.3)';
  if (isLearning) {
    glowEffect = '0 0 20px rgba(245, 158, 11, 0.25), inset 0 0 8px rgba(245, 158, 11, 0.1)';
  } else if (isCompleted) {
    glowEffect = '0 0 15px rgba(16, 185, 129, 0.15)';
  }
  // BỔ SUNG: Nếu có Trend thì cộng hưởng thêm ánh sáng đỏ rực 🔥
  if (isTrending && !isLocked) {
    glowEffect += ', 0 0 25px rgba(239, 68, 68, 0.3)';
  }

  return (
    <div 
      className="rounded-4 d-flex align-items-center transition-all"
      style={{ 
        width: '320px', 
        minHeight: '90px', 
        background: bgGradient,
        // BỔ SUNG: Nếu có Trend thì viền đổi nhẹ sang sắc cam/đỏ hồng của lửa
        border: `1.5px solid ${isLocked ? '#2d3142' : isTrending ? '#ef4444' : accentColor}`,
        boxShadow: glowEffect,
        opacity: isLocked ? 0.65 : 1,
        padding: '16px 20px',
        position: 'relative'
      }}
    >
      {/* NÚM KẾT NỐI ĐẦU VÀO (Top) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: '#0f111a', 
          border: `2px solid ${isTrending ? '#ef4444' : accentColor}`, 
          width: '14px', 
          height: '14px',
          top: '-7px',
          zIndex: 10
        }} 
      />

      {/* ========================================== */}
      {/* BỔ SUNG: BADGE NGỌN LỬA HOT TREND 🔥 */}
      {/* ========================================== */}
      {isTrending && !isLocked && (
        <div 
          className="position-absolute d-flex align-items-center rounded-pill px-2 py-1"
          style={{
            top: '-12px',
            right: '15px',
            background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#fff',
            boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)',
            zIndex: 11,
            letterSpacing: '0.5px'
          }}
          title={`Điểm xu hướng: ${data.currentTrendScore}/5`}
        >
          <FaFire className="me-1" style={{ animation: 'pulse 1.2s infinite alternate' }} />
          HOT SKILL
        </div>
      )}

      {/* KHỐI ICON */}
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ 
          width: '48px', 
          height: '48px', 
          backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : isLearning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(75, 85, 99, 0.15)',
          border: `1px solid ${isTrending ? '#ef4444' : accentColor}`,
          color: isTrending ? '#ef4444' : accentColor,
          fontSize: '18px'
        }}
      >
        {isCompleted ? <FaCheck /> : isLearning ? <FaPlay style={{ marginLeft: '3px' }} /> : <FaLock />}
      </div>

      {/* NỘI DUNG TEXT */}
      <div className="ms-3 flex-grow-1">
        <h6 
          className="fw-bold mb-1" 
          style={{ 
            fontSize: '15px', 
            color: isLocked ? '#9ca3af' : '#fff', 
            letterSpacing: '0.5px' 
          }}
        >
          {data.label}
        </h6>
        <p 
          className="small m-0 text-white-50" 
          style={{ 
            fontSize: '12px', 
            lineHeight: '1.5',
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}
        >
          {data.description}
        </p>
      </div>

      {/* NÚM KẾT NỐI ĐẦU RA (Bottom) */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          background: '#0f111a', 
          border: `2px solid ${isTrending ? '#ef4444' : accentColor}`, 
          width: '14px', 
          height: '14px',
          bottom: '-7px',
          zIndex: 10
        }} 
      />
    </div>
  );
}

export default CustomSkillNode;