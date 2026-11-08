import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', showText = true, textColor = 'text-zinc-950' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-2.5 group">
      {/* Brand Icon SVG */}
      <svg
        className={`${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" fill="#FF8A00" />
        <polygon
          points="50,16 79.44,33 79.44,67 50,84 20.56,67 20.56,33"
          fill="#FFFFFF"
        />
        <path
          d="M35 34 H65 L43 56 H65 V66 H35 L57 44 H35 V34 Z"
          fill="#FF8A00"
        />
      </svg>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-heading font-black tracking-tight leading-none ${textSizes[size]} ${textColor}`}
          >
            ZUMRAD<span className="text-[#FF8A00]">.</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">
            SHOP • 10 YIL
          </span>
        </div>
      )}
    </div>
  );
};
