import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'hero', label: 'home' },
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'exp' },
  { id: 'projects', label: 'projects' },
  { id: 'skills', label: 'skills' },
  { id: 'education', label: 'edu' },
  { id: 'contact', label: 'contact' },
];

/**
 * Fixed dot-rail on the right edge (desktop). Highlights the active
 * section; click to jump. State updates only when the section changes.
 */
export const SideRail = () => {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = 'hero';
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
      }
      setActive(prev => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4" aria-label="Section navigation">
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2.5"
            aria-label={`Go to ${label}`}
          >
            <span
              className={`font-mono text-[10px] transition-all duration-300 ${
                isActive ? 'text-violet-400 opacity-100' : 'text-gray-600 opacity-0 group-hover:opacity-100'
              }`}
            >
              {label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-2.5 h-2.5 bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]'
                  : 'w-1.5 h-1.5 bg-gray-600 group-hover:bg-gray-400'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};

export default SideRail;
