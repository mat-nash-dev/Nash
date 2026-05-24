import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Server, Briefcase } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabase';

const Work = () => {
  const [services, setServices] = useState([
    {
      icon: "Code",
      title: "Web Development",
      desc: "Creating high-tier, interactive, and fast frontend experiences with modern stacks."
    },
    {
      icon: "Terminal",
      title: "Discord Bots",
      desc: "Custom bot development for moderation, economy, and server utilities."
    },
    {
      icon: "Server",
      title: "Server Setup",
      desc: "Professional Discord server design, role hierarchies, and permission management."
    }
  ]);
  const [footerText, setFooterText] = useState("Currently accepting new clients! And the best part? I don't charge anything for now.");

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('content').eq('section_key', 'what_i_do').single();
      if (data && data.content) {
        if (data.content.services) setServices(data.content.services);
        if (data.content.footerText) setFooterText(data.content.footerText);
      }
    };
    fetchContent();
  }, []);

  const getIcon = (name) => {
    switch (name) {
      case 'Terminal': return <Terminal size={32} className="text-primary" />;
      case 'Server': return <Server size={32} className="text-primary" />;
      case 'Briefcase': return <Briefcase size={32} className="text-primary" />;
      case 'Code':
      default: return <Code size={32} className="text-primary" />;
    }
  };

  return (
    <div className="container py-12 min-h-[80vh] flex flex-col items-center">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">My <span className="text-gradient glow-text">Work & Services</span></h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Here is a breakdown of what I do and the services I offer.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
        {services.map((service, idx) => (
          <AnimatedSection key={idx} delay={0.2 + idx * 0.1}>
            <div className="glass p-8 rounded-2xl h-full flex flex-col items-start group hover:-translate-y-2 transition-transform duration-300 border border-border/50 hover:border-primary/50 glow-border">
              <div className="p-4 bg-primary/10 rounded-xl mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                {getIcon(service.icon)}
              </div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-1">
                {service.desc}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.6} className="w-full max-w-4xl text-center">
         <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 text-lg relative overflow-hidden group glow">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {footerText}
         </div>
      </AnimatedSection>
    </div>
  );
};

export default Work;
