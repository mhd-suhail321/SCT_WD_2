import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const Button = ({ children, className = '', onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 120, damping: 18, mass: 1.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * 0.12; 
    const dy = (e.clientY - centerY) * 0.12;

    x.set(dx);
    y.set(dy);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Optional: disable magnetic on clear & equals if you want them completely static
  const isStatic = className.includes('btn-clear') || className.includes('btn-equals');

  return (
    <motion.button
      className={`btn ${className}`}
      onClick={onClick}
      onMouseMove={isStatic ? undefined : handleMouseMove}
      onMouseLeave={isStatic ? undefined : handleMouseLeave}
      whileHover={{ scale: 1.06 }}                    // reduced from 1.09
      whileTap={{ scale: 0.93, rotate: -1.8 }}       // reduced rotation
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{
        x: isStatic ? 0 : springX,
        y: isStatic ? 0 : springY,
        translateX: isStatic ? 0 : springX,
        translateY: isStatic ? 0 : springY,
      }}
    >
      {children}
    </motion.button>
  );
};

export default Button;