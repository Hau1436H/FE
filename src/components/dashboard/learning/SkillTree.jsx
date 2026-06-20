// src/components/dashboard/learning/SkillTree.jsx
import React from 'react';
import { FaLock, FaPlay, FaCheck, FaStar } from 'react-icons/fa';

function SkillTree({ skillNodes, onNodeClick }) {
  
  // Custom Icon với hiệu ứng phát sáng (Glow)
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': 
        return (
          <div className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm" 
               style={{ width: 45, height: 45, background: 'linear-gradient(135deg, #198754, #20c997)', boxShadow: '0 0 15px rgba(32, 201, 151, 0.4)' }}>
            <FaCheck size={18} />
          </div>
        );
      case 'learning': 
        return (
          <div className="rounded-circle d-flex align-items-center justify-content-center text-dark shadow-sm position-relative" 
               style={{ width: 45, height: 45, background: 'linear-gradient(135deg, #ffc107, #ffeb3b)', boxShadow: '0 0 20px rgba(255, 193, 7, 0.6)' }}>
             <FaPlay size={16} className="ms-1" />
             {/* Vòng sáng nhấp nháy cho node đang học */}
             <span className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-warning" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
          </div>
        );
      default: 
        return (
          <div className="rounded-circle d-flex align-items-center justify-content-center text-white-50" 
               style={{ width: 45, height: 45, background: '#1a1d2d', border: '1px solid #2c3042' }}>
            <FaLock size={16} />
          </div>
        );
    }
  };

  // Tính toán màu của đường kẻ nối: Nếu node hiện tại và node tiếp theo đều đã mở, đường kẻ sẽ sáng lên.
  const getLineStyle = (currentIndex) => {
    const current = skillNodes[currentIndex];
    const next = skillNodes[currentIndex + 1];
    
    if (!next) return {}; // Node cuối không cần đường kẻ

    if (current.status === 'completed' && (next.status === 'completed' || next.status === 'learning')) {
      return { background: 'linear-gradient(to bottom, #20c997, #ffc107)', width: '3px', boxShadow: '0 0 8px rgba(32, 201, 151, 0.5)' }; // Đường đang đi
    } else if (current.status === 'completed') {
       return { backgroundColor: '#20c997', width: '3px' }; // Đường đã qua
    }
    return { backgroundColor: '#2c3042', width: '2px' }; // Đường bị khóa
  };

  return (
    <div className="py-4 px-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Inject CSS animation & hover effects */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .skill-card {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .skill-card:hover {
          transform: translateY(-3px) scale(1.01);
        }
      `}</style>

      {skillNodes.map((node, index) => {
        const isLocked = node.status === 'locked';
        const isLearning = node.status === 'learning';
        const isCompleted = node.status === 'completed';

        return (
          <div key={node.id} className="d-flex position-relative mb-4">
            
            {/* ĐƯỜNG KẺ DỌC (TIMELINE LINE) */}
            {index !== skillNodes.length - 1 && (
              <div className="position-absolute" 
                   style={{ 
                     ...getLineStyle(index),
                     top: '45px', bottom: '-28px', left: '21px', zIndex: 1, borderRadius: '5px'
                   }}>
              </div>
            )}
            
            {/* ICON TRẠNG THÁI */}
            <div className="me-4 position-relative" style={{ zIndex: 2 }}>
              {getStatusIcon(node.status)}
            </div>

            {/* THẺ KỸ NĂNG (CARD) */}
            <div 
              className={`skill-card flex-grow-1 p-4 rounded-4 ${isLocked ? '' : 'shadow-sm'}`}
              style={{ 
                background: isLocked 
                  ? 'rgba(20, 22, 35, 0.4)' // Tối mờ cho node khóa
                  : 'linear-gradient(145deg, rgba(26, 29, 45, 0.95) 0%, rgba(15, 17, 26, 0.95) 100%)', // Gradient sang trọng cho node mở
                backdropFilter: 'blur(10px)',
                border: isLearning 
                  ? '1px solid rgba(255, 193, 7, 0.4)' 
                  : (isCompleted ? '1px solid rgba(32, 201, 151, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'),
                boxShadow: isLearning ? '0 8px 32px rgba(255, 193, 7, 0.1)' : 'none',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.6 : 1
              }}
              onClick={() => onNodeClick(node)}
            >
              <div className="d-flex justify-content-between align-items-start mb-1">
                <h5 className={`fw-bold mb-1 ${isLocked ? 'text-white-50' : 'text-white'}`}>
                  {node.nodeName}
                </h5>
                {/* Badge tiến độ */}
                {!isLocked && (
                  <span className={`badge rounded-pill ${isCompleted ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`} style={{ border: isCompleted ? '1px solid rgba(25,135,84,0.2)' : '1px solid rgba(255,193,7,0.2)'}}>
                    {isCompleted ? 'Đã nắm vững' : 'Đang tiến hành'}
                  </span>
                )}
              </div>
              <p className="mb-0 text-white-50" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                {node.description}
              </p>
            </div>
          </div>
        );
      })}

      {/* Điểm kết thúc lộ trình (Trang trí thêm cho đẹp) */}
      <div className="d-flex position-relative mt-2">
         <div className="me-4 position-relative d-flex justify-content-center" style={{ width: '45px', zIndex: 2 }}>
            <FaStar className="text-warning opacity-50" size={24} />
         </div>
         <div className="flex-grow-1 align-self-center">
           <h6 className="text-white-50 fw-bold mb-0 font-monospace" style={{ letterSpacing: '2px'}}>MỤC TIÊU NGHỀ NGHIỆP</h6>
         </div>
      </div>

    </div>
  );
}

export default SkillTree;