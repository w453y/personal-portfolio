import React from 'react';

/**
 * Single fixed background layer for the entire page. Sections are fully
 * transparent, so there are no visible seams between them. Aurora blobs
 * are plain radial-gradients animated with transform only (no filter blur)
 * — they live on the compositor and cost nothing while scrolling.
 */
export const GlobalBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
    {/* Grid, fading out toward edges */}
    <div className="absolute inset-0 bg-grid-term [mask-image:radial-gradient(ellipse_85%_75%_at_50%_40%,black,transparent)]" />

    {/* Drifting aurora blobs */}
    <div
      className="absolute -top-48 -left-48 w-[52rem] h-[52rem] rounded-full animate-aurora-drift"
      style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 62%)' }}
    />
    <div
      className="absolute top-1/3 -right-64 w-[58rem] h-[58rem] rounded-full animate-aurora-drift"
      style={{ animationDelay: '-6s', background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 62%)' }}
    />
    <div
      className="absolute -bottom-56 left-1/4 w-[48rem] h-[48rem] rounded-full animate-aurora-drift"
      style={{ animationDelay: '-12s', background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 62%)' }}
    />

    {/* Static scanlines */}
    <div className="absolute inset-0 scanlines" />

    {/* Vignette */}
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 60%, rgba(2,4,7,0.5) 100%)' }} />
  </div>
);

export default GlobalBackground;
