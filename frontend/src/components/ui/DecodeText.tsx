import React, { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

interface DecodeTextProps {
  text: string;
  className?: string;
  /** ms per resolved character */
  speed?: number;
}

/**
 * Matrix-style decode: characters scramble and lock into place left-to-right
 * each time the element scrolls into view.
 */
export const DecodeText: React.FC<DecodeTextProps> = ({ text, className = '', speed = 35 }) => {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const scramble = () => {
      let resolved = 0;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        resolved += 1;
        if (resolved >= text.length) {
          setDisplay(text);
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        }
        const locked = text.slice(0, resolved);
        let noise = '';
        for (let i = resolved; i < text.length; i++) {
          noise += text[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(locked + noise);
      }, speed);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) scramble();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default DecodeText;
