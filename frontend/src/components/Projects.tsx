import React, { useState } from 'react';
import { ExternalLink, Github, Calendar, Tag, Shield, Server, Code, ChevronUp, ChevronDown } from 'lucide-react';

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
      title: "IPv6 Deployment Project",
      organization: "NITK Surathkal",
      period: "Feb 2024 - Present",
      description: "APNIC-funded project for comprehensive IPv6 network implementation, including DHCPv6 snooping, firewalling, and dual-stack rollout.",
      gradient: "from-emerald-400 to-cyan-400",
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
      gradient: "from-blue-400 to-indigo-400",
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
      gradient: "from-orange-400 to-red-400",
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
      gradient: "from-fuchsia-500 to-blue-500",
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
      github: "https://github.com/w453y/network-devops-canvas-showcase",
      external: null
    }
  ];

  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-pink-900/20"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-xl text-slate-300 mt-6 max-w-2xl mx-auto">
            Innovative solutions spanning network engineering, DevOps, and research
          </p>
        </div>
        <div className={`max-w-7xl mx-auto grid lg:grid-cols-2 gap-8`}>
          {projects.map((project, index) => (
            <div
              key={index}
              className={`group h-full${projects.length % 2 === 1 && index === projects.length - 1 ? ' lg:col-start-1 lg:col-end-3 lg:mx-auto lg:w-1/2' : ''}`}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-white/20 shadow-2xl flex flex-col h-full min-h-[420px]">
                {/* Project header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${project.gradient} bg-opacity-20 backdrop-blur-sm border border-white/10`}>
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex space-x-3">
                    {project.github && (
                      <a href={project.github} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110" target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5 text-white/80" />
                      </a>
                    )}
                    {project.external && (
                      <a href={project.external} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5 text-white/80" />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                {project.organization && (
                  <p className={`text-lg font-semibold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent mb-2`}>
                    {project.organization}
                  </p>
                )}
                <div className="mb-4">
                  <span className={`inline-block bg-gradient-to-r ${project.gradient} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                    {project.period}
                  </span>
                </div>
                <p className="text-slate-300 mb-6 text-lg leading-relaxed">{project.description}</p>
                <ul className="space-y-3 mb-6 min-h-[72px]">
                  {(expandedProjects.includes(index) ? project.details : project.details.slice(0, 2)).map((detail, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-300">{detail}</span>
                    </li>
                  ))}
                </ul>
                {project.details.length > 2 && (
                  <button
                    onClick={() => toggleProject(index)}
                    className={`flex items-center space-x-2 bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent hover:scale-105 transition-all duration-300 text-sm font-medium mb-6`}
                  >
                    <span>{expandedProjects.includes(index) ? 'Show Less' : 'Show More'}</span>
                    {expandedProjects.includes(index) ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                )}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/80 hover:bg-white/20 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-pink-900 via-pink-900/80 to-transparent"></div>
    </section>
  );
};
