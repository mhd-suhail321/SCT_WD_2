import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Display = forwardRef(({ value }, ref) => (
  <motion.input
    ref={ref}
    type="text"
    className="display"
    value={value}
    readOnly
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 20, opacity: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  />
));

export default Display;