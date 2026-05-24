import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react";

const sections = [
  {
    icon: UserCheck,
    title: "Why We Require Sign-In",
    content: `Signing up and logging in to Nash's portfolio is required only for certain features such as leaving server reviews and sending direct messages. Authentication is used exclusively to:
    
• Prevent automated spam and bot submissions
• Identify you as a unique user for review attribution
• Provide a personalized experience

We do not require sign-in to browse the portfolio, view projects, or read public reviews.`,
  },
  {
    icon: Database,
    title: "What Data We Collect",
    content: `When you sign in using Discord OAuth, we collect the following information provided by Discord:

• Discord Username and Display Name
• Discord User ID (unique identifier)
• Discord Avatar (profile picture URL)
• Email address (if provided by Discord)

When you sign in using Google OAuth, we collect:
• Your Google display name
• Your Google email address

When you sign in using Email, we collect only your email address.

We also collect standard technical data such as IP addresses (for security and spam prevention) and browser user-agent strings.`,
  },
  {
    icon: Lock,
    title: "How We Use Your Data",
    content: `Your data is used solely to:

• Authenticate your identity on this website
• Display your name and avatar on reviews you submit
• Allow Nash to respond to messages you send
• Prevent duplicate reviews and spam

We do not sell, share, or transfer your personal data to any third parties. Your data is stored securely in an encrypted database and is never used for advertising or marketing purposes.`,
  },
  {
    icon: Eye,
    title: "Data Visibility",
    content: `• Your reviews are displayed publicly with your display name and avatar
• Your contact messages are visible only to Nash (the site owner)
• Your email address is never displayed publicly
• Your IP address is only accessible to Nash in the admin dashboard for security purposes

You may request deletion of your data at any time by contacting Nash through the contact page.`,
  },
  {
    icon: Shield,
    title: "Data Security",
    content: `We take reasonable measures to protect your personal information:

• All data is stored in an encrypted database
• Authentication uses industry-standard OAuth 2.0 protocols
• Session tokens are signed with secure cryptographic keys
• HTTPS is enforced for all connections

However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`,
  },
  {
    icon: AlertCircle,
    title: "Third-Party Services",
    content: `This website uses the following third-party services:

• Discord OAuth 2.0 — for Discord login (subject to Discord's Privacy Policy)
• Google OAuth 2.0 — for Google login (subject to Google's Privacy Policy)
• Manus Platform — for hosting and authentication infrastructure

By using this site, you also agree to the terms of these third-party services where applicable.`,
  },
];

export default function Legal() {
  return (
    <PageWrapper>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 20%, oklch(0.65 0.22 290 / 0.05) 0%, transparent 70%)" }}
      />

      <div className="container py-20 relative max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            <Shield className="w-3.5 h-3.5 mr-1.5" />
            Legal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Privacy &amp; <span className="text-gradient">Legal</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Transparency about how this site works and how your data is handled.
          </p>
          <p className="text-muted-foreground text-sm mt-3">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>

        {/* Notice banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass glow-border rounded-xl p-6 mb-10 flex gap-4 items-start"
        >
          <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-1">We Do Not Collect Your Data Beyond Identity</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Signing up is only to prevent botting and to identify you as a real person. We do not sell your data,
              use it for advertising, or share it with third parties. Your privacy is respected.
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="flex flex-col gap-6">
          {sections.map(({ icon: Icon, title, content }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="glass glow-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <h2 className="text-lg font-bold">{title}</h2>
              </div>
              <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Questions about this policy?{" "}
            <a href="/contact" className="text-primary hover:underline">Contact Nash</a>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
