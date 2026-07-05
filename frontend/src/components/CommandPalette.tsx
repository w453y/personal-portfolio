import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Home, User, Briefcase, FolderGit2, Wrench, GraduationCap, Mail, Github, Linkedin, Twitter, Search, CornerDownLeft } from 'lucide-react';

interface PaletteItem {
  id: string;
  label: string;
  hint: string;
  icon: React.ElementType;
  action: () => void;
}

/**
 * Ctrl/Cmd+K command palette. Also opens on a global `open-palette` event
 * (fired from the status bar hint).
 */
export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  }, []);

  const items: PaletteItem[] = useMemo(() => [
    { id: 'hero', label: 'Go to Home', hint: 'cd ~', icon: Home, action: () => scrollTo('hero') },
    { id: 'about', label: 'Go to About', hint: 'cd ~/about', icon: User, action: () => scrollTo('about') },
    { id: 'experience', label: 'Go to Experience', hint: 'cd ~/career', icon: Briefcase, action: () => scrollTo('experience') },
    { id: 'projects', label: 'Go to Projects', hint: 'cd ~/projects', icon: FolderGit2, action: () => scrollTo('projects') },
    { id: 'skills', label: 'Go to Skills', hint: 'cd ~/skills', icon: Wrench, action: () => scrollTo('skills') },
    { id: 'education', label: 'Go to Education', hint: 'cd ~/education', icon: GraduationCap, action: () => scrollTo('education') },
    { id: 'contact', label: 'Go to Contact', hint: 'cd ~/contact', icon: Mail, action: () => scrollTo('contact') },
    { id: 'github', label: 'Open GitHub', hint: 'github.com/w453y', icon: Github, action: () => { window.open('https://github.com/w453y', '_blank'); setOpen(false); } },
    { id: 'linkedin', label: 'Open LinkedIn', hint: 'linkedin.com/in/w453y', icon: Linkedin, action: () => { window.open('https://linkedin.com/in/w453y', '_blank'); setOpen(false); } },
    { id: 'twitter', label: 'Open Twitter', hint: '@w453y', icon: Twitter, action: () => { window.open('https://twitter.com/w453y', '_blank'); setOpen(false); } },
    { id: 'email', label: 'Send Email', hint: 'awasey8905@gmail.com', icon: Mail, action: () => { window.location.href = 'mailto:awasey8905@gmail.com'; setOpen(false); } },
  ], [scrollTo]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpenEvent = () => setOpen(true);

    window.addEventListener('keydown', onKey);
    window.addEventListener('open-palette', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-palette', onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      // Focus after the element mounts
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[selected]?.action();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-[18vh] px-4 bg-black/60 animate-fade-in"
      style={{ animationDuration: '0.15s' }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl term-card rounded-xl overflow-hidden shadow-2xl animate-scale-in"
        style={{ animationDuration: '0.15s' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[color:var(--term-line)]">
          <Search className="w-4 h-4 text-violet-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleInputKey}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-600 font-mono text-sm"
          />
          <kbd className="hidden sm:block px-1.5 py-0.5 rounded border border-[color:var(--term-line)] text-[10px] font-mono text-gray-500">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[46vh] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-gray-600 font-mono text-sm">command not found: {query}</p>
          )}
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onClick={item.action}
              onMouseEnter={() => setSelected(i)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                i === selected ? 'bg-violet-500/10 text-white' : 'text-gray-400'
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${i === selected ? 'text-violet-400' : 'text-gray-600'}`} />
              <span className="flex-1 text-sm">{item.label}</span>
              <span className="font-mono text-xs text-gray-600">{item.hint}</span>
              {i === selected && <CornerDownLeft className="w-3.5 h-3.5 text-violet-500" />}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[color:var(--term-line)] font-mono text-[10px] text-gray-600">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
