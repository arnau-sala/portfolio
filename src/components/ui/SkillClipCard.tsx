'use client';

import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useAnimate } from 'framer-motion';

type SkillClipCardProps = {
  id: string;
  name: string;
  iconSrc: string;
  iconAlt: string;
  className: string;
  isActive: boolean;
  onToggle: (id: string) => void;
};

const NO_CLIP = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
const BOTTOM_RIGHT_CLIP = 'polygon(0 0, 100% 0, 0 0, 0% 100%)';
const TOP_RIGHT_CLIP = 'polygon(0 0, 0 100%, 100% 100%, 0% 100%)';
const BOTTOM_LEFT_CLIP = 'polygon(100% 100%, 100% 0, 100% 100%, 0 100%)';
const TOP_LEFT_CLIP = 'polygon(0 0, 100% 0, 100% 100%, 100% 0)';

const ENTRANCE_KEYFRAMES: Record<string, string[]> = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES: Record<string, string[]> = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

export function SkillClipCard({ id, name, iconSrc, iconAlt, className, isActive, onToggle }: SkillClipCardProps) {
  const [scope, animate] = useAnimate();

  const isDesktopHover = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches;

  const isMobileToggle = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 767px)').matches;

  const getNearestSide = (e: MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const distances = [
      { side: 'left', proximity: Math.abs(box.left - e.clientX) },
      { side: 'right', proximity: Math.abs(box.right - e.clientX) },
      { side: 'top', proximity: Math.abs(box.top - e.clientY) },
      { side: 'bottom', proximity: Math.abs(box.bottom - e.clientY) },
    ].sort((a, b) => a.proximity - b.proximity);

    return distances[0].side;
  };

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDesktopHover()) return;
    const side = getNearestSide(e);
    animate(scope.current, { clipPath: ENTRANCE_KEYFRAMES[side] }, { duration: 0.28, ease: 'easeOut' });
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDesktopHover()) return;
    const side = getNearestSide(e);
    animate(scope.current, { clipPath: EXIT_KEYFRAMES[side] }, { duration: 0.24, ease: 'easeIn' });
  };

  useEffect(() => {
    if (!isMobileToggle()) return;
    if (!scope.current) return;
    if (isActive) {
      animate(scope.current, { clipPath: [BOTTOM_RIGHT_CLIP, NO_CLIP] }, { duration: 0.26, ease: 'easeOut' });
    } else {
      animate(scope.current, { clipPath: [NO_CLIP, TOP_RIGHT_CLIP] }, { duration: 0.22, ease: 'easeIn' });
    }
  }, [isActive, animate, scope]);

  const handleClick = () => {
    if (!isMobileToggle()) return;
    onToggle(id);
  };

  return (
    <div
      className={className}
      aria-label={name}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <img src={iconSrc} alt={iconAlt} />

      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="bento-hover-overlay absolute inset-0 rounded-[inherit] grid place-content-center"
        aria-hidden="true"
      >
        <span className="bento-hover-label">{name}</span>
      </div>
    </div>
  );
}
