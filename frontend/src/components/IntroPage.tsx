import React, { useEffect, useState } from 'react';

interface IntroPageProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  '[ OK ] Initializing w453y.me ...',
  '[ OK ] Loading network stack (IPv6 preferred)',
  '[ OK ] Mounting /portfolio',
  '[ OK ] Starting experience daemon',
];

export const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 28);

    const lineInterval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= BOOT_LINES.length) {
          clearInterval(lineInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    const fadeTimer = setTimeout(() => setFadeOut(true), 1650);
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
      clearInterval(interval);
      clearInterval(lineInterval);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-400 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'var(--term-bg)' }}
    >
      {/* Static background layers */}
      <div className="absolute inset-0 bg-grid-term [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,black,transparent)]" />
      <div className="absolute inset-0 bg-glow-corner" />
      <div className="absolute inset-0 scanlines" />

      <div className="text-center relative z-10 px-6">
        <div className="animate-scale-in">
          {/* Logo */}
          <div className="relative mb-8">
            <img
              src="/uploads/w453y.svg"
              alt="w453y Logo"
              className="h-44 w-44 md:h-56 md:w-56 mx-auto relative z-10"
            />
          </div>

          {/* Boot log */}
          <div className="font-mono text-left text-xs md:text-sm text-gray-500 w-72 md:w-96 mx-auto mb-6 h-20 md:h-24">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <p key={i} className="animate-fade-in leading-relaxed">
                <span className="text-emerald-400">{line.slice(0, 6)}</span>
                <span>{line.slice(6)}</span>
              </p>
            ))}
          </div>

          {/* Loading bar */}
          <div className="w-72 md:w-96 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 font-mono text-xs text-gray-600">{progress}%</p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-violet-500/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-fuchsia-500/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-cyan-500/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-violet-500/30" />
    </div>
  );
};
