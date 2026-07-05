import React, { useRef, useCallback } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  /** 3D tilt toward the cursor. Max degrees; 0 disables. */
  tilt?: number;
}

/**
 * Liquid-glass terminal panel with hover corner brackets, a cursor-tracked
 * radial highlight, and a subtle 3D tilt. Everything is written to the DOM
 * directly — no React re-renders on mouse move.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = '', tilt = 3, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
      if (tilt > 0) {
        const rx = ((y / rect.height) - 0.5) * -2 * tilt;
        const ry = ((x / rect.width) - 0.5) * 2 * tilt;
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
      }
    });
  }, [tilt]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    el.style.transform = '';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card term-card rounded-lg ${className}`}
      {...rest}
    >
      <div className="spotlight-glow" aria-hidden="true" />
      {children}
    </div>
  );
};

export default SpotlightCard;
