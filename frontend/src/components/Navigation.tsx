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
  const [isVisible, setIsVisible] = useState(!getInitialMobile()); // Hidden on mobile, visible on desktop
  const [isInHeroSection, setIsInHeroSection] = useState(true); // Track if in hero section
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const lastScrollYRef = useRef(0);

  const navigationItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  // Check if mobile on resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // If switching to desktop and at top, show nav
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
          
          // Track if we're in hero section (top 100px)
          const inHero = currentScrollY <= 100;
          setIsInHeroSection(inHero);
          
          // On mobile: always hide nav in hero section, regardless of scroll delta
          if (isMobile) {
            if (inHero) {
              // In hero section - always hide
              setIsVisible(false);
              lastScrollYRef.current = currentScrollY;
              ticking = false;
              return;
            }
            
            // Past hero section - only update on significant scroll
            if (Math.abs(scrollDelta) >= 10) {
              if (scrollDelta < 0) {
                setIsVisible(true); // Scrolling up
              } else if (scrollDelta > 0) {
                setIsVisible(false); // Scrolling down
              }
              lastScrollYRef.current = currentScrollY;
            }
          } else {
            // Desktop behavior - only update on significant scroll
            if (Math.abs(scrollDelta) >= 10) {
              if (scrollDelta < 0 || currentScrollY < 100) {
                setIsVisible(true);
              } else if (scrollDelta > 0) {
                setIsVisible(false);
              }
              lastScrollYRef.current = currentScrollY;
            } else if (currentScrollY < 100) {
              // Always show at top on desktop
              setIsVisible(true);
            }
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // Update active section separately (doesn't need throttling)
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

  // On mobile, don't render nav when in hero section - completely remove from DOM
  if (isMobile && isInHeroSection) {
    return null;
  }

  // Determine nav visibility class
  const getNavClasses = () => {
    if (!isVisible) {
      // Hidden state - use CSS only, no mounting/unmounting
      return 'fixed top-0 left-0 right-0 z-50 -translate-y-full opacity-0 pointer-events-none';
    }
    return 'fixed top-0 left-0 right-0 z-50 translate-y-0 opacity-100 transition-all duration-300';
  };

  return (
    <>
      <nav className={getNavClasses()}>
        <div className="bg-[#0a0a0a]/40 backdrop-blur-xl border-b border-white/10">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
              {/* Logo */}
              <div className="flex-shrink-0 group cursor-pointer" onClick={handleLogoClick}>
                <div className="relative">
                  <img 
                    src="/uploads/w453y.svg" 
                    alt="Logo" 
                    className="h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:block">
                <div className="flex items-center space-x-1 xl:space-x-2">
                  {navigationItems.map((item, index) => {
                    const isActive = activeSection === item.href.substring(1);
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className={`relative text-sm xl:text-base px-4 py-2 rounded-full transition-all duration-300 font-medium group ${
                          isActive 
                            ? 'text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {isActive && (
                          <span className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-pink-600/20 rounded-full animate-fade-in" />
                        )}
                        <span className="relative z-10">{item.name}</span>
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300 ${
                          isActive ? 'w-1/2' : 'w-0 group-hover:w-1/3'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <span className="sr-only">Open menu</span>
                  {isMobileMenuOpen ? (
                    <X size={24} className="animate-scale-in" />
                  ) : (
                    <Menu size={24} className="animate-scale-in" />
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
          <div className="bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 py-4 space-y-1">
              {navigationItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`block w-full text-left text-base py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-violet-600/20 to-pink-600/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
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
