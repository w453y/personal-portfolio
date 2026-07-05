import React, { useState } from 'react';
import { ExternalLink, Github, Calendar, Server, ChevronUp, ChevronDown, Folder } from 'lucide-react';
import { ScrollReveal } from './ui/ScrollReveal';
import { SectionHeader } from './ui/SectionHeader';
import { SpotlightCard } from './ui/SpotlightCard';

export const Projects = () => {
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);

  const toggleProject = (index: number) => {
    setExpandedProjects(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const projects = [
    {
      title: "Self-Hosted Infrastructure Platform",
      organization: "Solo Project",
      period: "Ongoing",
      description: "Personal two-node Proxmox VE cluster hosting 30+ self-hosted services across LXC containers and VMs, with shared storage, segmented networking, and layered DNS.",
      color: "indigo",
      details: [
        "Two Proxmox VE nodes with ZFS storage and shared block storage over multipath iSCSI, supporting live migration of workloads between nodes.",
        "OPNsense at the network edge for VLAN segmentation, firewall policies, WireGuard access, and separate public and private service paths.",
        "A single containerized NGINX reverse proxy fronts 30+ services with automated Let's Encrypt TLS, per-service vhosts, and access logging, including Matrix Synapse, Mailcow, Immich, Vaultwarden, Guacamole, and this portfolio.",
        "Layered DNS with local and public Pi-hole instances behind dnsdist, including DoT/DoH endpoints and split-horizon resolution.",
        "Additional workloads include a Jellyfin-based media automation stack, Portainer, code-server, local LLM inference, game servers, and containers for auth, tunnels, and monitoring.",
      ],
      technologies: ["Proxmox VE", "ZFS", "iSCSI", "OPNsense", "NGINX", "WireGuard", "VLANs", "Pi-hole", "dnsdist", "Docker"],
      github: null,
      external: null
    },
    {
      title: "IPv6 Deployment Project",
      organization: "NITK Surathkal",
      period: "Feb 2024 - Present",
      description: "APNIC-funded project for comprehensive IPv6 network implementation, including DHCPv6 snooping, firewalling, and dual-stack rollout.",
      color: "emerald",
      details: [
        "Configured DHCPv6 snooping and IPv6 firewall rules to block unauthorized addresses and isolate internal networks.",
        "Deployed and tested VMs with bridged networking to validate IPv6 end-to-end via DHCPv6 and SLAAC.",
        "Led dual-stack IPv6 rollout (SLAAC + DHCPv6) on campus VLANs, starting with production use in a hostel.",
        "Diagnosed and mitigated rogue RA flooding from edge devices using port-based RA filtering and strict ACLs.",
        "Resolved Android SLAAC and DNS failures by adjusting prefix allocation and RDNSS advertisements, and verified IPv6-only operation on client devices."
      ],
      technologies: ["IPv6", "DHCPv6", "SLAAC", "FreeBSD", "iptables", "Network Security"],
      github: null,
      external: "https://apnic.foundation/projects/migrating-nitk-surathkal-campus-network-to-ipv6/"
    },
    {
      title: "Staging-Server",
      organization: "IRIS, NITK",
      period: "May 2023 - Present",
      description: "Django-based web interface to automate deployment of Dockerized applications in isolated staging environments.",
      color: "orange",
      details: [
        "Developed a Django-based web interface that deploys Dockerized applications into isolated staging environments directly from Git URLs, with no manual setup.",
        "Implemented dynamic subdomains with automated NGINX configuration for each deployment, plus support for volumes, environment variables, and auxiliary services such as Redis and Celery.",
        "Built developer tooling including a real-time log viewer, a browser-based terminal, and lifecycle controls with scripting hooks."
      ],
      technologies: ["Django", "Docker", "NGINX", "xterm.js", "CI/CD", "Redis", "Celery"],
      github: "https://github.com/IRIS-NITK/Staging-Server.git",
      external: null
    },
    {
      title: "personal-portfolio",
      organization: null,
      period: "2024 – Present",
      description: "Full-stack, open-source portfolio and contact management platform built with React, TypeScript, Node.js, and Docker. Features modern UI, admin dashboard, Gmail integration, and advanced DevOps deployment.",
      color: "violet",
      details: [
        "Designed and built a responsive portfolio with React, TypeScript, and Tailwind CSS on the frontend and a Node.js and Express backend.",
        "Implemented a Gmail-integrated contact form with server-side validation, anti-spam measures, and OAuth2 email delivery.",
        "Built an admin dashboard for managing messages, viewing conversation threads, and replying from the web UI.",
        "Integrated NGINX-backed authentication in production with an admin login for the dashboard.",
        "Dockerized the full stack for local development and production, behind an NGINX reverse proxy with SSL.",
        "Added health checks, logging, rate limiting, CORS, input validation, and network isolation.",
      ],
      technologies: [
        "React", "Vite", "TypeScript", "Tailwind CSS", "Node.js", "Express", "Docker", "NGINX", "Gmail API", "OAuth2"
      ],
      github: "https://github.com/w453y/personal-portfolio",
      external: null
    },
    {
      title: "ngx-http-auth-jwt-gateway",
      organization: "Solo Project",
      period: "Active",
      description: "Centralized JWT authentication gateway for NGINX using Google OAuth 2.0 and ngx-http-auth-jwt-module to secure internal dashboards and self-hosted services.",
      color: "sky",
      details: [
        "Built a centralized authentication gateway for NGINX using Google OAuth 2.0 and JWT to secure internal dashboards and self-hosted services.",
        "Supports group-based access control, multiple JWT cookies, dynamic claims, and role-specific authentication workflows.",
        "Handles secure login flows with signed JWT generation, return-URL preservation, session persistence, and hardened cookie policies across subdomains.",
        "Ships as a containerized Docker Compose deployment with environment-driven configuration and integrated rate limiting.",
      ],
      technologies: ["NGINX", "JWT", "Google OAuth", "Docker", "Node.js", "Docker Compose", "Security"],
      github: "https://github.com/w453y/ngx-http-auth-jwt-gateway",
      external: null
    },
    {
      title: "tg-archiver",
      organization: "Solo Project",
      period: "Active",
      description: "Containerized Telegram media archiver using Telethon MTProto API for downloading and preserving media, captions, timestamps, and metadata from public and private chats.",
      color: "cyan",
      details: [
        "Built a containerized Telegram media archiver using Telethon and the MTProto API, preserving media, captions, and message metadata.",
        "Supports resumable archiving with persistent checkpointing, session reuse, and automatic deduplication.",
        "Manages parallel downloads with configurable concurrency while respecting Telegram rate limits.",
        "Runs as a reproducible Docker deployment with persistent volumes for sessions, metadata, and archived media.",
      ],
      technologies: ["Python", "Telethon", "Docker", "Telegram MTProto API", "Async Programming"],
      github: "https://github.com/w453y/tg-archiver",
      external: null
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { gradient: string; text: string; bg: string; border: string; glow: string }> = {
      emerald: { gradient: "from-emerald-500 to-teal-500", text: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" },
      blue: { gradient: "from-blue-500 to-indigo-500", text: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500/30", glow: "shadow-blue-500/20" },
      orange: { gradient: "from-orange-500 to-red-500", text: "text-orange-400", bg: "bg-orange-500", border: "border-orange-500/30", glow: "shadow-orange-500/20" },
      violet: { gradient: "from-violet-500 to-purple-500", text: "text-violet-400", bg: "bg-violet-500", border: "border-violet-500/30", glow: "shadow-violet-500/20" },
      sky: { gradient: "from-sky-500 to-blue-500", text: "text-sky-400", bg: "bg-sky-500", border: "border-sky-500/30", glow: "shadow-sky-500/20" },
      cyan: { gradient: "from-cyan-500 to-teal-500", text: "text-cyan-400", bg: "bg-cyan-500", border: "border-cyan-500/30", glow: "shadow-cyan-500/20" },
      indigo: { gradient: "from-indigo-500 to-violet-500", text: "text-indigo-400", bg: "bg-indigo-500", border: "border-indigo-500/30", glow: "shadow-indigo-500/20" },
    };
    return colors[color] || colors.violet;
  };

  return (
    <section 
      id="projects" 
      className="relative py-8 md:py-12 overflow-hidden"
    >
      {/* Background elements */}
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <SectionHeader
          title="Featured"
          highlight="Projects"
          subtitle="A selection of work across networking, infrastructure, and open source"
        />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const colors = getColorClasses(project.color);
            const isExpanded = expandedProjects.includes(index);
            
            return (
              <ScrollReveal
                key={index}
                delay={index * 100}
                className={index === 0 ? 'lg:col-span-2' : ((projects.length - 1) % 2 === 1 && index === projects.length - 1 ? 'lg:col-start-1 lg:col-end-3 lg:mx-auto lg:w-1/2' : '')}
              >
                <SpotlightCard className={`group h-full p-6 md:p-8 hover:-translate-y-2 hover:shadow-2xl ${colors.glow} flex flex-col min-h-[420px] transition-transform duration-300`}>
                  {/* Project header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-2">
                      {project.github && (
                        <a 
                          href={project.github} 
                          className="p-2.5 rounded-md term-chip hover:border-violet-500/40 transition-all duration-300 hover:scale-110 group/link" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Github className="w-5 h-5 text-gray-400 group-hover/link:text-white transition-colors" />
                        </a>
                      )}
                      {project.external && (
                        <a 
                          href={project.external} 
                          className="p-2.5 rounded-md term-chip hover:border-violet-500/40 transition-all duration-300 hover:scale-110 group/link" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover/link:text-white transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-display">{project.title}</h3>
                  
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

                  {index === 0 && (
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6 font-mono text-xs">
                      {['opnsense', 'nginx', 'mailcow', 'matrix-synapse', 'immich', 'vaultwarden', 'jellyfin', 'pi-hole', 'dnsdist', 'guacamole', 'portainer', 'portfolio'].map(svc => (
                        <div key={svc} className="flex items-center gap-2 px-3 py-2 rounded-md term-chip">
                          <span className="led flex-shrink-0" style={{ width: 6, height: 6 }} />
                          <span className="text-gray-400 truncate">{svc}</span>
                          <span className="ml-auto text-emerald-500/70">up</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
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
                        className="px-3 py-1 term-chip rounded-full text-xs font-mono text-gray-400 hover:text-white transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
      
    </section>
  );
};
