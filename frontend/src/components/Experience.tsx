import React from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';

export const Experience = () => {
  // Custom icon component for fallback
  const CustomIcon = ({ src, alt, fallback, className = "w-6 h-6" }: { 
    src: string; 
    alt: string; 
    fallback: React.ReactNode; 
    className?: string;
  }) => (
    <div className="relative">
      <img 
        src={src} 
        alt={alt}
        className={className}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const nextSibling = target.nextElementSibling as HTMLElement;
          if (nextSibling) {
            nextSibling.style.display = 'block';
          }
        }}
      />
      <div className="hidden">{fallback}</div>
    </div>
  );

  const experiences = [
    {
      title: "Project Trainee Intern",
      company: "Tata Communications",
      period: "May 2025 - July 2025",
      location: "Pune, India",
      description: "MPTCP, OpenWrt, SD-WAN, QoS, WAN Failover, Link Aggregation",
      achievements: [
        "Researched commercial and open-source WAN failover tools including Cisco SD-WAN, Peplink, and pfSense.",
        "Identified OpenMPTCProuter as the optimal MPTCP solution for link aggregation in Tata Communications scenarios.",
        "Deployed OpenMPTCProuter on Raspberry Pi, RUTX12/50, and x86 platforms, enabling seamless failover across fiber and 4G/5G connections.",
        "Configured VPS-based MPTCP + Shadowsocks endpoint for encrypted, low-latency traffic relay from OMR.",
        "Evaluated MPTCP, Glorytun, Shadowsocks, and QoS for VPN bypass, link monitoring, and routing optimization.",
        "Designed selective traffic policies and multi-link setups for resilient media, telemetry, and edge connectivity."
      ],
      color: "from-blue-500 to-cyan-500",
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
        "Migrated GitLab Enterprise from host-based to Docker with NAS backups and automated health notifications.",
        "Developed a containerized backup solution using Ruby and supercronic for NAS and Ceph S3 targets.",
        "Migrated 30+ containers and 15 VMs from standalone Proxmox and Nutanix to a high-availability Proxmox cluster."
      ],
      color: "from-purple-500 to-pink-500",
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
        "Designed and deployed a complete network access control (NAC) testbed using PacketFence, OPNsense, and VLAN segmentation in a virtualized lab with dual Proxmox servers and a Cisco SG300 switch.",
        "Configured VLAN-based enforcement in PacketFence with dynamic device onboarding, DHCP handling, and access control across registration, isolation, and production VLANs.",
        "Configured VLAN tagging and PVIDs for traffic routing and validated end-to-end enforcement by simulating endpoint scenarios.",
        "Confirmed OPNsense WAN–LAN mediation through isolated test environments and ensured robust network isolation."
      ],
      color: "from-green-500 to-teal-500",
      icon: "/uploads/nitk.png",
      externalLink: "https://www.nitk.ac.in/"
    }
  ];

  return (
    <section id="experience" className="relative py-20 overflow-hidden">
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-slate-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Professional Experience
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hidden sm:block"></div>
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={index} className="relative flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${exp.color} rounded-full flex items-center justify-center shadow-lg z-10 hidden sm:flex`}>
                    <Briefcase className="text-white" size={24} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 shadow-xl ml-0 sm:ml-0">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Custom company icon */}
                        <div className={`flex-shrink-0 mt-1`}>
                          <CustomIcon
                            src={exp.icon}
                            alt={exp.company}
                            fallback={<Briefcase className="text-slate-400" size={80} />} // even larger fallback
                            className="w-28 h-28 sm:w-32 sm:h-32" // icon height matches location row end
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                          <div className="flex items-center space-x-3 mb-2">
                            <p className={`text-lg font-semibold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>
                              {exp.company}
                            </p>
                            {exp.externalLink && (
                              <a 
                                href={exp.externalLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                              >
                                <ExternalLink className="w-4 h-4 text-white/70" />
                              </a>
                            )}
                          </div>
                          {exp.location && (
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="text-slate-400" size={16} />
                              <span className="text-slate-400">{exp.location}</span>
                            </div>
                          )}
                          {exp.supervisor && (
                            <p className="text-slate-400 mt-1">Supervisor: {exp.supervisor}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                        <Calendar className="text-slate-400" size={16} />
                        <span className={`bg-gradient-to-r ${exp.color} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                          {exp.period}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-cyan-300 mb-6 font-medium text-lg">{exp.description}</p>
                    
                    <div className="space-y-4">
                      {exp.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-start space-x-3 group">
                          <div className={`w-2 h-2 bg-gradient-to-r ${exp.color} rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform`}></div>
                          <span className="text-slate-300 leading-relaxed group-hover:text-white transition-colors">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-indigo-900 via-indigo-900/80 to-transparent"></div>
    </section>
  );
};