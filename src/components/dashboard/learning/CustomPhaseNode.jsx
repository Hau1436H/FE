// src/components/dashboard/learning/CustomPhaseNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FaCheckCircle, FaLock, FaPlay, FaFire } from 'react-icons/fa';

function CustomPhaseNode({ data }) {
  const { title, completedCount, total, status, nodes, highlightMode } = data;
  
  const isCompleted = status === 'completed';
  const isLearning = status === 'learning';
  const isLocked = status === 'locked';

  // KIỂM TRA CHẶNG NÀY CÓ CHỨA KỸ NĂNG HOT NÀO KHÔNG?
  const hasHotSkill = nodes?.some(n => n.IsTrending === true || n.isTrending === true);
  
  // NẾU ĐANG BẬT HIGHLIGHT MÀ CHẶNG NÀY KHÔNG CÓ HOT SKILL => LÀM MỜ
  const isDimmed = highlightMode && !hasHotSkill;

  const accentColor = isCompleted ? '#10b981' : isLearning ? '#3b82f6' : '#4b5563';
  const progressPercent = Math.round((completedCount / total) * 100) || 0;

  return (
    <div 
      className="rounded-4 transition-all"
      style={{ 
        width: '280px', padding: '20px',
        background: isLocked ? 'linear-gradient(145deg, #11131e 0%, #0a0b10 100%)' : 'linear-gradient(145deg, #1e2235 0%, #11131e 100%)',
        border: `2px solid ${hasHotSkill && highlightMode ? '#ef4444' : (isLocked ? '#2d3142' : accentColor)}`,
        
        // HIỆU ỨNG FOCUS:
        opacity: isDimmed ? 0.25 : (isLocked ? 0.6 : 1),
        boxShadow: (hasHotSkill && highlightMode) ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 4px 10px rgba(0,0,0,0.4)',
        transform: isDimmed ? 'scale(0.95)' : 'scale(1)',
        cursor: isLocked ? 'not-allowed' : 'pointer'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      {/* HIỆN THÔNG BÁO CHẶNG NÀY CÓ KỸ NĂNG HOT */}
      {hasHotSkill && highlightMode && (
         <div className="position-absolute badge bg-danger rounded-pill px-3 py-1 shadow" style={{ top: -12, right: 10, fontSize: '11px' }}>
           <FaFire className="me-1" style={{ animation: 'pulse 1s infinite alternate' }}/> Chứa Kỹ năng Cốt lõi
         </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: `rgba(${isCompleted ? '16, 185, 129' : isLearning ? '59, 130, 246' : '75, 85, 99'}, 0.15)`, color: accentColor }}>
          {isCompleted ? <FaCheckCircle size={20}/> : isLearning ? <FaPlay size={16} style={{ marginLeft: '4px' }}/> : <FaLock size={18}/>}
        </div>
        <span className="badge bg-dark border" style={{ borderColor: accentColor, color: accentColor }}>
          {completedCount} / {total} Kỹ năng
        </span>
      </div>

      <h5 className="text-white fw-bold mb-2">{title}</h5>
      <div className="progress mt-3" style={{ height: '6px', backgroundColor: '#2d3142' }}>
        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${progressPercent}%`, backgroundColor: accentColor }}></div>
      </div>
      <p className="text-white-50 mt-2 mb-0" style={{ fontSize: '12px' }}>
        {isLocked ? 'Yêu cầu hoàn thành chặng trước' : 'Bấm vào để xem chi tiết'}
      </p>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

export default CustomPhaseNode;