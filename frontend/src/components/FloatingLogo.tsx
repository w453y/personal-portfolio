
import React, { useState, useEffect } from 'react';

export const FloatingLogo = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className={`hidden md:block fixed top-8 left-8 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <img 
          src="/uploads/w453y.svg" 
          alt="w453y" 
          className="h-12 w-auto opacity-90 group-hover:opacity-100 transition-opacity" 
        />
      </button>
    </div>
  );
};
