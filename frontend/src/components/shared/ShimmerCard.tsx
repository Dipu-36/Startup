import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const ShimmerCard: React.FC<ShimmerCardProps> = ({ children, index, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        initial={false}
        animate={{
          background: [
            'linear-gradient(110deg, transparent 25%, rgba(139, 92, 246, 0.3) 50%, transparent 75%)',
            'linear-gradient(110deg, transparent 25%, rgba(139, 92, 246, 0.3) 50%, transparent 75%)'
          ],
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Magical particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            initial={{
              x: `${20 + i * 30}%`,
              y: `${30 + i * 20}%`,
              opacity: 0
            }}
            whileInView={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [`${30 + i * 20}%`, `${10 + i * 15}%`]
            }}
            transition={{
              duration: 2,
              delay: index * 0.2 + i * 0.3,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        ))}
      </div>
      
      {children}
    </motion.div>
  );
};

export default ShimmerCard;