import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ children, index, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{
        y: -10,
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
        transition: { 
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }}
      animate={{
        y: [0, -5, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.3
        }
      }}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glowing border effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.4), transparent)',
          filter: 'blur(1px)'
        }}
        whileHover={{
          opacity: 1,
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
      />
      
      {/* Gradient glow */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-lg opacity-0 blur-lg"
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

export default FloatingCard;