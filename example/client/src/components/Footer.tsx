import { Link } from "wouter";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-24">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://github.com/NashCodes77/Regis/blob/main/images/matnashplays.png?raw=true"
              alt="Nash"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/40"
            />
            <span className="text-sm text-muted-foreground">
              Made and Developed by{" "}
              <span className="text-gradient font-semibold">Nash</span> ©{" "}
              {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/legal">
              <motion.span
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                whileHover={{ y: -1 }}
              >
                Legal &amp; Privacy
                <ExternalLink className="w-3 h-3" />
              </motion.span>
            </Link>
            <Link href="/contact">
              <motion.span
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ y: -1 }}
              >
                Contact
              </motion.span>
            </Link>
            <Link href="/join">
              <motion.span
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ y: -1 }}
              >
                Discord
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
