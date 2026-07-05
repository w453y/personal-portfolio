import React from 'react';
import { User, Target, Lightbulb, Rocket, Code, Shield, Cloud, Server, FileText } from 'lucide-react';
import { ScrollReveal } from './ui/ScrollReveal';
import { SectionHeader } from './ui/SectionHeader';
import { SpotlightCard } from './ui/SpotlightCard';

export const About = () => {
  const highlights = [
    { icon: Server, label: "Network Engineering", color: "text-emerald-400" },
    { icon: Cloud, label: "Cloud & DevOps", color: "text-cyan-400" },
    { icon: Shield, label: "Security & Firmware", color: "text-pink-400" },
    { icon: Code, label: "Automation", color: "text-violet-400" },
  ];

  const aboutCards = [
    {
      icon: User,
      title: "Who I Am",
      description: "A B.Tech graduate from NITK Surathkal, currently working as a Firmware Engineer at Quantum Networks. Previously at Tata Communications and IRIS NITK, working on everything from U-Boot secure boot on Qualcomm platforms to high-availability Proxmox clusters.",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: Target,
      title: "What I Do",
      description: "Networking: IPv6, routing, VLANs, and NAC. Firmware: OpenWrt, U-Boot, and Qualcomm IPQ60xx. Infrastructure: Docker, Kubernetes, Proxmox VE, and CI/CD across AWS, GCP, and bare metal.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Lightbulb,
      title: "What Drives Me",
      description: "I enjoy solving hard infrastructure problems and sharing what I learn. I contribute patches upstream, write guides for self-hosting and virtualization communities, speak at FOSS meetups, and maintain a homelab where I self-host my own services.",
      gradient: "from-cyan-500 to-teal-500",
    }
  ];

  return (
    <section
      id="about"
      className="relative py-8 md:py-12 overflow-hidden"
      aria-label="About Abdul Wasey"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <SectionHeader title="About" highlight="Me" />

          {/* Profile Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Profile Image */}
            <ScrollReveal className="flex justify-center order-1 lg:order-2" delay={100} direction="right">
              <div className="relative group">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  {/* Rotating conic ring */}
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#8b5cf6,#ec4899,#0a0a0a,#8b5cf6)] animate-rotate-slow p-[3px]">
                    <div className="w-full h-full rounded-full bg-[#0a0a0a]" />
                  </div>

                  <div className="absolute inset-[6px] rounded-full overflow-hidden">
                    <img
                      src="/uploads/profile.jpg"
                      alt="Abdul Wasey, Network and Firmware Engineer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Logo badge */}
                <div className="absolute -bottom-4 -right-4 bg-[#101013] p-3 rounded-xl border border-[color:var(--term-line-strong)] shadow-xl">
                  <img src="/uploads/w453y.svg" alt="w453y" className="h-12 w-12" />
                </div>
              </div>
            </ScrollReveal>

            {/* Narrative — styled as an open file */}
            <ScrollReveal className="order-2 lg:order-1" delay={200} direction="left">
              <SpotlightCard className="p-6 md:p-8" tilt={0}>
                <div className="flex items-center gap-2 mb-5 font-mono text-xs text-gray-500">
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  <span>about.md</span>
                  <span className="ml-auto text-gray-600">-- READ ONLY --</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg mb-4">
                  I'm Abdul Wasey, a network and firmware engineer from NITK Surathkal.
                  My work covers low-level firmware, including secure boot on
                  Qualcomm platforms and U-Boot, as well as larger infrastructure
                  such as campus IPv6 deployment, clustered virtualization, and
                  monitoring systems.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Outside of work I self-host most of my own services, including
                  mail, DNS, VPN, and media, and I regularly speak at FOSS
                  meetups and technical workshops.
                </p>
              </SpotlightCard>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="group flex items-center gap-3 p-4 rounded-md term-chip transition-all duration-300"
                  >
                    <item.icon className={`${item.color} w-6 h-6 group-hover:scale-110 transition-transform`} />
                    <span className="text-gray-300 text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* About Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {aboutCards.map((card, index) => (
              <ScrollReveal
                key={card.title}
                delay={index * 100}
              >
                <SpotlightCard className="group p-6 hover:-translate-y-2 transition-transform duration-300 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} p-[1px] mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-xl bg-[#0a0a0a] flex items-center justify-center">
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-white mb-3">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Focus Areas */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <ScrollReveal delay={0}>
              <div className="group p-6 rounded-lg term-card transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="text-violet-400 w-6 h-6" />
                  <h3 className="font-display text-xl font-semibold text-violet-400">Current Focus</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Secure boot and firmware signing for OpenWrt platforms",
                    "Enterprise network automation and IPv6 deployment",
                    "High-availability virtualization on Proxmox VE",
                    "Network security, NAC, and monitoring",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="group p-6 rounded-lg term-card transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="text-pink-400 w-6 h-6" />
                  <h3 className="font-display text-xl font-semibold text-pink-400">Research Interests</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "MPTCP and multi-WAN aggregation",
                    "IPv6 deployment and routing at scale",
                    "Trusted boot on embedded platforms",
                    "Open-source monitoring and observability",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
