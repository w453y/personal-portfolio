import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

// Check if mobile on initial load (before React hydration)
const getInitialMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768;
  }
  return false;
};

export const Navigation = () => {
  const [isMobile, setIsMobile] = useState(getInitialMobile);
  const [isVisible, setIsVisible] = useState(!getInitialMobile());
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const lastScrollYRef = useRef(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { name: 'home', href: '#hero' },
    { name: 'about', href: '#about' },
    { name: 'exp', href: '#experience' },
    { name: 'projects', href: '#projects' },
    { name: 'skills', href: '#skills' },
    { name: 'edu', href: '#education' },
    { name: 'contact', href: '#contact' },
  ];

  // Check if mobile on resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && window.scrollY < 100) {
        setIsVisible(true);
      }
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollYRef.current;

          // Progress bar — direct DOM write, no re-render
          if (progressRef.current) {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const p = total > 0 ? Math.min(currentScrollY / total, 1) : 0;
            progressRef.current.style.transform = `scaleX(${p})`;
          }

          const inHero = currentScrollY <= 100;
          setIsInHeroSection(inHero);

          if (isMobile) {
            if (inHero) {
              setIsVisible(false);
              lastScrollYRef.current = currentScrollY;
              ticking = false;
              return;
            }

            if (Math.abs(scrollDelta) >= 10) {
              if (scrollDelta < 0) {
                setIsVisible(true);
              } else if (scrollDelta > 0) {
                setIsVisible(false);
              }
              lastScrollYRef.current = currentScrollY;
            }
          } else {
            if (Math.abs(scrollDelta) >= 10) {
              if (scrollDelta < 0 || currentScrollY < 100) {
                setIsVisible(true);
              } else if (scrollDelta > 0) {
                setIsVisible(false);
              }
              lastScrollYRef.current = currentScrollY;
            } else if (currentScrollY < 100) {
              setIsVisible(true);
            }
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    const updateActiveSection = () => {
      const sections = navigationItems.map(item => item.href.substring(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const onScroll = () => {
      handleScroll();
      updateActiveSection();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isMobile && isInHeroSection) {
    return null;
  }

  const getNavClasses = () => {
    if (!isVisible) {
      return 'fixed top-0 left-0 right-0 z-50 -translate-y-full pointer-events-none transition-transform duration-300 ease-out';
    }
    return 'fixed top-0 left-0 right-0 z-50 translate-y-0 transition-transform duration-300 ease-out';
  };

  return (
    <>
      <nav className={getNavClasses()}>
        {/* Scroll progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
        <div className="bg-[#0a0a0a]/55 backdrop-blur-xl border-b border-white/5">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
              {/* Logo */}
              <div className="flex-shrink-0 group cursor-pointer flex items-center gap-3" onClick={handleLogoClick}>
                <img
                  src="/uploads/w453y.svg"
                  alt="Logo"
                  className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:block">
                <div className="flex items-center gap-1">
                  {navigationItems.map((item, index) => {
                    const isActive = activeSection === item.href.substring(1);
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className={`relative font-mono text-sm px-3 py-2 rounded-md transition-colors duration-200 group ${
                          isActive
                            ? 'text-violet-300 bg-violet-500/10 border border-violet-500/20'
                            : 'text-gray-500 border border-transparent hover:text-gray-200 hover:bg-white/5'
                        }`}
                      >
                        <span className={`mr-1.5 ${isActive ? 'text-violet-500' : 'text-gray-700 group-hover:text-gray-500'}`}>
                          {String(index).padStart(2, '0')}
                        </span>
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="relative p-2 rounded-md term-panel text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <span className="sr-only">Open menu</span>
                  {isMobileMenuOpen ? (
                    <X size={24} />
                  ) : (
                    <Menu size={24} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
            <div className="px-4 py-4 space-y-1">
              {navigationItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`block w-full text-left font-mono text-base py-3 px-4 rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'text-violet-300 bg-violet-500/10 border border-violet-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className={`mr-2 ${isActive ? 'text-violet-500' : 'text-gray-700'}`}>
                      {String(index).padStart(2, '0')}
                    </span>
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 sm:h-18 md:h-20" />
    </>
  );
};
