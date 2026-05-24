import { motion } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, LogIn } from "lucide-react";

export default function Auth() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const handleLogin = () => {
    window.location.href = getLoginUrl("/");
  };

  return (
    <PageWrapper>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, oklch(0.65 0.22 290 / 0.08) 0%, transparent 70%)" }}
      />

      <div className="container py-20 relative flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass glow-border rounded-2xl p-8 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src="https://github.com/NashCodes77/Regis/blob/main/images/matnashplays.png?raw=true"
                  alt="Nash"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/40"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            </div>

            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Lock className="w-3 h-3 mr-1.5" />
              Secure Sign In
            </Badge>

            <h1 className="text-2xl font-bold mb-2">Welcome to Nash's Portfolio</h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Sign in to leave reviews, send messages, and interact with the community.
            </p>

            {/* Privacy notice */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Privacy Notice</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We do <strong className="text-foreground">not</strong> collect your personal data beyond what is needed for identity.
                    Signing up is only to prevent botting and to identify you as a real person.
                    Your data is never sold or shared.
                  </p>
                </div>
              </div>
            </div>

            {/* Sign in button */}
            <Button
              onClick={handleLogin}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mb-4"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In / Sign Up
            </Button>

            <p className="text-muted-foreground text-xs">
              Supports Discord, Google, and Email sign-in.
            </p>

            {/* Auth options icons */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded bg-[#5865F2]/20 flex items-center justify-center">
                  <svg className="w-3 h-3" viewBox="0 0 71 55" fill="none">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978Z" fill="#5865F2"/>
                  </svg>
                </div>
                Discord
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                Google
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">@</span>
                </div>
                Email
              </div>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-xs mt-4">
            By signing in, you agree to our{" "}
            <a href="/legal" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
