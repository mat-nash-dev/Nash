import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import DecovarLoader from './DecovarLoader';

const Preloader = () => {
  const { appStatus, setAppStatus } = useAppContext();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // 30 second timeout for bad internet
    const warningTimer = setTimeout(() => {
      if (appStatus === 'loading') {
        setShowWarning(true);
      }
    }, 30000);

    return () => clearTimeout(warningTimer);
  }, [appStatus]);

  useEffect(() => {
    if (appStatus === 'pfp-reveal') {
      // Show the PFP in the center for 1 second, then finish
      const finishTimer = setTimeout(() => {
        setAppStatus('finished');
      }, 1000);
      return () => clearTimeout(finishTimer);
    }
  }, [appStatus, setAppStatus]);

  return (
    <motion.div 
      className="loader-container force-gpu bg-background flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {appStatus === 'loading' ? (
          <motion.div 
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center"
            style={{ width: '180px', height: '180px' }}
          >
            <div className="loader1-spinner-item"></div>
            <div className="loader1-spinner-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="decovar-loader" data-text="NASH" style={{ fontSize: '1.5rem', letterSpacing: '3px' }}>NASH</span>
            </div>
            
            {showWarning && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-[220px] w-[300px] text-center text-red-400 font-medium bg-red-500/10 p-4 rounded-xl border border-red-500/20 shadow-xl"
              >
                It seems the internet is really bad for you today! Or maybe there could be an issue with the server.
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="pfp"
            layoutId="hero-avatar"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-primary to-accent glow-border z-50 shadow-2xl"
          >
            <img 
              src="https://github.com/NashCodes77/Regis/blob/main/images/matnashplays.png?raw=true" 
              alt="Nash" 
              className="w-full h-full rounded-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Preloader;
