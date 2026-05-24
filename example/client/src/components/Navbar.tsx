import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  FolderOpen,
  Mail,
  Star,
  Users,
  Shield,
  LogOut,
  LogIn,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/contact", label: "Contact Me", icon: Mail },
  { href: "/reviews", label: "Server Reviews", icon: Star },
  { href: "/join", label: "Join My Server", icon: Users },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* Top Navbar */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50"
      >
        <div className="container flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/">
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return (
                <Link key={href} href={href}>
                  <motion.div
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5 border-primary/40 text-primary hover:bg-primary/10">
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={(user as any)?.discordAvatar ?? undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {user?.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                      {user?.name ?? "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass-strong border-border/50">
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    Signed in as <span className="text-foreground font-medium">{user?.name}</span>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 text-primary">
                        <Shield className="w-3.5 h-3.5" /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Sign In
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
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
                const active = location === href;
                return (
                  <Link key={href} href={href}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                  </Link>
                );
              })}
              {isAdmin && (
                <Link href="/admin">
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
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
