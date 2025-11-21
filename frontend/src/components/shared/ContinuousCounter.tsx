import React, { useState, useEffect } from 'react';

interface ContinuousCounterProps {
  startValue: number;
  interval?: number; // milliseconds between increments
  suffix?: string;
  className?: string;
}

const ContinuousCounter: React.FC<ContinuousCounterProps> = ({
  startValue,
  interval = 2000, // 2 seconds by default
  suffix = '',
  className = ''
}) => {
  const [count, setCount] = useState(startValue);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${startValue}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [startValue]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, interval]);

  return (
    <div id={`counter-${startValue}`} className={className}>
      {count.toLocaleString()}{suffix}
    </div>
  );
};

export default ContinuousCounter;
