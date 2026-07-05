import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // delay in ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number; // duration in ms
  once?: boolean; // if true, only animate once (don't hide when scrolling out)
}

/**
 * Reveal-on-scroll. The observed outer wrapper never moves; the transform
 * is applied to an inner element. This prevents the hide animation from
 * shifting the observed bounds and re-triggering the observer (which
 * causes visible flicker at the viewport edge). The stagger delay applies
 * only when showing, so hiding is always immediate and smooth.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 600,
  once = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasAnimated(true);
        } else if (!once || !hasAnimated) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, hasAnimated]);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';

    switch (direction) {
      case 'up':
        return 'translateY(30px)';
      case 'down':
        return 'translateY(-30px)';
      case 'left':
        return 'translateX(30px)';
      case 'right':
        return 'translateX(-30px)';
      case 'none':
      default:
        return 'translate(0, 0)';
    }
  };

  const activeDelay = isVisible ? delay : 0;

  return (
    <div ref={ref} className={className}>
      <div
        style={{
          height: '100%',
          opacity: isVisible ? 1 : 0,
          transform: getTransform(),
          transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${activeDelay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${activeDelay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollReveal;
