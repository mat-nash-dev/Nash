import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, RotateCcw } from 'lucide-react';

const THEMES = [
  {
    id: 'default',
    name: 'Glitch Orchid',
    colors: {
      background: 'oklch(0.09 0.015 265)',
      foreground: 'oklch(0.96 0.005 265)',
      primary: 'oklch(0.65 0.22 290)',
      accent: 'oklch(0.18 0.03 265)',
      muted: 'oklch(0.15 0.02 265)',
      mutedForeground: 'oklch(0.55 0.015 265)',
      border: 'oklch(0.22 0.025 265)',
    },
    preview: ['#12131a', '#a855f7']
  },
  {
    id: 'deep-navy-mint',
    name: 'Abyssal Oasis',
    colors: {
      background: 'oklch(0.12 0.03 240)',
      foreground: 'oklch(0.95 0.02 160)',
      primary: 'oklch(0.78 0.18 160)',
      accent: 'oklch(0.18 0.04 240)',
      muted: 'oklch(0.16 0.03 240)',
      mutedForeground: 'oklch(0.65 0.08 190)',
      border: 'oklch(0.24 0.04 240)',
    },
    preview: ['#0f172a', '#10b981']
  },
  {
    id: 'charcoal-yellow',
    name: 'Cyberpunk Grid',
    colors: {
      background: 'oklch(0.14 0.01 240)',
      foreground: 'oklch(0.98 0.01 90)',
      primary: 'oklch(0.85 0.2 90)',
      accent: 'oklch(0.2 0.02 240)',
      muted: 'oklch(0.18 0.01 240)',
      mutedForeground: 'oklch(0.6 0.05 90)',
      border: 'oklch(0.26 0.02 240)',
    },
    preview: ['#1e293b', '#eab308']
  },
  {
    id: 'sage-cream',
    name: 'Whispering Willow',
    colors: {
      background: 'oklch(0.16 0.04 140)',
      foreground: 'oklch(0.96 0.03 80)',
      primary: 'oklch(0.88 0.08 80)',
      accent: 'oklch(0.2 0.04 140)',
      muted: 'oklch(0.18 0.04 140)',
      mutedForeground: 'oklch(0.65 0.05 110)',
      border: 'oklch(0.26 0.04 140)',
    },
    preview: ['#14251c', '#fef3c7']
  },
  {
    id: 'blue-pink',
    name: 'Synthwave Dream',
    colors: {
      background: 'oklch(0.12 0.05 260)',
      foreground: 'oklch(0.96 0.03 340)',
      primary: 'oklch(0.82 0.14 340)',
      accent: 'oklch(0.18 0.06 260)',
      muted: 'oklch(0.16 0.05 260)',
      mutedForeground: 'oklch(0.65 0.1 300)',
      border: 'oklch(0.24 0.06 260)',
    },
    preview: ['#1d4ed8', '#f472b6']
  },
  {
    id: 'terracotta-sand',
    name: 'Earthen Hearth',
    colors: {
      background: 'oklch(0.14 0.03 35)',
      foreground: 'oklch(0.96 0.03 70)',
      primary: 'oklch(0.82 0.08 70)',
      accent: 'oklch(0.2 0.04 35)',
      muted: 'oklch(0.18 0.03 35)',
      mutedForeground: 'oklch(0.65 0.06 50)',
      border: 'oklch(0.26 0.03 35)',
    },
    preview: ['#451a03', '#fef3c7']
  },
  {
    id: 'burgundy-charcoal',
    name: 'Crimson Eclipse',
    colors: {
      background: 'oklch(0.11 0.03 15)',
      foreground: 'oklch(0.96 0.01 15)',
      primary: 'oklch(0.5 0.18 15)',
      accent: 'oklch(0.16 0.02 15)',
      muted: 'oklch(0.14 0.02 15)',
      mutedForeground: 'oklch(0.6 0.04 15)',
      border: 'oklch(0.22 0.03 15)',
    },
    preview: ['#3b0712', '#334155']
  },
  {
    id: 'vermilion-white',
    name: 'Tokyo Neon',
    colors: {
      background: 'oklch(0.12 0.01 40)',
      foreground: 'oklch(0.98 0.01 40)',
      primary: 'oklch(0.62 0.22 40)',
      accent: 'oklch(0.18 0.02 40)',
      muted: 'oklch(0.16 0.02 40)',
      mutedForeground: 'oklch(0.65 0.05 40)',
      border: 'oklch(0.24 0.02 40)',
    },
    preview: ['#ea580c', '#f8fafc']
  }
];

const ThemeChooser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('default');
  const [isVisible, setIsVisible] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-custom-theme') || 'default';
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId) => {
    const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, val]) => {
      // Convert camelCase to css-variable format (--camel-case)
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, val);
    });

    setActiveTheme(themeId);
    localStorage.setItem('portfolio-custom-theme', themeId);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      {/* Draggable container using framer-motion */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        className="pointer-events-auto cursor-grab active:cursor-grabbing"
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Floating circular button */
            <motion.button
              key="theme-btn"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full glass border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_20px_var(--primary)/30] hover:border-primary/80 transition-colors relative group"
            >
              <Palette size={24} className="group-hover:rotate-12 transition-transform" />
              {/* Tooltip */}
              <span className="absolute -top-10 right-0 bg-background/95 border border-border text-[10px] uppercase tracking-wider font-semibold py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                Themes
              </span>
            </motion.button>
          ) : (
            /* Expanded Color Chooser Panel */
            <motion.div
              key="theme-panel"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="glass p-5 rounded-2xl border border-border/40 w-72 shadow-2xl flex flex-col gap-4 relative"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-primary" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">Theme Swapper</span>
                </div>
                <div className="flex gap-2">
                  {/* Reset Button */}
                  <button
                    onClick={() => applyTheme('default')}
                    className="text-muted-foreground hover:text-white transition-colors"
                    title="Reset to default"
                  >
                    <RotateCcw size={14} />
                  </button>
                  {/* Close Swapper Button */}
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-muted-foreground hover:text-red-400 transition-colors"
                    title="Dismiss swapper widget"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Theme Options */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => applyTheme(theme.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-300 ${
                      activeTheme === theme.id
                        ? 'bg-primary/10 border-primary text-primary font-bold shadow-[0_0_12px_var(--primary)/10]'
                        : 'border-border/30 hover:border-border hover:bg-white/5 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-xs font-mono tracking-wide">{theme.name}</span>
                    {/* Color Swatch Previews */}
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.preview[0] }}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.preview[1] }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Return to circle trigger button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-1.5 rounded-lg border border-border/30 hover:border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all hover:bg-white/5"
              >
                Minimize Menu
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ThemeChooser;
