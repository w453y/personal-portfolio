
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

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Navigation />
      <div id="hero" className="bg-section-blue">
        <Hero />
      </div>
      <div id="about" className="bg-section-purple">
        <About />
      </div>
      <div id="experience" className="bg-section-cyan">
        <Experience />
      </div>
      <div id="projects" className="bg-section-pink">
        <Projects />
      </div>
      <div id="skills" className="bg-section-teal">
        <Skills />
      </div>
      <div id="education" className="bg-section-blue">
        <Education />
      </div>
      <div id="contact" className="bg-section-purple">
        <Contact />
      </div>
    </div>
  );
};

export default Index;
