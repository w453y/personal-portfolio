import React from 'react';
import { GraduationCap, Calendar, MapPin, Award, BookOpen, ExternalLink } from 'lucide-react';

export const Education = () => {
  return (
    <section id="education" className="relative py-20 overflow-hidden">
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-slate-900/20"></div>
      </div>
      {/* Floating elements */}
      <div className="absolute top-40 left-20 w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 right-40 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Education
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 hover:bg-white/10 transition-all duration-500 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
                {/* Directly render the NITK PNG, no icon container */}
                <img
                  src="/uploads/nitk.png"
                  alt="NITK Surathkal"
                  className="w-40 h-40 sm:w-56 sm:h-56 object-contain"
                  style={{ minWidth: '10rem' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const nextSibling = target.nextElementSibling as HTMLElement;
                    if (nextSibling) {
                      nextSibling.style.display = 'block';
                    }
                  }}
                />
                <div className="hidden">
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">National Institute of Technology Karnataka, Surathkal</h3>
                      <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        Bachelor of Technology (B.Tech)
                      </p>
                      <p className="text-base sm:text-lg text-cyan-300 font-medium mb-2">Metallurgical and Materials Engineering</p>
                      <div className="flex items-center space-x-2 text-slate-400 mb-4 lg:mb-0">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Surathkal, Karnataka, India</span>
                      </div>
                    </div>
                    <a 
                      href="https://www.nitk.ac.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="self-start mt-4 lg:mt-0 lg:ml-4 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                    >
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>November 2022 - May 2026</span>
                </div>
              </div>
            </div>
            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-12">
              {/* Academic Focus */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Academic Focus
                  </h4>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start space-x-4"><div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 leading-relaxed text-sm sm:text-base">Materials Science & Engineering</span></li>
                  <li className="flex items-start space-x-4"><div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 leading-relaxed text-sm sm:text-base">Process Engineering & Optimization</span></li>
                  <li className="flex items-start space-x-4"><div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 leading-relaxed text-sm sm:text-base">Applied Mathematics & Statistics</span></li>
                  <li className="flex items-start space-x-4"><div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 leading-relaxed text-sm sm:text-base">Computer Science & Programming</span></li>
                </ul>
              </div>
              {/* Leadership & Activities */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Leadership & Activities
                  </h4>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start space-x-4"><div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 leading-relaxed text-sm sm:text-base">Secretary, Systems & Security SIG at WEC</span></li>
                  <li className="flex items-start space-x-4"><div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 leading-relaxed text-sm sm:text-base">CTF Competition Organizer</span></li>
                  <li className="flex items-start space-x-4"><div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 leading-relaxed text-sm sm:text-base">Technical Workshop Coordinator</span></li>
                  <li className="flex items-start space-x-4"><div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 leading-relaxed text-sm sm:text-base">Research Project Contributor</span></li>
                </ul>
              </div>
            </div>
            {/* Achievements */}
            <div className="mt-8 lg:mt-12 p-6 sm:p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                <h4 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Notable Achievements
                </h4>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start space-x-4"><div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 text-xs sm:text-sm leading-relaxed">Active contributor to networking research projects with industry collaboration</span></li>
                <li className="flex items-start space-x-4"><div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 text-xs sm:text-sm leading-relaxed">Led multiple technical workshops on cybersecurity and network infrastructure</span></li>
                <li className="flex items-start space-x-4"><div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-2 flex-shrink-0"></div><span className="text-slate-300 text-xs sm:text-sm leading-relaxed">Recipient of APNIC funding for IPv6 deployment research project</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
    </section>
  );
};
