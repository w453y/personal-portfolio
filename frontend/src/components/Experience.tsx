import React from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { ScrollReveal } from './ui/ScrollReveal';
import { SectionHeader } from './ui/SectionHeader';
import { SpotlightCard } from './ui/SpotlightCard';

export const Experience = () => {
  const experiences = [
    {
      title: "Firmware Engineer",
      company: "Quantum Networks",
      period: "Dec 2025 - Present",
      location: "Remote",
      description: "OpenWrt • Qualcomm IPQ60xx • U-Boot • Secure Boot",
      achievements: [
        "Implemented verified boot in U-Boot for OpenWrt-based access points, with authenticated kernel and rootfs validation across dual-image flash layouts.",
        "Built and validated a complete secure-boot workflow for Qualcomm IPQ60xx platforms, covering key provisioning, image signing, fuse programming, and full boot-chain verification.",
        "Developed a hardened firmware-signing pipeline with RSA-PSS signing, SHA-384 fuse hashing, validation checks, and signed recovery images.",
        "Diagnosed and resolved secure-boot failures through vendor tooling analysis, boot metadata inspection, and controlled fuse generation.",
        "Performed low-level firmware debugging and recovery over serial console, emergency download modes, and flash-level workflows.",
      ],
      color: "emerald",
      icon: "/uploads/quantum-networks.svg",
      externalLink: "https://www.qntmnet.com/",
      latest: true,
    },
    {
      title: "Intern",
      company: "Tata Communications",
      period: "May 2025 - Jul 2025",
      location: "Pune, India",
      description: "MPTCP • Virtualization • SAN Storage • VLANs • HA",
      achievements: [
        "Engineered a multi-link WAN switching and aggregation solution for seamless failover across uplink connections in enterprise environments.",
        "Deployed a clustered virtualization environment on enterprise rack servers with resilient local storage for production workloads.",
        "Integrated redundant enterprise SAN storage with multipath I/O to provide highly available shared block storage.",
        "Isolated management, cluster, and storage traffic using dedicated interfaces, VLANs, and redundant storage paths.",
        "Validated failover behavior under simulated link and controller outages and produced operational documentation.",
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
      description: "Networking • DevOps • Virtualization • Monitoring • CI/CD",
      achievements: [
        "Built a Dockerized Moodle test environment for isolated API testing, enabling faster and safer development cycles.",
        "Added JWT-based access control for internal dashboards using a custom-compiled NGINX module integrated with a Rails service.",
        "Set up centralized monitoring with Zabbix and Grafana, including alerting for certificate expiry, outages, and anomalies.",
        "Migrated GitLab Enterprise to a containerized deployment with automated backups, health checks, and notifications.",
        "Automated database and file backups to NAS and S3 storage, and migrated 40+ containers and 15+ VMs to a high-availability cluster with zero downtime.",
      ],
      color: "pink",
      icon: "/uploads/iris.png",
      externalLink: "https://about.iris.nitk.ac.in/"
    },
    {
      title: "Research Intern",
      company: "NITK Surathkal",
      period: "Apr 2024 - Jul 2024",
      location: "NITK Surathkal, India",
      supervisor: "Prof. Mohit P. Tahiliani",
      description: "802.1X • VLANs • NAC • PacketFence • Security",
      achievements: [
        "Designed and deployed a complete network access control (NAC) testbed using PacketFence, OPNsense, and VLAN segmentation.",
        "Configured VLAN-based enforcement with dynamic device onboarding, DHCP handling, and access policies.",
        "Validated end-to-end enforcement with VLAN tagging and PVIDs across simulated endpoint scenarios.",
      ],
      color: "cyan",
      icon: "/uploads/nitk.svg",
      externalLink: "https://www.nitk.ac.in/"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { gradient: string; text: string; bg: string }> = {
      violet: { gradient: "from-violet-500 to-purple-500", text: "text-violet-400", bg: "bg-violet-500" },
      pink: { gradient: "from-pink-500 to-rose-500", text: "text-pink-400", bg: "bg-pink-500" },
      cyan: { gradient: "from-cyan-500 to-teal-500", text: "text-cyan-400", bg: "bg-cyan-500" },
      emerald: { gradient: "from-emerald-500 to-teal-500", text: "text-emerald-400", bg: "bg-emerald-500" },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <section
      id="experience"
      className="relative py-8 md:py-12 overflow-hidden"
      aria-label="Professional experience"
    >
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader title="Professional" highlight="Experience" />

        <div className="max-w-6xl mx-auto relative">
          {/* Timeline spine — center on desktop, left on mobile */}
          <div className="hidden lg:block absolute lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/60 via-pink-500/40 to-cyan-500/60" />

          <div className="space-y-10 lg:space-y-16">
            {experiences.map((exp, index) => {
              const colors = getColorClasses(exp.color);
              const onLeft = index % 2 === 0;
              return (
                <div key={index} className="relative">
                  {/* Node on the spine */}
                  <div className="hidden lg:block absolute lg:left-1/2 -translate-x-1/2 top-8 z-10 w-4 h-4">
                    <span className={`absolute inset-0 rounded-full ${colors.bg} opacity-40 animate-ping-slow`} />
                    <span className={`relative block w-4 h-4 rounded-full bg-gradient-to-br ${colors.gradient} ring-4 ring-[#0a0a0a]`} />
                  </div>

                  {/* Period label on the opposite side (desktop) */}
                  <div className={`hidden lg:flex absolute top-7 w-[calc(50%-3rem)] ${onLeft ? 'left-[calc(50%+3rem)] justify-start' : 'right-[calc(50%+3rem)] justify-end'}`}>
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-sm ${colors.text} border border-white/10 bg-white/[0.02]`}>
                      <Calendar size={13} />
                      {exp.period}
                      {exp.latest && <span className="led ml-1" />}
                    </span>
                  </div>

                  {/* Card */}
                  <ScrollReveal
                    className={`lg:w-[calc(50%-3rem)] ${onLeft ? '' : 'lg:ml-auto'}`}
                    direction={onLeft ? 'right' : 'left'}
                    delay={100}
                  >
                    <SpotlightCard className="group p-6 md:p-7">
                      <div className="flex items-start gap-4 mb-5">
                        <img
                          src={exp.icon}
                          alt={exp.company}
                          className={`w-14 h-14 object-contain flex-shrink-0 ${(exp.icon.includes('foss') || exp.icon.includes('nitk')) ? 'invert brightness-200' : ''}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight">{exp.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className={`font-semibold ${colors.text}`}>{exp.company}</p>
                            {exp.externalLink && (
                              <a
                                href={exp.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-md term-chip hover:border-violet-500/40 transition-all duration-300 hover:scale-110"
                                aria-label={`Visit ${exp.company}`}
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                              </a>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-gray-500 text-xs font-mono">
                            <span className="flex items-center gap-1"><MapPin size={11} />{exp.location}</span>
                            <span className="lg:hidden flex items-center gap-1"><Calendar size={11} />{exp.period}</span>
                            {exp.supervisor && <span>· {exp.supervisor}</span>}
                          </div>
                        </div>
                      </div>

                      <p className={`font-mono text-xs ${colors.text} mb-4 tracking-wide`}>{exp.description}</p>

                      <ul className="space-y-2.5">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-3 group/item">
                            <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform`} />
                            <span className="text-gray-400 text-sm leading-relaxed group-hover/item:text-gray-300 transition-colors">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </SpotlightCard>
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
