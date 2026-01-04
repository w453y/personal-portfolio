import React, { useState, useEffect, useRef } from 'react';
import { Award, Users, Presentation, ExternalLink, Sparkles } from 'lucide-react';
import { FaNetworkWired, FaCloud, FaDocker, FaLinux, FaGitAlt, FaServer, FaShieldAlt, 
         FaPython, FaJs, FaReact, FaDatabase, FaAws, FaGoogle, FaMicrosoft, 
         FaCertificate, FaUserGraduate, FaHandshake } from 'react-icons/fa';
import { SiKubernetes, SiTerraform, SiAnsible, SiPrometheus, SiGrafana, SiJenkins,
         SiCisco, SiVmware, SiMongodb, SiPostgresql, SiRedis, SiNginx, SiApache, 
         SiLua,
         SiYaml,
         SiProxmox,
         SiGithubactions,
         SiNutanix,
         SiShell} from 'react-icons/si';
import { TbPresentation } from 'react-icons/tb';

export const Skills = () => {
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

  const CustomIcon = ({ src, alt, fallback, className = "w-5 h-5", iconSize = "w-5 h-5" }: { 
    src: string; 
    alt: string; 
    fallback: React.ReactNode; 
    className?: string;
    iconSize?: string;
  }) => (
    <div className="relative">
      <img 
        src={src} 
        alt={alt}
        className={iconSize}
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

  const technicalSkills = [
    { name: 'Networking', icon: <FaNetworkWired color="#4ADE80" /> },
    { name: 'Cloud Computing', icon: <FaCloud color="#38BDF8" /> },
    { name: 'Docker', icon: <FaDocker color="#6366F1" /> },
    { name: 'Kubernetes', icon: <SiKubernetes color="#8B5CF6" /> },
    { name: 'Linux', icon: <FaLinux color="#F59E0B" /> },
    { name: 'Git', icon: <FaGitAlt color="#EF4444" /> },
    { name: 'Terraform', icon: <SiTerraform color="#E879F9" /> },
    { name: 'Ansible', icon: <SiAnsible color="#6EE7B7" /> },
    { name: 'CI/CD', icon: <SiJenkins color="#F9A8D4" /> },
    { name: 'Monitoring', icon: <SiPrometheus color="#A78BFA" /> },
    { name: 'Grafana', icon: <SiGrafana color="#34D399" /> },
    { name: 'Security', icon: <FaShieldAlt color="#F472B6" /> },
    { name: 'Servers', icon: <FaServer color="#A85534" /> },
    { name: 'Python', icon: <FaPython color="#60A5FA" /> },
    { name: 'JavaScript', icon: <FaJs color="#FACC15" /> },
    { name: 'React', icon: <FaReact color="#22D3EE" /> },
    { name: 'Databases', icon: <FaDatabase color="#FB7185" /> },
    { name: 'AWS', icon: <FaAws color="#FF9900" /> },
    { name: 'GCP', icon: <FaGoogle color="#4285F4" /> },
    { name: 'Azure', icon: <FaMicrosoft color="#00A2E8" /> },
    { name: 'VMware', icon: <SiVmware color="#60A5FA" /> },
    { name: 'Cisco', icon: <SiCisco color="#F472B6" /> },
    { name: 'MongoDB', icon: <SiMongodb color="#4ADE80" /> },
    { name: 'PostgreSQL', icon: <SiPostgresql color="#38BDF8" /> },
    { name: 'Redis', icon: <SiRedis color="#EF4444" /> },
    { name: 'Nginx', icon: <SiNginx color="#60A5FA" /> },
    { name: 'Apache', icon: <SiApache color="#FACC15" /> },
    { name: 'YAML', icon: <SiYaml color="#F59E0B" />} ,
    { name: 'MySQL', icon: <SiPostgresql color="#4479A1" /> },
    { name: 'Lua', icon: <SiLua color="#2C2D72" /> },
    { name: 'Proxmox', icon: <SiProxmox color="#FFA500" /> },
    { name: 'GitHub Actions', icon: <SiGithubactions color="#2088FF" /> },
    { name: 'Nutanix', icon: <SiNutanix color="#00A2E8" /> },
    { name: 'Shell Utilities', icon: <SiShell color="#FBBF24" /> },
  ];

  const certifications = [
    {
      name: "Google Cybersecurity Professional Certificate",
      issuer: "Google",
      year: "2023",
      color: "red",
      icon: "/uploads/google.svg",
      externalLink: "https://www.coursera.org/account/accomplishments/specialization/certificate/Z2JGANLU4RUZ"
    },
  ];

  const talks = [
    {
      title: "Securing IPv6 Networks with Firewalls",
      event: "Workshop Session",
      organizer: "IIESOC, Dept. of CSE and COSH-NITK Surathkal",
      description: "Delivered a technical session on IPv6 network security, covering firewall architecture, stateful filtering, and deployment best practices for dual-stack environments.",
      color: "blue",
      icon: "/uploads/nitk.svg",
      fallback: <Presentation className="w-6 h-6 text-blue-400" />,
      externalLink: "https://www.nitk.ac.in/document/attachments/6599/2024_Workshop_on_IPv6_Deployment.pdf"
    },
    {
      title: "WAN Aggregation using OpenMPTCProuter (OMR)",
      event: "FOSS Meetup 2024",
      organizer: "FOSS United",
      description: "Introduced Multipath TCP (MPTCP) and OpenMPTCProuter, demonstrated real-world WAN aggregation, failover, and dynamic routing on Raspberry Pi.",
      color: "violet",
      icon: "/uploads/foss.svg",
      fallback: <Presentation className="w-6 h-6 text-purple-400" />,
      externalLink: "https://fossunited.org/c/mangalore/mangalore-october-2024/cfp/b4crbbvath"
    },
    {
      title: "Introduction to Self-Hosting with Free and Open Source Tools",
      event: "FOSS Meetup 2025",
      organizer: "FOSS United",
      description: "Presented self-hosting as a privacy-respecting, cloud-independent approach, covering Docker, Proxmox VE, reverse proxies, and backup best practices.",
      color: "emerald",
      icon: "/uploads/foss.svg",
      fallback: <Presentation className="w-6 h-6 text-emerald-400" />,
      externalLink: "https://fossunited.org/c/mangalore/mangalore-may-2025/cfp/8dk9fae74j"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { gradient: string; text: string; border: string }> = {
      blue: { gradient: "from-blue-500 to-indigo-500", text: "text-blue-400", border: "border-blue-500/30" },
      violet: { gradient: "from-violet-500 to-purple-500", text: "text-violet-400", border: "border-violet-500/30" },
      emerald: { gradient: "from-emerald-500 to-teal-500", text: "text-emerald-400", border: "border-emerald-500/30" },
      red: { gradient: "from-red-500 to-orange-500", text: "text-red-400", border: "border-red-500/30" },
      pink: { gradient: "from-pink-500 to-rose-500", text: "text-pink-400", border: "border-pink-500/30" },
    };
    return colors[color] || colors.violet;
  };

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className="relative py-16 md:py-24 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-pink-600/8 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 -left-48 w-96 h-96 bg-blue-600/8 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Skills & </span>
            <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">Expertise</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-500" />
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <div className="h-px w-24 bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
        </div>

        {/* Technical Skills */}
        <div className={`max-w-7xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.1s' }}>
          <div className="p-6 md:p-8 rounded-2xl liquid-glass">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">Technical Skills</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {technicalSkills.map((skill, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all duration-300 group cursor-default"
                >
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className={`max-w-4xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Certifications</h3>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500 to-transparent mx-auto" />
          </div>
          <div className="p-6 md:p-8 rounded-2xl liquid-glass">
            {certifications.map((cert, index) => {
              const colors = getColorClasses(cert.color);
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <CustomIcon 
                        src={cert.icon} 
                        alt={cert.name}
                        fallback={<Award className="w-10 h-10 text-red-400" />}
                        iconSize="w-12 h-12"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-1">{cert.name}</h4>
                      <p className="text-gray-400">{cert.issuer} • {cert.year}</p>
                    </div>
                  </div>
                  {cert.externalLink && (
                    <a 
                      href={cert.externalLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Talks & Presentations */}
        <div className={`max-w-7xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.3s' }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Talks & Presentations</h3>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-violet-500 to-transparent mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talks.map((talk, index) => {
              const colors = getColorClasses(talk.color);
              return (
                <div 
                  key={index} 
                  className="group p-6 rounded-2xl liquid-glass hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <img 
                        src={talk.icon} 
                        alt={talk.title}
                        className={`w-12 h-12 object-contain ${(talk.icon.includes('foss') || talk.icon.includes('nitk')) ? 'invert brightness-200' : ''}`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    {talk.externalLink && (
                      <a 
                        href={talk.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">{talk.title}</h4>
                  <p className={`text-base font-semibold ${colors.text} mb-1`}>
                    {talk.event}
                  </p>
                  {talk.organizer && (
                    <p className="text-gray-500 text-sm mb-3">{talk.organizer}</p>
                  )}
                  <p className="text-gray-400 text-sm leading-relaxed">{talk.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leadership & Community */}
        <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.4s' }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Leadership & Community</h3>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-violet-500 to-transparent mx-auto" />
          </div>
          <div className="p-6 md:p-8 rounded-2xl liquid-glass">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <img 
                  src="/uploads/wec.svg" 
                  alt="Web Enthusiasts Club (WEC) NITK" 
                  className="w-14 h-14 object-contain flex-shrink-0"
                />
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Web Enthusiasts Club (WEC) NITK</h4>
                  <p className="text-lg font-semibold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Secretary, Systems and Security SIG
                  </p>
                </div>
              </div>
              <a 
                href="https://webclub.nitk.ac.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 self-start"
              >
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </a>
            </div>
            <ul className="space-y-3">
              {[
                "Created 10+ thought-provoking CTF challenges for the annual cybersecurity competition",
                "Organized technical workshops on network security and infrastructure management",
                "Mentored junior students in systems administration and cybersecurity practices"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 group/item">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                  <span className="text-gray-400 leading-relaxed group-hover/item:text-gray-300 transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
};
