import React, { useEffect, useState } from 'react';

interface IntroPageProps {
  onComplete: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[180px] animate-morph" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="text-center relative z-10">
        <div className="animate-scale-in">
          {/* Logo with glow effect */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-pink-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse-glow" />
            <img 
              src="/uploads/w453y.svg" 
              alt="w453y Logo" 
              className="h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 mx-auto relative z-10"
            />
          </div>

          {/* Loading bar */}
          <div className="w-48 md:w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Loading text */}
          <p className="mt-4 text-gray-500 text-sm animate-pulse">
            Loading experience...
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-violet-500/30" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-pink-500/30" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-cyan-500/30" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-violet-500/30" />
    </div>
  );
};
