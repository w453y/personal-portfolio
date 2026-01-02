import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navigation = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navigationItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);

      // Update active section
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
              {/* Logo */}
              <div className="flex-shrink-0 group cursor-pointer" onClick={handleLogoClick}>
                <div className="relative">
                  <img 
                    src="/uploads/w453y.svg" 
                    alt="Logo" 
                    className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
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
          <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
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
