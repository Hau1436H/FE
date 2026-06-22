// src/components/dashboard/learning/CustomSkillNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FaLock, FaPlay, FaCheck } from 'react-icons/fa';

function CustomSkillNode({ data }) {
  const isCompleted = data.status === 'completed';
  const isLearning = data.status === 'learning';
  const isLocked = data.status === 'locked';

  // Định nghĩa hệ màu chủ đạo (Accent Color)
  const accentColor = isCompleted ? '#10b981' : isLearning ? '#f59e0b' : '#4b5563';
  
  // Nền Gradient tạo chiều sâu
  const bgGradient = isLocked 
    ? 'linear-gradient(145deg, #11131e 0%, #0a0b10 100%)' 
    : 'linear-gradient(145deg, #1c1f2e 0%, #11131e 100%)';
  
  // Hiệu ứng phát sáng (Glow)
  const glowEffect = isLearning 
    ? '0 0 20px rgba(245, 158, 11, 0.25), inset 0 0 8px rgba(245, 158, 11, 0.1)' 
    : isCompleted 
    ? '0 0 15px rgba(16, 185, 129, 0.15)' 
    : '0 4px 6px rgba(0, 0, 0, 0.3)';

  return (
    <div 
      className="rounded-4 d-flex align-items-center transition-all"
      style={{ 
        width: '320px', // Làm Node to ra
        minHeight: '90px', 
        background: bgGradient,
        border: `1.5px solid ${isLocked ? '#2d3142' : accentColor}`,
        boxShadow: glowEffect,
        opacity: isLocked ? 0.65 : 1,
        padding: '16px 20px',
        position: 'relative'
      }}
    >
      {/* NÚM KẾT NỐI ĐẦU VÀO (Top) - Thiết kế kiểu High-tech */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: '#0f111a', // Rỗng ruột
          border: `2px solid ${accentColor}`, 
          width: '14px', 
          height: '14px',
          top: '-7px',
          zIndex: 10
        }} 
      />

      {/* KHỐI ICON */}
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ 
          width: '48px', 
          height: '48px', 
          backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : isLearning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(75, 85, 99, 0.15)',
          border: `1px solid ${accentColor}`,
          color: accentColor,
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
            // Kỹ thuật CSS để hiển thị tối đa 2 dòng và thêm "..." nếu quá dài
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
          background: '#0f111a', // Rỗng ruột
          border: `2px solid ${accentColor}`, 
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