// src/components/dashboard/learning/CustomSkillNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FaLock, FaPlay, FaCheck, FaFire } from 'react-icons/fa';

function CustomSkillNode({ data }) {
  const isCompleted = data.status === 'completed';
  const isLearning = data.status === 'learning';
  const isLocked = data.status === 'locked';
  
  const isTrending = data.isTrending;
  const highlightMode = data.highlightMode;

  // NẾU ĐANG BẬT HIGHLIGHT MÀ KỸ NĂNG KHÔNG HOT => LÀM MỜ XUỐNG CÒN 20%
  const isDimmed = highlightMode && !isTrending;

  const accentColor = isCompleted ? '#10b981' : isLearning ? '#3b82f6' : '#4b5563';
  const activeColor = isTrending ? '#ef4444' : accentColor;
  
  return (
    <div 
      className="rounded-4 d-flex align-items-center transition-all"
      style={{ 
        width: '320px', minHeight: '90px', 
        background: isLocked ? 'linear-gradient(145deg, #11131e 0%, #0a0b10 100%)' : 'linear-gradient(145deg, #1a1d2d 0%, #11131e 100%)',
        border: `1.5px solid ${isLocked ? '#2d3142' : activeColor}`,
        
        // HIỆU ỨNG FOCUS:
        opacity: isDimmed ? 0.2 : (isLocked ? 0.6 : 1),
        transform: isDimmed ? 'scale(0.95)' : 'scale(1)',
        boxShadow: (isTrending && highlightMode) ? '0 0 25px rgba(239, 68, 68, 0.5), inset 0 0 10px rgba(239, 68, 68, 0.2)' : '0 4px 10px rgba(0,0,0,0.4)',
        
        padding: '16px 20px', position: 'relative'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#0f111a', border: `2px solid ${activeColor}`, width: '12px', height: '12px', top: '-6px', zIndex: 10 }} />

      {/* BADGE LỬA SHOW BẤT KỂ KHÓA HAY MỞ */}
      {isTrending && (
        <div 
          className="position-absolute d-flex align-items-center rounded-pill px-2 py-1 shadow"
          style={{
            top: '-12px', right: '15px',
            background: (isLocked && !highlightMode) ? '#374151' : 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
            fontSize: '10px', fontWeight: 'bold',
            color: (isLocked && !highlightMode) ? '#9ca3af' : '#fff', zIndex: 11, letterSpacing: '0.5px'
          }}
        >
          <FaFire className="me-1" style={{ animation: (isLocked && !highlightMode) ? 'none' : 'pulse 1.2s infinite alternate' }} />
          HOT SKILL
        </div>
      )}

      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '46px', height: '46px', backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : isLearning ? 'rgba(59, 130, 246, 0.1)' : 'rgba(75, 85, 99, 0.15)', border: `1px solid ${activeColor}`, color: activeColor, fontSize: '16px' }}>
        {isCompleted ? <FaCheck /> : isLearning ? <FaPlay style={{ marginLeft: '3px' }} /> : <FaLock />}
      </div>

      <div className="ms-3 flex-grow-1">
        <h6 className="fw-bold mb-1" style={{ fontSize: '15px', color: isLocked ? '#9ca3af' : '#f8fafc' }}>{data.label}</h6>
        <p className="small m-0" style={{ fontSize: '12px', color: '#94a3b8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{data.description}</p>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#0f111a', border: `2px solid ${activeColor}`, width: '12px', height: '12px', bottom: '-6px', zIndex: 10 }} />
    </div>
  );
}

export default CustomSkillNode;