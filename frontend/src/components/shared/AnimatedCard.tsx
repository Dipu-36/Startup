import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, index, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`group relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-lg opacity-0 blur-xl"
        whileHover={{
          opacity: 1,
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
