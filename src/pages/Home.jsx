import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, MessageCircle, Briefcase, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const fallbackReviews = [
  { rating: 5, content: "MatNash built my server's administration bot from scratch! Absolute genius. Speed and security are premium-tier.", profiles: { username: "AlexDev", avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop" }, created_at: "2026-05-18" },
  { rating: 5, content: "Highly responsive developer. The transitions on our custom site are extremely smooth and beautiful.", profiles: { username: "QuantumCode", avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop" }, created_at: "2026-05-12" },
  { rating: 5, content: "Professional-grade setup, permissions, and roles are fully organized. Best Discord specialist I've met.", profiles: { username: "ShadowWalker", avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" }, created_at: "2026-05-09" }
];

const Home = () => {
  const { heroContent } = useAppContext();
  const [reviews, setReviews] = useState(fallbackReviews);
  
  const content = heroContent || {
    title: "MatNashPlays",
    tagline: "Developer & Creator",
    description: "I build high-tier, interactive digital experiences."
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setReviews(data);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="container py-8 min-h-[85vh] flex flex-col justify-center gap-12">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex flex-col justify-center">
        <AnimatedSection>
          <motion.div
            layoutId="hero-avatar"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-8 p-1 bg-gradient-to-br from-primary to-accent glow-border"
          >
            <img 
              src="https://github.com/NashCodes77/Regis/blob/main/images/matnashplays.png?raw=true" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </motion.div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4 tracking-tight">
            Hi, I'm <span className="shadow-dance-text aurora-text-container">
              {content.title}
              <div className="aurora">
                <div className="aurora__item"></div>
                <div className="aurora__item"></div>
                <div className="aurora__item"></div>
                <div className="aurora__item"></div>
              </div>
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6 font-medium">
            <span className="tagline-split py-1" data-text="Developer & Hobbyist">
              <span className="base-text">Developer & Hobbyist</span>
              <span className="split-wrapper top-wrapper">
                <span className="split-text" data-text="Developer & Hobbyist"></span>
              </span>
              <span className="split-wrapper bottom-wrapper">
                <span className="split-text" data-text="Developer & Hobbyist"></span>
              </span>
              <span className="sweep-line"></span>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            {content.description}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.6}>
          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/work" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 glow shadow-lg shadow-primary/20">
              My Work & Services <Briefcase size={20} />
            </Link>
            <Link to="/projects" className="glass hover:glass-strong px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2">
              Portfolio Projects <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="glass hover:glass-strong px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 flex items-center">
              Contact Me
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.8}>
          <div className="flex gap-6 mb-8">
            <a href="#" className="text-muted-foreground hover:text-primary glass p-3 rounded-full transition-colors"><Code size={24} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary glass p-3 rounded-full transition-colors"><MessageCircle size={24} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary glass p-3 rounded-full transition-colors"><Briefcase size={24} /></a>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={1.0} className="w-full mt-8 overflow-hidden relative py-6">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <h3 className="text-xl font-bold font-display text-white">Server Reviews</h3>
          </div>
        </div>

        <div className="w-full overflow-hidden relative select-none">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 w-max animate-marquee">
            {reviews.map((review, idx) => (
              <div key={`t1-${idx}`} className="glass p-6 rounded-2xl w-[320px] flex-shrink-0 flex flex-col justify-between border border-border/40 hover:border-primary/40 hover:glass-strong transition-all duration-300">
                <div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= review.rating ? '#fbbf24' : 'none'} className={s <= review.rating ? 'text-amber-400' : 'text-muted-foreground/20'} />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm italic mb-4 leading-relaxed line-clamp-3">"{review.content}"</p>
                </div>
                <div className="flex items-center gap-3 border-t border-border/40 pt-3">
                  <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-border/50 flex-shrink-0">
                    {review.profiles?.avatar_url ? (
                      <img src={review.profiles.avatar_url} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-primary/20 text-primary">
                        {review.profiles?.username?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{review.profiles?.username || 'Anonymous'}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {reviews.map((review, idx) => (
              <div key={`t2-${idx}`} className="glass p-6 rounded-2xl w-[320px] flex-shrink-0 flex flex-col justify-between border border-border/40 hover:border-primary/40 hover:glass-strong transition-all duration-300">
                <div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= review.rating ? '#fbbf24' : 'none'} className={s <= review.rating ? 'text-amber-400' : 'text-muted-foreground/20'} />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm italic mb-4 leading-relaxed line-clamp-3">"{review.content}"</p>
                </div>
                <div className="flex items-center gap-3 border-t border-border/40 pt-3">
                  <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-border/50 flex-shrink-0">
                    {review.profiles?.avatar_url ? (
                      <img src={review.profiles.avatar_url} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-primary/20 text-primary">
                        {review.profiles?.username?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{review.profiles?.username || 'Anonymous'}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;
