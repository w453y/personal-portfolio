import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaReddit, FaPhone, FaEnvelope, FaTelegram, FaDiscord } from 'react-icons/fa';
import { ArrowDown, Sparkles } from 'lucide-react';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const socialLinks = [
    { icon: FaPhone, href: "tel:+91-7090344713", label: "Call", color: "text-emerald-400", hoverBg: "hover:bg-emerald-500/20", hoverBorder: "hover:border-emerald-500/50" },
    { icon: FaEnvelope, href: "mailto:awasey8905@gmail.com", label: "Email", color: "text-violet-400", hoverBg: "hover:bg-violet-500/20", hoverBorder: "hover:border-violet-500/50" },
    { icon: FaLinkedin, href: "https://linkedin.com/in/w453y", label: "LinkedIn", color: "text-blue-400", hoverBg: "hover:bg-blue-500/20", hoverBorder: "hover:border-blue-500/50" },
    { icon: FaGithub, href: "https://github.com/w453y", label: "GitHub", color: "text-gray-300", hoverBg: "hover:bg-gray-500/20", hoverBorder: "hover:border-gray-400/50" },
    { icon: FaTwitter, href: "https://twitter.com/w453y", label: "Twitter", color: "text-sky-400", hoverBg: "hover:bg-sky-500/20", hoverBorder: "hover:border-sky-500/50" },
    { icon: FaInstagram, href: "https://instagram.com/w453y", label: "Instagram", color: "text-pink-400", hoverBg: "hover:bg-pink-500/20", hoverBorder: "hover:border-pink-500/50" },
    { icon: FaReddit, href: "https://reddit.com/u/w453y", label: "Reddit", color: "text-orange-400", hoverBg: "hover:bg-orange-500/20", hoverBorder: "hover:border-orange-500/50" },
    { icon: FaTelegram, href: "https://t.me/w453y", label: "Telegram", color: "text-cyan-400", hoverBg: "hover:bg-cyan-500/20", hoverBorder: "hover:border-cyan-500/50" },
    { icon: FaDiscord, href: "https://discordapp.com/users/791356749348601866", label: "Discord", color: "text-indigo-400", hoverBg: "hover:bg-indigo-500/20", hoverBorder: "hover:border-indigo-500/50" },
  ];

  return (
    <section className="relative min-h-[85svh] md:min-h-[auto] flex items-start justify-center overflow-hidden bg-[#0a0a0a] pt-0 md:pt-16 pb-4 md:pb-8">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs */}
        <div 
          className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse-glow"
          style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
        />
        <div 
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: '1s', transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-morph"
        />
        
        {/* Animated geometric shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 border border-violet-500/20 rotate-45 animate-rotate-slow" />
        <div className="absolute top-40 right-32 w-16 h-16 border border-pink-500/20 animate-rotate-slow" style={{ animationDirection: 'reverse' }} />
        <div className="absolute bottom-32 left-40 w-24 h-24 border-2 border-cyan-500/10 rounded-full animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-gradient-to-br from-violet-500/10 to-transparent rotate-12 animate-float" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Sparkle badge - hidden on mobile */}
            <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-8 animate-fade-in backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-gray-300">Network Engineer & Systems Architect</span>
            </div>
            
            {/* Main heading with gradient */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="block text-white mb-2">Hi, I'm</span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                  Abdul Wasey
                </span>
                <span className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-pink-600/20 to-cyan-600/20 blur-2xl -z-10" />
              </span>
            </h1>
            
            {/* Animated divider */}
            <div className="flex items-center justify-center gap-2 mb-4 md:mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500" />
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500" />
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500" />
            </div>
            
            {/* Subtitle with typing effect look */}
            <p className="text-lg md:text-2xl text-gray-400 mb-4 md:mb-6 font-light">
              <span className="text-violet-400">Network Engineer</span>
              <span className="mx-3 text-gray-600">•</span>
              <span className="text-pink-400">Systems Architect</span>
              <span className="mx-3 text-gray-600">•</span>
              <span className="text-cyan-400">Open-Source Enthusiast</span>
            </p>
            
            {/* Description */}
            <p className="text-base md:text-lg text-gray-500 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Architecting resilient, secure, and scalable network infrastructure. 
              Passionate about automation, open-source, and empowering the tech community.
            </p>
            
            {/* Social links grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-3 mb-8 md:mb-12 max-w-3xl mx-auto">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? "_blank" : undefined}
                  rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className={`group flex flex-col items-center p-4 rounded-xl liquid-glass ${social.hoverBg} ${social.hoverBorder} transition-all duration-300 hover:scale-110 hover:-translate-y-1`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <social.icon className={`${social.color} mb-2 text-xl group-hover:scale-110 transition-transform`} />
                  <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">{social.label}</span>
                </a>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="space-y-4">
              <button 
                onClick={handleScrollToAbout}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
              >
                {/* Button gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-600 animate-gradient-x bg-[length:200%_auto]" />
                {/* Inner dark background */}
                <span className="absolute inset-[2px] bg-[#0a0a0a] rounded-full transition-all duration-300 group-hover:bg-transparent" />
                {/* Button content */}
                <span className="relative z-10 text-white font-semibold">Explore My Journey</span>
                <ArrowDown className="relative z-10 text-white group-hover:animate-bounce transition-all" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      
      {/* Scroll indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-subtle">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
