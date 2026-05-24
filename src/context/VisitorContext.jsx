import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const VisitorContext = createContext();

export const VisitorProvider = ({ children }) => {
  const [visitNumber, setVisitNumber] = useState(null);
  const { user } = useAuth();
  const hasRun = React.useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const trackVisitor = async () => {
      try {
        // 1. Get current count and increment
        const { data, error } = await supabase.rpc('increment_visitor_count');
        
        let currentVisitNum = 1;
        if (!error && data) {
           currentVisitNum = data;
        } else {
           // Fallback if RPC fails
           const { data: counterData } = await supabase.from('visitor_counter').select('total_count').eq('id', 1).single();
           if (counterData) {
             currentVisitNum = counterData.total_count + 1;
             await supabase.from('visitor_counter').update({ total_count: currentVisitNum }).eq('id', 1);
           }
        }
        
        setVisitNumber(currentVisitNum);

        // Fetch IP and log visitor
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const { ip } = await res.json();
          await supabase.from('visitors').insert([{
            ip_address: ip,
            user_agent: navigator.userAgent,
            visit_number: currentVisitNum
          }]);
        } catch (e) {
          console.error("Failed to log visitor:", e);
        }
        
        toast(`You are the ${currentVisitNum}${getOrdinalSuffix(currentVisitNum)} person to view my website! 🎉`, {
          duration: 6000,
          position: 'bottom-center',
          style: {
            background: '#12121a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        });
      } catch (err) {
        console.error('Visitor tracking error:', err);
      }
    };

    trackVisitor();
  }, []);

  const getOrdinalSuffix = (i) => {
    const j = i % 10,
          k = i % 100;
    if (j == 1 && k != 11) return "st";
    if (j == 2 && k != 12) return "nd";
    if (j == 3 && k != 13) return "rd";
    return "th";
  };

  return (
    <VisitorContext.Provider value={{ visitNumber }}>
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => {
  return useContext(VisitorContext);
};
