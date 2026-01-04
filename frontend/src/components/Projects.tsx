import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Calendar, Server, ChevronUp, ChevronDown, Folder } from 'lucide-react';

export const Projects = () => {
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: '50px 0px 50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleProject = (index: number) => {
    setExpandedProjects(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const projects = [
    {
      title: "IPv6 Deployment Project",
      organization: "NITK Surathkal",
      period: "Feb 2024 - Present",
      description: "APNIC-funded project for comprehensive IPv6 network implementation, including DHCPv6 snooping, firewalling, and dual-stack rollout.",
      color: "emerald",
      details: [
        "Configured DHCPv6 snooping and IPv6 firewall rules to block unauthorized IPs and isolate internal networks.",
        "Deployed and tested VMs with bridged networking to validate IPv6 end-to-end via DHCPv6 and SLAAC.",
        "Led dual-stack IPv6 rollout (SLAAC + DHCPv6) on campus VLANs, starting with production use in a hostel.",
        "Diagnosed and mitigated rogue RA flooding from edge devices using port-based RA filtering and strict ACLs.",
        "Resolved Android SLAAC and DNSv6 failures by reallocating from /56 to /64 and deploying RDNSS-only broadcasts with RADVD; verified IPv6-only reliability by disabling IPv4 on client devices."
      ],
      technologies: ["IPv6", "DHCPv6", "FreeBSD", "iptables", "Network Security", "Penetration Testing"],
      github: null,
      external: "https://apnic.foundation/projects/migrating-nitk-surathkal-campus-network-to-ipv6/"
    },
    {
      title: "Custom Ping Utility",
      organization: null,
      period: "Oct 2023 - Present",
      description: "Advanced Python CLI tool for ICMP echo over IPv4/IPv6, with custom checksum, latency metrics, and modular architecture.",
      color: "blue",
      details: [
        "Implemented a Python CLI tool for ICMP echo over IPv4/IPv6, including custom checksum and latency metrics.",
        "Added features like per-request RTT stats, TTL control, interface selection, and address family enforcement.",
        "Designed a modular architecture with separate handlers for ICMP logic, IP resolution, and interface detection.",
        "Automated end-to-end testing via shell script, covering invalid inputs, protocol modes, and device-specific edge cases."
      ],
      technologies: ["Python", "Socket Programming", "ICMP", "CLI Tools", "IPv4", "IPv6"],
      github: "https://github.com/w453y/Custom-Ping-Utility",
      external: null
    },
    {
      title: "Staging-Server",
      organization: "IRIS, NITK",
      period: "May 2023 - Present",
      description: "Django-based web interface to automate deployment of Dockerized applications in isolated staging environments.",
      color: "orange",
      details: [
        "Developed a Django-based web interface to automate the deployment of Dockerized applications in isolated staging environments, allowing developers to launch test instances from Git URLs with no manual setup.",
        "Implemented dynamic subdomain generation with automated NGINX configuration to expose each deployment at a unique, testable endpoint.",
        "Built developer tooling including a real-time log viewer with search, a browser-based terminal using xterm.js, and asynchronous lifecycle controls with scripting hooks for fine-grained deployment management."
      ],
      technologies: ["Django", "Docker", "NGINX", "xterm.js", "CI/CD"],
      github: "https://github.com/IRIS-NITK/Staging-Server.git",
      external: null
    },
    {
      title: "Personal Portfolio Website",
      organization: null,
      period: "2024 – Present",
      description: "A full-stack, open-source portfolio and contact management platform built with React, TypeScript, Node.js, and Docker. Features a modern UI, admin dashboard, Gmail-powered contact form, and advanced DevOps deployment.",
      color: "violet",
      details: [
        "Designed and developed a modern, responsive portfolio using React (Vite, TypeScript, Tailwind CSS) for the frontend and Node.js (Express, TypeScript) for the backend.",
        "Implemented a secure, Gmail-integrated contact form with server-side validation, anti-spam, and email delivery via both App Password and OAuth2.",
        "Built an admin dashboard for managing all contact messages, viewing unified conversation threads (merging contact form, admin replies, and Gmail messages), and replying directly from the web UI.",
        "Integrated advanced authentication: NGINX-backed auth in production, admin login for dashboard, and flexible dev/prod modes.",
        "Dockerized the entire stack for seamless local development and production deployment, with NGINX reverse proxy, static IPs, and SSL support.",
        "Added health checks, logging, and robust security features (rate limiting, CORS, input validation, security headers, network isolation).",
        "Wrote comprehensive documentation and set up a GitHub Wiki for easy onboarding, extensibility, and open-source collaboration.",
        "Extensible architecture: easy to add new React components, backend routes/services, and DevOps enhancements."
      ],
      technologies: [
        "React", "Vite", "TypeScript", "Tailwind CSS", "Node.js", "Express", "Docker", "NGINX", "Gmail API", "OAuth2", "CI/CD", "Security", "Open Source"
      ],
      github: "https://github.com/w453y/personal-portfolio",
      external: null
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { gradient: string; text: string; bg: string; border: string; glow: string }> = {
      emerald: { gradient: "from-emerald-500 to-teal-500", text: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" },
      blue: { gradient: "from-blue-500 to-indigo-500", text: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500/30", glow: "shadow-blue-500/20" },
      orange: { gradient: "from-orange-500 to-red-500", text: "text-orange-400", bg: "bg-orange-500", border: "border-orange-500/30", glow: "shadow-orange-500/20" },
      violet: { gradient: "from-violet-500 to-purple-500", text: "text-violet-400", bg: "bg-violet-500", border: "border-violet-500/30", glow: "shadow-violet-500/20" },
    };
    return colors[color] || colors.violet;
  };

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="relative py-8 md:py-12 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-600/8 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-600/8 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[200px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Featured </span>
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="h-px w-24 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-violet-500" />
          </div>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Innovative solutions spanning network engineering, DevOps, and research
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const colors = getColorClasses(project.color);
            const isExpanded = expandedProjects.includes(index);
            
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${projects.length % 2 === 1 && index === projects.length - 1 ? 'lg:col-start-1 lg:col-end-3 lg:mx-auto lg:w-1/2' : ''}`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className={`group h-full p-6 md:p-8 rounded-2xl liquid-glass hover:-translate-y-2 hover:shadow-2xl ${colors.glow} flex flex-col min-h-[420px]`}>
                  {/* Project header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg`}>
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-2">
                      {project.github && (
                        <a 
                          href={project.github} 
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 group/link" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Github className="w-5 h-5 text-gray-400 group-hover/link:text-white transition-colors" />
                        </a>
                      )}
                      {project.external && (
                        <a 
                          href={project.external} 
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 group/link" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover/link:text-white transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors">{project.title}</h3>
                  
                  {project.organization && (
                    <p className={`text-lg font-semibold ${colors.text} mb-2`}>
                      {project.organization}
                    </p>
                  )}
                  
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${colors.gradient} text-white text-sm font-medium`}>
                      <Calendar size={14} />
                      {project.period}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">{project.description}</p>
                  
                  <ul className="space-y-3 mb-6 flex-1">
                    {(isExpanded ? project.details : project.details.slice(0, 2)).map((detail, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform`} />
                        <span className="text-gray-400 text-sm leading-relaxed group-hover/item:text-gray-300 transition-colors">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {project.details.length > 2 && (
                    <button
                      onClick={() => toggleProject(index)}
                      className={`flex items-center gap-2 ${colors.text} hover:brightness-125 transition-all duration-300 text-sm font-medium mb-6`}
                    >
                      <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="transition-transform" />
                      ) : (
                        <ChevronDown size={16} className="transition-transform" />
                      )}
                    </button>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
};
