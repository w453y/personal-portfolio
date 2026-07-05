import React, { useEffect, useState } from 'react';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  holdTime?: number;
  className?: string;
}

/** Cycles through words with a type / hold / delete loop and blinking caret. */
export const Typewriter: React.FC<TypewriterProps> = ({
  words,
  typingSpeed = 65,
  deletingSpeed = 35,
  holdTime = 1800,
  className = '',
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];

    let delay = isDeleting ? deletingSpeed : typingSpeed;
    if (!isDeleting && text === current) {
      delay = holdTime;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text === current) {
          setIsDeleting(true);
        } else {
          setText(current.slice(0, text.length + 1));
        }
      } else {
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        } else {
          setText(current.slice(0, text.length - 1));
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, holdTime]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-[2px] h-[1em] align-middle bg-cyan-400 ml-1 animate-blink" />
    </span>
  );
};

export default Typewriter;
