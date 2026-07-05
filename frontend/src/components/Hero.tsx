import React, { useEffect, useRef, useState } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaReddit, FaPhone, FaEnvelope, FaTelegram, FaDiscord } from 'react-icons/fa';
import { ArrowDown, Terminal } from 'lucide-react';
import { Typewriter } from './ui/Typewriter';

/** Decorative network topology — nodes, links, and packets traveling between them. */
const NetworkMap = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.16] pointer-events-none"
    viewBox="0 0 1200 800"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {/* Links */}
    <g stroke="#8b5cf6" strokeWidth="1" fill="none" strokeDasharray="4 6">
      <path id="lnk1" d="M 120 160 L 420 300" />
      <path id="lnk2" d="M 420 300 L 760 180" />
      <path id="lnk3" d="M 760 180 L 1080 320" />
      <path id="lnk4" d="M 420 300 L 300 620" />
      <path id="lnk5" d="M 760 180 L 900 600" />
      <path id="lnk6" d="M 300 620 L 900 600" />
      <path id="lnk7" d="M 120 160 L 760 180" />
    </g>

    {/* Nodes */}
    <g fill="#101013" stroke="#a78bfa" strokeWidth="1.5">
      <circle cx="120" cy="160" r="8" />
      <circle cx="420" cy="300" r="12" />
      <circle cx="760" cy="180" r="10" />
      <circle cx="1080" cy="320" r="8" />
      <circle cx="300" cy="620" r="9" />
      <circle cx="900" cy="600" r="11" />
    </g>

    {/* Packets */}
    <g fill="#a78bfa">
      <circle r="3.5">
        <animateMotion dur="5s" repeatCount="indefinite">
          <mpath href="#lnk1" />
        </animateMotion>
      </circle>
      <circle r="3.5" fill="#22d3ee">
        <animateMotion dur="6.5s" repeatCount="indefinite" begin="1s">
          <mpath href="#lnk2" />
        </animateMotion>
      </circle>
      <circle r="3.5">
        <animateMotion dur="7s" repeatCount="indefinite" begin="0.5s">
          <mpath href="#lnk5" />
        </animateMotion>
      </circle>
      <circle r="3.5" fill="#22d3ee">
        <animateMotion dur="8s" repeatCount="indefinite" begin="2s">
          <mpath href="#lnk6" />
        </animateMotion>
      </circle>
      <circle r="3.5" fill="#fbbf24">
        <animateMotion dur="9s" repeatCount="indefinite" begin="3s">
          <mpath href="#lnk7" />
        </animateMotion>
      </circle>
    </g>
  </svg>
);

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Magnetic CTA — button leans toward the cursor
  const handleCtaMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ctaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };

  const handleCtaLeave = () => {
    const el = ctaRef.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  };

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const socialLinks = [
    { icon: FaPhone, href: "tel:+91-7090344713", label: "Call", color: "text-emerald-400" },
    { icon: FaEnvelope, href: "mailto:awasey8905@gmail.com", label: "Email", color: "text-violet-400" },
    { icon: FaLinkedin, href: "https://linkedin.com/in/w453y", label: "LinkedIn", color: "text-sky-400" },
    { icon: FaGithub, href: "https://github.com/w453y", label: "GitHub", color: "text-gray-300" },
    { icon: FaTwitter, href: "https://twitter.com/w453y", label: "Twitter", color: "text-cyan-400" },
    { icon: FaInstagram, href: "https://instagram.com/w453y", label: "Instagram", color: "text-rose-400" },
    { icon: FaReddit, href: "https://reddit.com/u/w453y", label: "Reddit", color: "text-orange-400" },
    { icon: FaTelegram, href: "https://t.me/w453y", label: "Telegram", color: "text-sky-400" },
    { icon: FaDiscord, href: "https://discordapp.com/users/791356749348601866", label: "Discord", color: "text-indigo-400" },
  ];

  return (
    <section className="relative min-h-[85svh] md:min-h-[auto] flex items-start justify-center overflow-hidden pt-0 md:pt-16 pb-4 md:pb-8">
      <NetworkMap />

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Terminal badge */}
            <div className="hidden md:inline-flex items-center gap-2.5 px-4 py-2 rounded-md term-panel mb-4 md:mb-8 font-mono text-sm">
              <Terminal className="w-4 h-4 text-violet-400" />
              <span className="text-gray-600">~$</span>
              <span className="text-gray-300">whoami</span>
              <span className="caret" style={{ height: '1em' }} />
            </div>

            {/* Main heading */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="block text-white mb-2">Hi, I'm</span>
              <span className="text-shine">Abdul Wasey</span>
            </h1>

            {/* Typewriter roles */}
            <p className="text-xl md:text-3xl text-gray-400 mb-4 md:mb-6 font-mono h-10 md:h-12">
              <span className="text-gray-600">&gt; </span>
              <Typewriter
                words={['Network Engineer', 'Systems Architect', 'Firmware Engineer', 'Open-Source Enthusiast', 'Self-Hosting Enthusiast']}
                className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400"
              />
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-500 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              Network and firmware engineer working across routing, secure boot,
              and infrastructure automation. I like building reliable systems
              and contributing to open source.
            </p>

            {/* Social links grid — staggered rise-in */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-3 mb-8 md:mb-12 max-w-3xl mx-auto">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? "_blank" : undefined}
                  rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="group flex flex-col items-center p-4 rounded-md term-chip hover:-translate-y-1 hover:border-violet-500/40 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.15 + index * 0.05}s`, animationFillMode: 'backwards' }}
                >
                  <social.icon className={`${social.color} mb-2 text-xl group-hover:scale-110 transition-transform duration-300`} />
                  <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors font-mono">{social.label}</span>
                </a>
              ))}
            </div>

            {/* Magnetic CTA */}
            <div className="space-y-4">
              <button
                ref={ctaRef}
                onClick={handleScrollToAbout}
                onMouseMove={handleCtaMove}
                onMouseLeave={handleCtaLeave}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-transform duration-200 ease-out will-change-transform"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 animate-gradient-x bg-[length:200%_auto]" />
                <span className="absolute inset-[1.5px] bg-[#0a0a0a] rounded-full transition-colors duration-300 group-hover:bg-[#0a0a0a]/40" />
                <span className="relative z-10 text-white font-semibold">Explore My Journey</span>
                <ArrowDown className="relative z-10 text-white group-hover:animate-bounce transition-all" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
