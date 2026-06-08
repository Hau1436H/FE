// src/components/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { IoRocketOutline } from 'react-icons/io5'; // Hoặc icon bất kỳ bạn đang dùng làm logo

function Logo({ className = '', size = 'md', onClick }) {
  // Định nghĩa kích thước dựa trên prop `size`
  const iconSizes = {
    sm: '1.25rem',
    md: '1.75rem',
    lg: '2.5rem'
  };

  const fontSizes = {
    sm: 'fs-6',
    md: 'fs-4',
    lg: 'fs-2'
  };

  return (
    <Link 
      to="/" 
      className={`d-flex align-items-center gap-2 text-decoration-none ${className}`}
      onClick={onClick}
    >
        <span style={{
          background: 'linear-gradient(to right, var(--accent) 0%, var(--accent) 30%, #ffffff 70%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          fontWeight: '900',
          fontSize: '1.25rem'
        }}>
          AICareer
        </span>
    </Link>
  );
}

export default Logo;