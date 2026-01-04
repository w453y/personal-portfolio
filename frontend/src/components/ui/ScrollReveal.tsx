import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // delay in ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number; // duration in ms
  once?: boolean; // if true, only animate once (don't hide when scrolling out)
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 500,
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
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully in view
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

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
