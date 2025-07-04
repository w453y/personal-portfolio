import React from 'react';
import { Award, Users, Presentation, ExternalLink } from 'lucide-react';
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
  // Custom icon component that falls back to default if upload fails
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
      gradient: "from-red-400 to-orange-400",
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
      gradient: "from-blue-400 to-indigo-400",
      icon: "/uploads/nitk.png",
      fallback: <Presentation className="w-6 h-6 text-blue-400" />,
      externalLink: "https://www.nitk.ac.in/document/attachments/6599/2024_Workshop_on_IPv6_Deployment.pdf"
    },
    {
      title: "WAN Aggregation using OpenMPTCProuter (OMR)",
      event: "FOSS Meetup 2024",
      organizer: "FOSS United",
      description: "Introduced Multipath TCP (MPTCP) and OpenMPTCProuter, demonstrated real-world WAN aggregation, failover, and dynamic routing on Raspberry Pi.",
      gradient: "from-purple-400 to-pink-400",
      icon: "/uploads/foss.svg",
      fallback: <Presentation className="w-6 h-6 text-purple-400" />,
      externalLink: "https://fossunited.org/c/mangalore/mangalore-october-2024/cfp/b4crbbvath"
    },
    {
      title: "Introduction to Self-Hosting with Free and Open Source Tools",
      event: "FOSS Meetup 2025",
      organizer: "FOSS United",
      description: "Presented self-hosting as a privacy-respecting, cloud-independent approach, covering Docker, Proxmox VE, reverse proxies, and backup best practices.",
      gradient: "from-emerald-400 to-cyan-400",
      icon: "/uploads/foss.svg",
      fallback: <Presentation className="w-6 h-6 text-emerald-400" />,
      externalLink: "https://fossunited.org/c/mangalore/mangalore-may-2025/cfp/8dk9fae74j"
    }
  ];

  const leadershipRoles = [
    { name: 'NITK Student Network Admin', icon: <CustomIcon src="/uploads/admin-icon.svg" alt="Admin" fallback={<span className="text-purple-400">👨‍💼</span>} /> },
    { name: 'Open Source Contributor', icon: <CustomIcon src="/uploads/opensource-icon.svg" alt="Open Source" fallback={<span className="text-green-400">🤝</span>} /> },
    { name: 'Community Mentor', icon: <CustomIcon src="/uploads/mentor-icon.svg" alt="Mentor" fallback={<span className="text-pink-500">🤝</span>} /> },
  ];

  return (
    <section id="skills" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-pink-900 via-purple-900 to-blue-900">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/20 via-transparent to-blue-900/20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Technical Skills */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="col-span-3 group">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/10 hover:scale-105 transition-all duration-500">
                <div className="flex items-center space-x-3 mb-6">
                  <CustomIcon src="/uploads/tech-skills-icon.svg" alt="Technical Skills" fallback={<span className="text-pink-400 text-2xl">⚡</span>} iconSize="w-7 h-7" />
                  <h3 className="text-2xl font-semibold text-white">Technical Skills</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {technicalSkills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 text-slate-300">
                      {skill.icon}
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Certifications</h3>
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 shadow-2xl">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-2xl bg-transparent ${cert.gradient} bg-opacity-20 backdrop-blur-sm border border-white/10`}>
                    <CustomIcon 
                      src={cert.icon} 
                      alt={cert.name}
                      fallback={<Award className="w-8 h-8 text-red-400" />}
                      iconSize="w-8 h-8"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-1">{cert.name}</h4>
                    <p className="text-slate-300">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
                {cert.externalLink && (
                  <a 
                    href={cert.externalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                  >
                    <ExternalLink className="w-5 h-5 text-white/70" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Talks & Presentations */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Talks & Presentations</h3>
            <div className="h-0.5 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {talks.map((talk, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-white/20 shadow-2xl h-full">
                  <div className="flex items-start justify-between mb-4">
                    {/* Directly render the event icon SVG/PNG, no icon container */}
                    <img 
                      src={talk.icon} 
                      alt={talk.title}
                      className="w-14 h-14 object-contain" 
                      style={{ minWidth: '3.5rem' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const nextSibling = target.nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = 'block';
                        }
                      }}
                    />
                    <div className="hidden">{talk.fallback}</div>
                    {talk.externalLink && (
                      <a 
                        href={talk.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                      >
                        <ExternalLink className="w-4 h-4 text-white/70" />
                      </a>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{talk.title}</h4>
                  <p className={`text-lg font-semibold bg-gradient-to-r ${talk.gradient} bg-clip-text text-transparent mb-2`}>
                    {talk.event}
                  </p>
                  {talk.organizer && (
                    <p className="text-slate-400 text-sm mb-4">{talk.organizer}</p>
                  )}
                  <p className="text-slate-300 text-sm leading-relaxed">{talk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership & Community */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Leadership & Community</h3>
            <div className="h-0.5 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6">
                {/* Directly render the SVG for WEC, no icon container */}
                <img 
                  src="/uploads/wec.svg" 
                  alt="Web Enthusiasts Club (WEC) NITK" 
                  className="w-16 h-16 object-contain" 
                  style={{ minWidth: '4rem' }}
                />
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Web Enthusiasts Club (WEC) NITK</h4>
                  <p className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Secretary, Systems and Security SIG
                  </p>
                </div>
              </div>
              <a 
                href="https://webclub.nitk.ac.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <ExternalLink className="w-5 h-5 text-white/70" />
              </a>
            </div>
            <ul className="space-y-4">
              {[
                "Created 10+ thought-provoking CTF challenges for the annual cybersecurity competition",
                "Organized technical workshops on network security and infrastructure management",
                "Mentored junior students in systems administration and cybersecurity practices"
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-900 via-blue-900/80 to-transparent"></div>
    </section>
  );
};
