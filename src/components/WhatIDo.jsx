import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Code, Terminal, Server } from 'lucide-react';

const WhatIDo = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const services = [
    {
      icon: <Code size={24} color="var(--accent-primary)" />,
      title: "Web Development",
      desc: "Creating high-tier, interactive, and fast frontend experiences with modern stacks."
    },
    {
      icon: <Terminal size={24} color="var(--accent-primary)" />,
      title: "Discord Bots",
      desc: "Custom bot development for moderation, economy, and server utilities."
    },
    {
      icon: <Server size={24} color="var(--accent-primary)" />,
      title: "Server Setup",
      desc: "Professional Discord server design, role hierarchies, and permission management."
    }
  ];

  return (
    <div className={`glass p-6 rounded-2xl h-full flex flex-col border border-border/50 glow-border ${isMinimized ? 'h-auto' : ''}`}>
      <div 
        className={`flex justify-between items-center cursor-pointer select-none transition-colors hover:text-primary ${isMinimized ? 'mb-0' : 'mb-6'}`}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <h3 className="text-xl font-bold tracking-tight text-gradient">What I Do</h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-white/5">
          {isMinimized ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex-1 flex flex-col"
          >
            <div className="flex flex-col gap-6">
              {services.map((service, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex gap-4 items-start group"
                >
                  <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground group-hover:text-primary transition-colors">{service.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-auto pt-8">
              <div className="p-4 bg-primary/5 rounded-xl border-l-4 border-primary text-sm text-muted-foreground relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                Currently accepting new clients! And the best part? <strong className="text-gradient-gold">I don't charge anything for now.</strong>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatIDo;
