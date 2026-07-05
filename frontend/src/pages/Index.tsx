import React, { useState } from 'react';
import { IntroPage } from '@/components/IntroPage';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Experience } from '@/components/Experience';
import { Projects } from '@/components/Projects';
import { Skills } from '@/components/Skills';
import { Education } from '@/components/Education';
import { Contact } from '@/components/Contact';
import { GlobalBackground } from '@/components/GlobalBackground';
import { CommandPalette } from '@/components/CommandPalette';
import { SideRail } from '@/components/SideRail';

const Index = () => {
  // In production the intro plays on every page load. In dev it plays once
  // per session, because Vite's HMR reconnect forces full reloads on tab
  // refocus and would replay it constantly.
  const [showIntro, setShowIntro] = useState(() => {
    if (!import.meta.env.DEV) return true;
    try {
      return sessionStorage.getItem('introShown') !== '1';
    } catch {
      return true;
    }
  });

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('introShown', '1');
    } catch { /* private mode — ignore */ }
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: 'var(--term-bg)' }}>
      <GlobalBackground />
      <Navigation />
      <main className="relative z-10">
        <div id="hero">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="experience">
          <Experience />
        </div>
        <div id="projects">
          <Projects />
        </div>
        <div id="skills">
          <Skills />
        </div>
        <div id="education">
          <Education />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </main>
      <SideRail />
      <CommandPalette />
    </div>
  );
};

export default Index;
