import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessagesSquare, Shield, Users, Server } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabase';

const JoinServer = () => {
  const [serverInfo, setServerInfo] = useState({
    name: "Nash Server",
    description: "Join my community!",
    invite_link: "https://discord.gg/placeholder"
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const { data } = await supabase.from('site_content').select('content').eq('section_key', 'server_info').single();
      if (data) setServerInfo(data.content);
    };
    fetchInfo();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto flex flex-col items-center">
      <AnimatedSection className="w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Join My <span className="text-gradient">Server</span></h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Become part of the community. Chat with me, get support, and meet other developers!
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="w-full">
        <motion.div 
          className="glass p-12 text-center relative overflow-hidden rounded-3xl border border-[#5865F2]/30 glow-border"
          whileHover={{ boxShadow: '0 10px 40px rgba(88, 101, 242, 0.15)' }}
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#5865F2] blur-[100px] opacity-10 z-0"></div>

          <div className="relative z-10">
            <div className="w-24 h-24 bg-[#5865F2] rounded-3xl flex items-center justify-center mx-auto mb-8 -rotate-6 shadow-xl shadow-[#5865F2]/30">
              <MessagesSquare size={48} className="text-white" />
            </div>

            <h2 className="text-3xl font-bold mb-4">{serverInfo.name}</h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-lg mx-auto">
              {serverInfo.description}
            </p>

            <div className="flex justify-center gap-8 mb-12">
              <div className="flex flex-col items-center gap-2">
                <Users size={28} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">Community</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield size={28} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">Support</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Server size={28} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">Bots</span>
              </div>
            </div>

            <a 
              href={serverInfo.invite_link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-lg px-12 py-4 rounded-xl transition-all hover:scale-105 inline-block shadow-lg shadow-[#5865F2]/20 glow"
            >
              Join Server
            </a>
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  );
};

export default JoinServer;
