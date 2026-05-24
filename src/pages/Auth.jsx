import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signInWithDiscord, signInWithEmail, signUp } from '../lib/auth';
import { motion } from 'framer-motion';
import { Mail, Lock, User, LogIn, Disc as Discord, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const Auth = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = isLogin 
        ? await signInWithEmail(email, password)
        : await signUp(email, password, name);

      if (error) throw error;
      
      if (!isLogin) {
        toast.success('Registration successful! Please check your email to verify.');
      } else {
        toast.success('Successfully logged in!');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    try {
      if (provider === 'google') await signInWithGoogle();
      if (provider === 'discord') await signInWithDiscord();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-10 relative overflow-hidden rounded-2xl glow-border"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Sign in to access all features' : 'Join to contact me and leave reviews'}
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mb-8 text-sm text-amber-500/90 leading-relaxed">
          <strong>Privacy Notice:</strong> We do not collect your personal data. Signing up is only to prevent botting and to identify you.
        </div>

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="relative">
              <User size={18} className="absolute top-1/2 -translate-y-1/2 left-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary border border-border/50 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="relative">
            <Mail size={18} className="absolute top-1/2 -translate-y-1/2 left-4 text-muted-foreground" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute top-1/2 -translate-y-1/2 left-4 text-muted-foreground" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>

          <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg mt-2 transition-all hover:scale-[1.02] flex items-center justify-center glow" disabled={loading}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="flex items-center my-8 text-muted-foreground">
          <div className="flex-1 h-px bg-border/50"></div>
          <span className="px-4 text-xs font-medium tracking-wider">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-border/50"></div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleOAuth('discord')}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-[#5865F2]/20"
          >
            <Discord size={20} /> Discord
          </button>
          
          <button 
            onClick={() => handleOAuth('google')}
            className="bg-white hover:bg-gray-50 text-black font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <Globe size={20} className="text-blue-500" /> Google
          </button>
        </div>

        <div className="text-center mt-8 text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
