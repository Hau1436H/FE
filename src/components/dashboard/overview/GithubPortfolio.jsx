import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function GithubPortfolio({ health }) {
  if (!health) return null;
  
  const getBadgeColor = (status) => status === 'Good' ? 'text-success' : (status === 'Poor' ? 'text-warning' : 'text-danger');

  return (
    <div style={{ backgroundColor: '#131313', border: '1px solid #232323', borderRadius: '14px', padding: '20px' }}>
      <h6 className="m-0 text-white fw-bold d-flex align-items-center justify-content-between mb-3" style={{ fontSize: '14px' }}>
        <span><FaGithub className="me-2"/> Portfolio Health</span>
      </h6>

      <div className="d-flex flex-column gap-2 mb-3">
        {['Architecture', 'Readme', 'Testing'].map((key, idx) => (
          <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: '#1A1A1A' }}>
            <span className="text-white-50 small">{key}</span>
            <span className={`small fw-bold ${getBadgeColor(health[key.toLowerCase()])}`}>{health[key.toLowerCase()]}</span>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px dashed rgba(245,166,35,0.3)' }}>
        <div className="fw-bold mb-1" style={{ color: '#F5A623', fontSize: '12px' }}>💡 AI Suggestion</div>
        <div className="text-white-50 mb-2" style={{ fontSize: '12px', lineHeight: '1.4' }}>{health.aiSuggestion}</div>
        <div className="d-flex justify-content-between text-white" style={{ fontSize: '11px' }}>
          <span>⏱ {health.estimatedTime}</span>
          <span className="fw-bold text-success">{health.impact}</span>
        </div>
      </div>
    </div>
  );
}