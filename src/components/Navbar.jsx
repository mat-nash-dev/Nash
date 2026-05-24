import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FolderOpen, Mail, Briefcase, Users, Shield, LogOut, LogIn, Menu, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/work", label: "Work", icon: Briefcase },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/contact", label: "Contact Me", icon: Mail },
  { href: "/join-server", label: "Join My Server", icon: Users },
];

export default function Navbar() {
  const { user, profile, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50"
      >
        <div className="container flex items-center justify-between h-16">
          <Link to="/">
            <motion.div
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <img
                  src="https://github.com/NashCodes77/Regis/blob/main/images/matnashplays.png?raw=true"
                  alt="Nash"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/60 group-hover:ring-primary transition-all duration-300"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <span className="text-xl font-bold text-gradient tracking-tight">Nash</span>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = location.pathname === href;
              return (
                <Link key={href} to={href}>
                  <motion.div
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/40 text-primary hover:bg-primary/10 text-sm font-medium transition-colors">
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-2">
                  <img src={profile?.avatar_url || "https://via.placeholder.com/32"} alt="avatar" className="w-7 h-7 rounded-full" />
                  <span className="text-sm font-medium max-w-[100px] truncate">{profile?.username || "User"}</span>
                </div>
                <button onClick={logout} className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Sign In
              </Link>
            )}

            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong border-b border-border/50 md:hidden"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = location.pathname === href;
                return (
                  <Link key={href} to={href} onClick={() => setMobileOpen(false)}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}>
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                  </Link>
                );
              })}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all">
                    <Shield className="w-4 h-4" /> Admin Dashboard
                  </div>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
