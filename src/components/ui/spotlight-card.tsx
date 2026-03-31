'use client';

import { useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  customSize?: boolean;
}

export function GlowCard({ children, className = '', customSize = false }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  const syncPointer = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={(e) => {
        syncPointer(e);
        setIsActive(true);
      }}
      onMouseMove={syncPointer}
      onMouseLeave={() => setIsActive(false)}
      style={{
        position: 'relative',
        borderRadius: '1rem',
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(28, 27, 38, 0.4)',
      }}
      className={`${customSize ? '' : 'w-64 h-80'} overflow-hidden ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-0"
        style={{
          border: '1px solid rgba(201,164,78,0.16)',
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200 z-0"
        style={{
          opacity: isActive ? 1 : 0,
          padding: '1.5px',
          background: 'radial-gradient(130px 130px at var(--mx, 50%) var(--my, 50%), rgba(231,195,106,0.95), rgba(231,195,106,0) 68%)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          filter: 'drop-shadow(0 0 12px rgba(201,164,78,0.35))',
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200 z-0"
        style={{
          opacity: isActive ? 1 : 0,
          background: `
            radial-gradient(150px 150px at var(--mx, 50%) var(--my, 50%), rgba(201,164,78,0.08), transparent 72%),
            radial-gradient(82px 82px at var(--mx, 50%) var(--my, 50%), rgba(255,238,195,0.1), transparent 76%)
          `,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

