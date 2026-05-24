import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, MessageSquare, Clock, Zap, Shield } from "lucide-react";

const schema = z.object({
  senderName: z.string().min(2, "Name must be at least 2 characters"),
  senderEmail: z.string().email("Please enter a valid email"),
  subject: z.string().optional(),
  body: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { user, isAuthenticated } = useAuth();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      senderName: user?.name ?? "",
      senderEmail: user?.email ?? "",
    },
  });

  const sendMutation = trpc.messages.send.useMutation({
    onSuccess: () => {
      setSent(true);
      reset();
      toast.success("Message sent! Nash will get back to you soon.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send message. Please try again.");
    },
  });

  const onSubmit = (data: FormData) => {
    sendMutation.mutate(data);
  };

  return (
    <PageWrapper>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 20%, oklch(0.65 0.22 290 / 0.06) 0%, transparent 70%)" }}
      />

      <div className="container py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            Get In Touch
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Contact <span className="text-gradient">Me</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have a project in mind? Want to collaborate? Just want to say hi? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {[
              { icon: Zap, title: "Fast Response", desc: "I typically respond within 24 hours." },
              { icon: Clock, title: "Always Available", desc: "Feel free to reach out any time." },
              { icon: Shield, title: "Privacy First", desc: "Your message is only seen by Nash." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass glow-border rounded-xl p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}

            <div className="glass glow-border rounded-xl p-5">
              <MessageSquare className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">
                You can also reach me directly on Discord. Join my server for the fastest response.
              </p>
              <a href="/join" className="text-primary text-sm font-medium mt-2 inline-block hover:underline">
                Join Discord Server →
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div className="glass glow-border rounded-2xl p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
                >
                  <Send className="w-7 h-7 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">Nash will get back to you as soon as possible.</p>
                <Button onClick={() => setSent(false)} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="glass glow-border rounded-2xl p-8 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-input/50 border-border/60 focus:border-primary/60"
                      {...register("senderName")}
                    />
                    {errors.senderName && <p className="text-destructive text-xs">{errors.senderName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="bg-input/50 border-border/60 focus:border-primary/60"
                      {...register("senderEmail")}
                    />
                    {errors.senderEmail && <p className="text-destructive text-xs">{errors.senderEmail.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    className="bg-input/50 border-border/60 focus:border-primary/60"
                    {...register("subject")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project or what you need help with..."
                    rows={6}
                    className="bg-input/50 border-border/60 focus:border-primary/60 resize-none"
                    {...register("body")}
                  />
                  {errors.body && <p className="text-destructive text-xs">{errors.body.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={sendMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                  size="lg"
                >
                  {sendMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
