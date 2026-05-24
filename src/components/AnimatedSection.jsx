import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({ children, delay = 0, style = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
