import React from 'react';
import { User, Target, Lightbulb, Rocket } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Seamless gradient background that matches Hero section */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="order-2 lg:order-1 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Who I Am</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Hi, I'm Abdul Wasey — a passionate network engineer, systems architect, and open-source enthusiast. I specialize in building resilient, scalable, and secure network infrastructure, with a strong focus on automation, DevOps, and cloud-native solutions. My journey spans hands-on research, technical leadership, and real-world deployments across enterprise and academic environments.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Target className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Core Competencies</h3>
                  <p className="text-slate-300 leading-relaxed">
                    • Network Engineering (IPv4/IPv6, SD-WAN, VLANs, Firewalls, VPNs, Load Balancing)<br />
                    • DevOps & Automation (Docker, Kubernetes, CI/CD, Monitoring, Scripting)<br />
                    • Cloud & Virtualization (AWS, GCP, Proxmox, Nutanix, Linux, Systemd)<br />
                    • Security & Research (NAC, PacketFence, Penetration Testing, CTFs)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">What Drives Me</h3>
                  <p className="text-slate-300 leading-relaxed">
                    I thrive on solving complex networking challenges, automating infrastructure, and sharing knowledge through workshops and open-source projects. My work is driven by curiosity, a security-first mindset, and a commitment to empowering others in the tech community.
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src="/uploads/profile.jpg" 
                      alt="Abdul Wasey" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 shadow-lg">
                  <img src="/uploads/w453y.svg" alt="w453y" className="h-14 w-auto" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="text-blue-400" size={28} />
                <h3 className="text-2xl font-semibold text-blue-400">Current Focus</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3"><div className="w-2 h-2 bg-blue-400 rounded-full"></div><span className="text-slate-300">Enterprise Network Engineering & Automation</span></li>
                <li className="flex items-center space-x-3"><div className="w-2 h-2 bg-blue-400 rounded-full"></div><span className="text-slate-300">IPv6 & SD-WAN Deployments</span></li>
                <li className="flex items-center space-x-3"><div className="w-2 h-2 bg-blue-400 rounded-full"></div><span className="text-slate-300">Cloud Integration & Virtualization</span></li>
                <li className="flex items-center space-x-3"><div className="w-2 h-2 bg-blue-400 rounded-full"></div><span className="text-slate-300">Network Security & Monitoring</span></li>
              </ul>
            </div>
            <div className="group bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3 mb-4">
                <Rocket className="text-purple-400" size={28} />
                <h3 className="text-2xl font-semibold text-purple-400">Research Interests</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3"><div className="w-2 h-2 bg-purple-400 rounded-full"></div><span className="text-slate-300">Network Security</span></li>
                <li className="flex items-center space-x-3"><div className="w-2 h-2 bg-purple-400 rounded-full"></div><span className="text-slate-300">IPv6 & Routing</span></li>
                <li className="flex items-center space-x-3"><div className="w-2 h-2 bg-purple-400 rounded-full"></div><span className="text-slate-300">Cloud Automation</span></li>
                <li className="flex items-center space-x-3"><div className="w-2 h-2 bg-purple-400 rounded-full"></div><span className="text-slate-300">Open Source Tools</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-purple-900 via-purple-900/80 to-transparent"></div>
    </section>
  );
};
