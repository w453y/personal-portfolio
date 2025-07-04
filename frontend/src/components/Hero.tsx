import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaReddit, FaPhone, FaEnvelope, FaTelegram, FaDiscord } from 'react-icons/fa';
import { ArrowDown } from 'lucide-react';

export const Hero = () => {
  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Updated gradient background to seamlessly match About section */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-slate-800/40 to-slate-900/30"></div>
      </div>
      
      {/* Network-themed floating elements */}
      <div className="absolute inset-0">
        {/* Network nodes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full animate-network-pulse shadow-lg shadow-blue-400/50"></div>
        <div className="absolute top-32 left-48 w-3 h-3 bg-purple-400 rounded-full animate-network-pulse shadow-lg shadow-purple-400/50" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-40 right-32 w-5 h-5 bg-indigo-400 rounded-full animate-network-pulse shadow-lg shadow-indigo-400/50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-32 w-3 h-3 bg-cyan-400 rounded-full animate-network-pulse shadow-lg shadow-cyan-400/50" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-32 right-20 w-4 h-4 bg-blue-400 rounded-full animate-network-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '2s' }}></div>
        
        {/* Connection lines */}
        <div className="absolute top-24 left-24 w-24 h-px bg-gradient-to-r from-blue-400/60 to-purple-400/60 rotate-45 animate-pulse"></div>
        <div className="absolute top-44 right-36 w-32 h-px bg-gradient-to-r from-indigo-400/60 to-cyan-400/60 -rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-44 left-36 w-28 h-px bg-gradient-to-r from-cyan-400/60 to-blue-400/60 rotate-12 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating server/network icons */}
        <div className="absolute top-16 right-16 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg flex items-center justify-center animate-float">
          <div className="w-6 h-6 border-2 border-blue-400 rounded-sm"></div>
        </div>
        <div className="absolute bottom-20 left-16 w-10 h-10 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 right-10 w-8 h-8 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg flex items-center justify-center animate-float" style={{ animationDelay: '3s' }}>
          <div className="w-3 h-3 bg-indigo-400 rounded-sm"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-slide-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-inter">
              Abdul Wasey
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-2xl md:text-3xl text-slate-300 mb-6 font-medium">
              Network Engineer • DevOps & Cloud Specialist
            </p>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Architecting resilient, secure, and scalable network infrastructure. Passionate about automation, open-source, and empowering the tech community. Experienced in SD-WAN, IPv6, virtualization, and cloud-native deployments.
            </p>
            
            <div className="grid grid-cols-3 md:grid-cols-9 gap-4 mb-12 max-w-3xl mx-auto">
              <a href="tel:+91-7090344713" className="group flex flex-col items-center p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80">
                <FaPhone className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-sm text-slate-300">Call</span>
              </a>
              <a href="mailto:awasey8905@gmail.com" className="group flex flex-col items-center p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80">
                <FaEnvelope className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-sm text-slate-300">Email</span>
              </a>
              <a href="https://linkedin.com/in/w453y" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80">
                <FaLinkedin className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-sm text-slate-300">LinkedIn</span>
              </a>
              <a href="https://github.com/w453y" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80">
                <FaGithub className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-sm text-slate-300">GitHub</span>
              </a>
              <a href="https://twitter.com/w453y" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80">
                <FaTwitter className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-sm text-slate-300">Twitter</span>
              </a>
              <a href="https://instagram.com/w453y" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80">
                <FaInstagram className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-sm text-slate-300">Instagram</span>
              </a>
              <a href="https://reddit.com/u/w453y" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80">
                <FaReddit className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-sm text-slate-300">Reddit</span>
              </a>
              <a href="https://t.me/w453y" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80">
                <FaTelegram className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-sm text-slate-300">Telegram</span>
              </a>
              <a href="https://discordapp.com/users/791356749348601866" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80">
                <FaDiscord className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-sm text-slate-300">Discord</span>
              </a>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={handleScrollToAbout}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                <span>Explore My Journey</span>
                <ArrowDown size={20} className="group-hover:animate-bounce transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seamless gradient transition to About section - NO VISIBLE LINE */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-indigo-900 via-indigo-900/90 via-slate-800/70 to-transparent"></div>
    </section>
  );
};
