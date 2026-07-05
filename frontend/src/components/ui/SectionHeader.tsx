import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { DecodeText } from './DecodeText';

interface SectionHeaderProps {
  title: string;
  highlight: string;
  accent?: 'green' | 'cyan' | 'amber' | 'sky';
  subtitle?: string;
}

const ACCENTS: Record<string, string> = {
  green: 'from-violet-400 via-fuchsia-400 to-cyan-400',
  cyan: 'from-cyan-400 to-blue-300',
  amber: 'from-pink-400 to-rose-300',
  sky: 'from-blue-400 to-indigo-300',
};

/** Section header with Matrix-decode titles and an accent underline. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  highlight,
  accent = 'green',
  subtitle,
}) => {
  return (
    <ScrollReveal className="text-center mb-16">
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
        <DecodeText text={title} className="text-white" />{' '}
        <DecodeText
          text={highlight}
          className={`bg-gradient-to-r ${ACCENTS[accent]} bg-clip-text text-transparent`}
        />
      </h2>
      <div className="flex items-center justify-center gap-2" aria-hidden="true">
        <div className="h-px w-10 bg-gradient-to-r from-transparent to-violet-500/60" />
        <div className="h-1 w-14 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />
        <div className="h-px w-10 bg-gradient-to-l from-transparent to-cyan-500/60" />
      </div>
      {subtitle && (
        <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">{subtitle}</p>
      )}
    </ScrollReveal>
  );
};

export default SectionHeader;
