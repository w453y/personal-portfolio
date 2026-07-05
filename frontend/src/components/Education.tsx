import React from 'react';
import { GraduationCap, Calendar, MapPin, Award, BookOpen, ExternalLink } from 'lucide-react';
import { ScrollReveal } from './ui/ScrollReveal';
import { SectionHeader } from './ui/SectionHeader';
import { SpotlightCard } from './ui/SpotlightCard';

export const Education = () => {
  return (
    <section 
      id="education" 
      className="relative py-8 md:py-12 overflow-hidden"
    >
      {/* Background elements */}

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <SectionHeader
          title="My"
          highlight="Education"
          accent="sky"
        />

        <ScrollReveal className="max-w-6xl mx-auto" delay={100}>
          <SpotlightCard className="p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8 gap-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 flex-1">
                <div className="flex-shrink-0">
                  <img
                    src="/uploads/nitk.svg"
                    alt="NITK Surathkal"
                    className="w-32 h-32 sm:w-40 sm:h-40 object-contain invert brightness-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">National Institute of Technology Karnataka, Surathkal</h3>
                      <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        Bachelor of Technology (B.Tech)
                      </p>
                      <p className="text-base sm:text-lg text-cyan-400 font-medium mb-2">Metallurgical and Materials Engineering</p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Surathkal, Karnataka, India</span>
                      </div>
                    </div>
                    <a 
                      href="https://www.nitk.ac.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="self-start p-2.5 rounded-md term-chip hover:border-violet-500/40 transition-all duration-300 hover:scale-110"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="lg:ml-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  November 2022 - May 2026
                </span>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              {/* Academic Focus */}
              <ScrollReveal delay={150} direction="left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Academic Focus
                  </h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Materials Science & Engineering",
                    "Process Engineering & Optimization",
                    "Applied Mathematics & Statistics",
                    "Computer Science & Programming"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 group/item">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                      <span className="text-gray-400 leading-relaxed group-hover/item:text-gray-300 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              {/* Leadership & Activities */}
              <ScrollReveal delay={200} direction="right">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Leadership & Activities
                  </h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Secretary, Systems & Security SIG at WEC",
                    "CTF Competition Organizer",
                    "Technical Workshop Coordinator",
                    "Research Project Contributor"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 group/item">
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                      <span className="text-gray-400 leading-relaxed group-hover/item:text-gray-300 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>

            {/* Achievements */}
            <ScrollReveal className="mt-10" delay={250}>
              <div className="p-6 rounded-lg term-panel">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Notable Achievements
                  </h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Active contributor to networking research projects with industry collaboration",
                    "Led multiple technical workshops on cybersecurity and network infrastructure",
                    "Recipient of APNIC funding for IPv6 deployment research project"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 group/item">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                      <span className="text-gray-400 text-sm leading-relaxed group-hover/item:text-gray-300 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </SpotlightCard>
        </ScrollReveal>
      </div>
      
    </section>
  );
};
