import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';

export const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const experiences = [
    {
      title: "Project Trainee Intern",
      company: "Tata Communications",
      period: "May 2025 - July 2025",
      location: "Pune, India",
      description: "Network Infrastructure, Virtualization, Storage Solutions, High Availability",
      achievements: [
        "Designed and deployed a 2-node Proxmox VE cluster on Dell EMC PowerEdge R650xs servers with ZFS-mirror storage for enhanced system reliability.",
        "Integrated Dell EMC ME5024 SAN with 8×1.92 TB SAS SSDs in RAID-6, implementing dual-controller iSCSI multipathing for high availability.",
        "Developed a switching and aggregation engine for WAN failover, enabling seamless connectivity across fiber and 4G/5G networks.",
        "Implemented LVM over multipath iSCSI LUNs to provide shared block storage for virtualized workloads.",
      ],
      color: "violet",
      icon: "/uploads/tata.svg",
      externalLink: "https://www.tatacommunications.com/"
    },
    {
      title: "Systems Engineer and Lead",
      company: "IRIS, NITK",
      period: "May 2023 - Present",
      location: "NITK Surathkal, India",
      description: "Networking, DevOps, Ruby, Virtualization, Docker, Monitoring, CI/CD",
      achievements: [
        "Deployed Dockerized Moodle testbed with Docker Compose for isolated API testing and rapid iteration.",
        "Built JWT authentication system using a custom NGINX module and Rails service to secure internal dashboards and tools.",
        "Set up Zabbix and Grafana monitoring with Discord alerts for SSL expiry and service anomalies.",
        "Migrated 30+ containers and 15 VMs from standalone Proxmox and Nutanix to a high-availability Proxmox cluster.",
      ],
      color: "pink",
      icon: "/uploads/iris.png",
      externalLink: "https://about.iris.nitk.ac.in/"
    },
    {
      title: "Research Intern",
      company: "NITK Surathkal",
      period: "April 2024 - July 2024",
      location: "NITK Surathkal, India",
      supervisor: "Prof. Mohit P. Tahiliani",
      description: "802.1X, VLANs, NAC, PacketFence, Virtualization, Security",
      achievements: [
        "Designed and deployed a complete network access control (NAC) testbed using PacketFence, OPNsense, and VLAN segmentation.",
        "Configured VLAN-based enforcement in PacketFence with dynamic device onboarding, DHCP handling, and access control.",
        "Configured VLAN tagging and PVIDs for traffic routing and validated end-to-end enforcement by simulating endpoint scenarios.",
      ],
      color: "cyan",
      icon: "/uploads/nitk.svg",
      externalLink: "https://www.nitk.ac.in/"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { gradient: string; text: string; bg: string; border: string }> = {
      violet: { gradient: "from-violet-500 to-purple-500", text: "text-violet-400", bg: "bg-violet-500", border: "border-violet-500/30" },
      pink: { gradient: "from-pink-500 to-rose-500", text: "text-pink-400", bg: "bg-pink-500", border: "border-pink-500/30" },
      cyan: { gradient: "from-cyan-500 to-teal-500", text: "text-cyan-400", bg: "bg-cyan-500", border: "border-cyan-500/30" },
    };
    return colors[color] || colors.violet;
  };

  return (
    <section 
      ref={sectionRef}
      id="experience" 
      className="relative py-16 md:py-24 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-violet-600/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 -left-48 w-96 h-96 bg-pink-600/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Professional </span>
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Experience</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500" />
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <div className="h-px w-24 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500" />
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500" />
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-pink-500 to-cyan-500 hidden md:block" />
            
            <div className="space-y-8">
              {experiences.map((exp, index) => {
                const colors = getColorClasses(exp.color);
                return (
                  <div 
                    key={index} 
                    className={`relative flex flex-col md:flex-row md:items-start gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                    style={{ transitionDelay: `${index * 0.2}s` }}
                  >
                    {/* Timeline dot */}
                    <div className={`hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${colors.gradient} items-center justify-center shadow-lg z-10`}>
                      <Briefcase className="text-white" size={24} />
                    </div>
                    
                    {/* Content card */}
                    <div className={`flex-1 group p-6 md:p-8 rounded-2xl liquid-glass hover:${colors.border} transition-all duration-500 hover:-translate-y-1`}>
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                        <div className="flex items-start gap-4">
                          {/* Company icon */}
                          <div className="flex-shrink-0">
                            <img
                              src={exp.icon}
                              alt={exp.company}
                              className={`w-16 h-16 md:w-20 md:h-20 object-contain ${(exp.icon.includes('foss') || exp.icon.includes('nitk')) ? 'invert brightness-200' : ''}`}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{exp.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <p className={`text-lg font-semibold ${colors.text}`}>{exp.company}</p>
                              {exp.externalLink && (
                                <a 
                                  href={exp.externalLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                                >
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <MapPin size={14} />
                              <span>{exp.location}</span>
                            </div>
                            {exp.supervisor && (
                              <p className="text-gray-500 text-sm mt-1">Supervisor: {exp.supervisor}</p>
                            )}
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${colors.gradient} text-white text-sm font-medium`}>
                          <Calendar size={14} />
                          {exp.period}
                        </div>
                      </div>
                      
                      <p className={`${colors.text} mb-4 font-medium`}>{exp.description}</p>
                      
                      <ul className="space-y-3">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-3 group/item">
                            <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform`} />
                            <span className="text-gray-400 text-sm leading-relaxed group-hover/item:text-gray-300 transition-colors">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
};
