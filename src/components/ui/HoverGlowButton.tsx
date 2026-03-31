'use client';

import { useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';

interface HoverGlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  glowColor?: string;
  background?: string;
  textColor?: string;
  highlightTextColor?: string;
}

export function HoverGlowButton({
  children,
  onClick,
  className = '',
  disabled = false,
  glowColor = 'rgba(248, 217, 135, 0.5)',
  background = 'linear-gradient(90deg, #b8902d 0%, #d1ac43 50%, #b8902d 100%)',
  textColor = '#1c160a',
  highlightTextColor = '#5c4617',
}: HoverGlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setGlowPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{
        background,
        color: textColor,
      }}
    >
      <span
        className={`pointer-events-none absolute h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-300 ease-out ${isHovered ? 'scale-100' : 'scale-0'}`}
        style={{
          left: `${glowPosition.x}px`,
          top: `${glowPosition.y}px`,
          background: `radial-gradient(circle, ${glowColor} 12%, transparent 70%)`,
          opacity: 0.9,
          zIndex: 0,
        }}
      />

      <span className="relative z-10">{children}</span>
      <span
        className="pointer-events-none absolute inset-0 z-20 grid place-content-center font-inherit"
        style={{
          color: highlightTextColor,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 180ms ease-out',
          maskImage: `radial-gradient(90px circle at ${glowPosition.x}px ${glowPosition.y}px, black 20%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(90px circle at ${glowPosition.x}px ${glowPosition.y}px, black 20%, transparent 70%)`,
        }}
      >
        {children}
      </span>
    </button>
  );
}

