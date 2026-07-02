// src/components/dashboard/learning/CustomSkillNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FaLock, FaPlay, FaCheck, FaFire } from 'react-icons/fa';

function CustomSkillNode({ data }) {
  const isCompleted = data.status === 'completed';
  const isLearning = data.status === 'learning';
  const isLocked = data.status === 'locked';
  const isTrending = data.isTrending;

  // DESIGN MỚI: Đổi màu Learning sang Xanh dương (Tech Blue) để cây không bị vàng.
  const accentColor = isCompleted ? '#10b981' : isLearning ? '#3b82f6' : '#4b5563';
  
  // Màu viền và icon: Ưu tiên màu Lửa nếu là Hot Trend, ngược lại dùng màu chủ đạo
  const activeColor = (isTrending && !isLocked) ? '#ef4444' : accentColor;
  
  // Nền Gradient tạo chiều sâu (Darker theme)
  const bgGradient = isLocked 
    ? 'linear-gradient(145deg, #11131e 0%, #0a0b10 100%)' 
    : 'linear-gradient(145deg, #1a1d2d 0%, #11131e 100%)';
  
  // Hiệu ứng phát sáng (Glow) tinh tế hơn
  let glowEffect = '0 4px 10px rgba(0,0,0,0.4)';
  if (isTrending && !isLocked) {
    // Trending: Tỏa sáng rực lửa
    glowEffect = '0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.15)';
  } else if (isLearning) {
    // Learning: Sáng nhẹ màu xanh blue dịu mắt
    glowEffect = '0 0 15px rgba(59, 130, 246, 0.2)';
  } else if (isCompleted) {
    // Completed: Sáng nhẹ màu xanh lá
    glowEffect = '0 0 15px rgba(16, 185, 129, 0.15)';
  }

  return (
    <div 
      className="rounded-4 d-flex align-items-center transition-all"
      style={{ 
        width: '320px', 
        minHeight: '90px', 
        background: bgGradient,
        border: `1.5px solid ${isLocked ? '#2d3142' : activeColor}`,
        boxShadow: glowEffect,
        opacity: isLocked ? 0.6 : 1,
        padding: '16px 20px',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      {/* NÚM KẾT NỐI ĐẦU VÀO (Top) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: '#0f111a', 
          border: `2px solid ${activeColor}`, 
          width: '12px', 
          height: '12px',
          top: '-6px',
          zIndex: 10
        }} 
      />

      {/* BADGE NGỌN LỬA HOT TREND */}
      {isTrending && !isLocked && (
        <div 
          className="position-absolute d-flex align-items-center rounded-pill px-2 py-1"
          style={{
            top: '-12px',
            right: '15px',
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.5)',
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
          width: '46px', 
          height: '46px', 
          backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' 
                         : isLearning ? 'rgba(59, 130, 246, 0.1)' 
                         : 'rgba(75, 85, 99, 0.15)',
          border: `1px solid ${activeColor}`,
          color: activeColor,
          fontSize: '16px'
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
            color: isLocked ? '#9ca3af' : '#f8fafc', 
            letterSpacing: '0.3px' 
          }}
        >
          {data.label}
        </h6>
        <p 
          className="small m-0" 
          style={{ 
            fontSize: '12px', 
            color: '#94a3b8',
            lineHeight: '1.4',
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
          border: `2px solid ${activeColor}`, 
          width: '12px', 
          height: '12px',
          bottom: '-6px',
          zIndex: 10
        }} 
      />
    </div>
  );
}

export default CustomSkillNode;