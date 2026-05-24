import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Bot, Globe, Server, Gamepad2, Sparkles } from "lucide-react";

const SERVICES = [
  { icon: Bot, label: "Discord Bots", desc: "Custom automation & moderation bots" },
  { icon: Globe, label: "Website Making", desc: "Professional responsive websites" },
  { icon: Server, label: "Server Design", desc: "Complete Discord server setup" },
  { icon: Gamepad2, label: "Minecraft Mods", desc: "Mod installation & assistance" },
];

export default function WhatIDoPanel() {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
      {/* Toggle tab */}
      <button
        onClick={() => setOpen(!open)}
        className="glass-strong border border-border/50 rounded-l-xl px-2 py-6 flex flex-col items-center gap-1 hover:border-primary/40 transition-all group"
        aria-label={open ? "Collapse panel" : "Expand panel"}
      >
        <Sparkles className="w-3.5 h-3.5 text-primary mb-1" />
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors [writing-mode:vertical-rl] rotate-180 tracking-wider">
          WHAT I DO
        </span>
        <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground mt-1" />
        </motion.div>
      </button>

      {/* Panel content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-strong border border-border/50 border-l-0 rounded-none p-4 w-52">
              <p className="text-xs font-bold text-primary mb-3 uppercase tracking-widest">What I Do</p>
              <div className="flex flex-col gap-2.5">
                {SERVICES.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-2.5 group">
                    <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/25 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-tight">{label}</p>
                      <p className="text-xs text-muted-foreground leading-tight mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="text-xs text-primary font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  All free for now!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
