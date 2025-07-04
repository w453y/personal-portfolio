
import React from 'react';

interface IntroPageProps {
  onComplete: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-fade-in">
          <div className="relative">
            <img 
              src="/uploads/w453y.svg" 
              alt="w453y Logo" 
              className="h-96 w-auto mx-auto opacity-0 animate-[fade-in_2s_ease-out_0.5s_both]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
