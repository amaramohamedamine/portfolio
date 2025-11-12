import React from 'react';
import { Tilt } from 'react-tilt';

// Lightweight reusable card with optional tilt and unified styling
// Props: className (extra classes), tilt (boolean), options (tilt options), children
const Card = ({ className = '', tilt = false, options, children }) => {
  const base = `bg-tertiary rounded-2xl p-5 shadow-card ring-1 ring-white/5 hover:ring-accent/40 transition duration-300`;

  if (tilt) {
    return (
      <Tilt options={options || { max: 45, scale: 1, speed: 450 }} className={`${base} ${className}`}>
        {children}
      </Tilt>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
};

export default Card;
