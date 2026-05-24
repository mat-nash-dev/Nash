import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 'loading' | 'pfp-reveal' | 'finished'
  const [appStatus, setAppStatus] = useState('loading');
  const [heroContent, setHeroContent] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        const start = Date.now();
        // Fetch hero content
        const { data } = await supabase.from('site_content').select('content').eq('section_key', 'hero').single();
        if (data) setHeroContent(data.content);
        
        // Ensure the loader shows for at least 1.5 seconds to feel smooth, even if fast
        const elapsed = Date.now() - start;
        const delay = Math.max(1500 - elapsed, 0);
        
        setTimeout(() => {
          setAppStatus('pfp-reveal');
        }, delay);
      } catch (err) {
        console.error('Init app error', err);
        // Fallback to move forward anyway
        setTimeout(() => setAppStatus('pfp-reveal'), 2000);
      }
    };
    initApp();
  }, []);

  return (
    <AppContext.Provider value={{ appStatus, setAppStatus, heroContent }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
