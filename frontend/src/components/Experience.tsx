import React from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { ScrollReveal } from './ui/ScrollReveal';

export const Experience = () => {
  const experiences = [
    {
      title: "Firmware Engineer",
      company: "Quantum Networks",
      period: "DEC 2025 - Present",
      location: "Remote",
      description: "OpenWrt, Qualcomm IPQ60xx, U-Boot, Secure Boot, Firmware Engineering",
      achievements: [
        "Implemented FIT image verification and verified boot in U-Boot for OpenWrt-based AP platforms, enforcing authenticated kernel and rootfs validation before Linux boot handoff across dual-image NOR+NAND layouts.",
        "Engineered and validated a complete Qualcomm IPQ60xx secure-boot workflow, including OEM key provisioning, signed-image generation, fuse payload creation, and authenticated boot-chain verification from PBL to Linux.",
        "Analyzed and debugged Qualcomm Sectools, MBN v6 metadata, soc_vers handling, and QFPROM fuse-generation logic to diagnose and resolve secure-boot failures on IPQ6010/IPQ6018 platforms.",
        "Built a hardened OpenWrt/QSDK firmware-signing pipeline integrating RSA-PSS image signing, SHA-384 fuse hashing, validation guardrails, automated sec.dat generation, and signed recovery-image packaging.",
        "Performed low-level firmware debugging and recovery using U-Boot, EDL/Sahara, Firehose, serial-console tracing, SPI-NOR analysis, staged flashing, and partition-level validation workflows.",
        "Identified and resolved multiple boot-chain issues including incorrect soc_vers metadata, fuse-enforcement mismatches, OEM/QTI signing inconsistencies, and board-specific DDR CDT recovery limitations.",
      ],
      color: "emerald",
      icon: "/uploads/quantum-networks.svg",
      externalLink: "https://www.qntmnet.com/"
    },
    {
      title: "Intern",
      company: "Tata Communications",
      period: "May 2025 - July 2025",
      location: "Pune, India",
      description: "MPTCP, OpenWrt, Proxmox VE, iSCSI, VLANs, QoS, ZFS, RAID",
      achievements: [
        "Engineered and deployed a multi-link WAN switching and aggregation engine to seamlessly combine and failover across uplink connections, ensuring high availability and consistent performance in enterprise environments.",
        "Built and configured a 2-node Proxmox VE cluster on Dell EMC PowerEdge servers with local ZFS-mirror storage, enhancing workload reliability, fault tolerance, and simplified disaster recovery in production environments.",
        "Integrated and optimized Dell EMC ME5024 SAN storage in RAID-6 with dual-controller iSCSI multipathing, delivering high-availability shared block storage with consistent performance for clustered virtual machines.",
        "Designed and implemented performance-isolated networking by segmenting management, cluster, and storage traffic with dedicated NICs, VLANs, and redundant SAN paths between compute nodes and storage controllers.",
        "Validated system resilience through structured failover testing, confirming uninterrupted I/O during simulated link and controller outages, and produced architecture and operational documentation for ongoing use.",
      ],
      color: "violet",
      icon: "/uploads/tata.svg",
      externalLink: "https://www.tatacommunications.com/"
    },
    {
      title: "Systems Engineer and Lead",
      company: "IRIS, NITK",
      period: "May 2023 - May 2026",
      location: "NITK Surathkal, India",
      description: "Networking, DevOps, Ruby, Virtualization, Docker, Monitoring, CI/CD",
      achievements: [
        "Designed and deployed a Docker-based Moodle test environment using Docker Compose for isolated API testing, enabling faster development cycles and reducing deployment risks.",
        "Implemented a secure JWT-based authentication system by compiling a custom NGINX module and integrating it with a Rails service, ensuring controlled access to internal dashboards and administrative tools.",
        "Built a centralized monitoring stack with Zabbix and Grafana, integrating Discord webhook alerts for SSL certificate expiry, service outages, and infrastructure anomalies across bare-metal and virtualized environments.",
        "Migrated GitLab Enterprise from a host-based deployment to a Dockerized setup with automated NAS backups, health checks, and real-time notifications, improving maintainability and recovery capability.",
        "Engineered a containerized backup solution leveraging the Ruby backup gem and supercronic to automate database and file backups to both NAS and Ceph S3 targets, and executed a zero-downtime migration of 40+ containers and 15+ VMs from legacy Proxmox and Nutanix systems to a high-availability Proxmox cluster.",
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
      emerald: { gradient: "from-emerald-500 to-teal-500", text: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30" },
    };
    return colors[color] || colors.violet;
  };

  return (
    <section 
      id="experience" 
      className="relative py-8 md:py-12 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-violet-600/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 -left-48 w-96 h-96 bg-pink-600/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
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
        </ScrollReveal>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-pink-500 to-cyan-500 hidden md:block" />
            
            <div className="space-y-8">
              {experiences.map((exp, index) => {
                const colors = getColorClasses(exp.color);
                return (
                  <ScrollReveal 
                    key={index} 
                    delay={index * 150}
                    direction="left"
                  >
                    <div className="relative flex flex-col md:flex-row md:items-start gap-6">
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
                  </ScrollReveal>
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
