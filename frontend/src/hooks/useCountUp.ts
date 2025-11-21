import { useState, useEffect } from 'react';

interface UseCountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
}

export const useCountUp = ({ 
  end, 
  duration = 2000, 
  delay = 0,
  startOnView = false 
}: UseCountUpProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnView);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime + delay;
        if (delay > 0) {
          animationFrame = requestAnimationFrame(animate);
          return;
        }
      }

      if (currentTime < startTime) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutCubic * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, delay, isVisible]);

  return { count, setIsVisible };
};

export default useCountUp;