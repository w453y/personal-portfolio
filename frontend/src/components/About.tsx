import React, { useEffect, useRef, useState } from 'react';
import { User, Target, Lightbulb, Rocket, Code, Shield, Cloud, Server } from 'lucide-react';

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: '0px 0px 0px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const highlights = [
    { icon: Server, label: "Network Engineering", color: "text-emerald-400" },
    { icon: Cloud, label: "Cloud & DevOps", color: "text-cyan-400" },
    { icon: Shield, label: "Security Research", color: "text-pink-400" },
    { icon: Code, label: "Automation", color: "text-violet-400" },
  ];

  const aboutCards = [
    {
      icon: User,
      title: "Who I Am",
      description: "A B.Tech student with a knack for building secure, scalable infrastructure. I design resilient network architectures, automate workflows, and deploy high-availability systems across diverse environments.",
      gradient: "from-violet-500 to-purple-500",
      delay: "0.1s"
    },
    {
      icon: Target,
      title: "Core Competencies",
      description: "Network Engineering (IPv4/IPv6, Routing, VLANs, Firewalls, VPNs) • DevOps & Automation (Docker, Kubernetes, CI/CD) • Cloud & Virtualization (AWS, GCP, Proxmox) • Security & Research",
      gradient: "from-pink-500 to-rose-500",
      delay: "0.2s"
    },
    {
      icon: Lightbulb,
      title: "What Drives Me",
      description: "I thrive on solving complex networking challenges, automating infrastructure, and sharing knowledge through workshops and open-source projects. Driven by curiosity and a security-first mindset.",
      gradient: "from-cyan-500 to-teal-500",
      delay: "0.3s"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="relative py-8 md:py-12 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-violet-600/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-600/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">About </span>
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Me</span>
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500" />
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500" />
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500" />
            </div>
          </div>

          {/* Profile Section */}
          <div className={`grid lg:grid-cols-2 gap-12 items-center mb-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Profile Image */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative group">
                {/* Animated ring */}
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 rounded-full opacity-30 blur-2xl animate-pulse-glow group-hover:opacity-50 transition-opacity" />
                
                {/* Image container */}
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  {/* Rotating border */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 animate-rotate-slow p-[3px]">
                    <div className="w-full h-full rounded-full bg-[#0a0a0a]" />
                  </div>
                  
                  {/* Image */}
                  <div className="absolute inset-[6px] rounded-full overflow-hidden">
                    <img 
                      src="/uploads/profile.jpg" 
                      alt="Abdul Wasey" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Logo badge */}
                <div className="absolute -bottom-4 -right-4 bg-[#0a0a0a] p-3 rounded-2xl border border-white/10 shadow-xl">
                  <img src="/uploads/w453y.svg" alt="w453y" className="h-12 w-12" />
                </div>
              </div>
            </div>

            {/* Highlight badges */}
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {highlights.map((item, index) => (
                  <div 
                    key={item.label}
                    className="group flex items-center gap-3 p-4 rounded-xl liquid-glass hover:bg-white/[0.08] transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <item.icon className={`${item.color} w-6 h-6 group-hover:scale-110 transition-transform`} />
                    <span className="text-gray-300 text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-400 leading-relaxed text-lg">
                Passionate about privacy-first solutions and open-source technologies, I actively share knowledge through technical talks and community contributions. My work spans from enterprise network deployments to cloud-native infrastructure.
              </p>
            </div>
          </div>

          {/* About Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {aboutCards.map((card, index) => (
              <div 
                key={card.title}
                className={`group relative p-6 rounded-2xl liquid-glass hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: card.delay }}
              >
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} p-[1px] mb-4`}>
                  <div className="w-full h-full rounded-xl bg-[#0a0a0a] flex items-center justify-center">
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Focus Areas */}
          <div className={`grid md:grid-cols-2 gap-6 mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="group p-6 rounded-2xl liquid-glass-purple hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-violet-400 w-6 h-6" />
                <h3 className="text-xl font-semibold text-violet-400">Current Focus</h3>
              </div>
              <ul className="space-y-3">
                {["Enterprise Network Engineering & Automation", "IPv6 & Network Automation", "Cloud Integration & Virtualization", "Network Security & Monitoring"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="group p-6 rounded-2xl liquid-glass-pink hover:border-pink-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="text-pink-400 w-6 h-6" />
                <h3 className="text-xl font-semibold text-pink-400">Research Interests</h3>
              </div>
              <ul className="space-y-3">
                {["Network Security", "IPv6 & Routing", "Cloud Automation", "Open Source Tools"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
};
