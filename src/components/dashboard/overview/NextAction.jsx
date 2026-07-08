import React from 'react';
import { FaPlayCircle, FaCheck } from 'react-icons/fa';

export default function NextAction({ nextAction }) {
  if (!nextAction) return null;

  return (
    <div style={{ backgroundColor: '#131313', border: '1px solid #232323', borderRadius: '14px', padding: '24px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="badge text-dark fw-bold px-2 py-1" style={{ backgroundColor: '#F5A623', fontSize: '11px' }}>
          TODAY'S MISSION
        </span>
      </div>

      <h2 className="text-white fw-bold mb-3">{nextAction.nodeName}</h2>
      
      <div className="d-flex flex-wrap gap-4 text-white-50 small mb-4">
        <div>Độ khó: <b className="text-white">{nextAction.difficulty}</b></div>
        <div>Ước tính: <b className="text-white">{nextAction.estimatedHours} giờ</b></div>
        <div>Phần thưởng: <b style={{ color: '#34D399' }}>{nextAction.expectedReward}</b></div>
      </div>

      {/* KHỐI EXPLAINABLE AI */}
      <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)' }}>
        <h6 className="fw-bold mb-2 text-white" style={{ fontSize: '13px' }}>🧠 AI Mentor Analysis:</h6>
        <div className="d-flex flex-column gap-2">
          {nextAction.aiReasoningBullets?.map((bullet, idx) => (
            <div key={idx} className="d-flex align-items-start gap-2 small text-white-50">
              <FaCheck className="mt-1 flex-shrink-0" style={{ color: '#34D399', fontSize: '10px' }} />
              <span style={{ lineHeight: '1.4' }}>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-lg w-100 fw-bold border-0 d-flex justify-content-center align-items-center gap-2" style={{ backgroundColor: '#34D399', color: '#000', fontSize: '14px' }}>
        <FaPlayCircle /> BẮT ĐẦU HỌC
      </button>
    </div>
  );
}