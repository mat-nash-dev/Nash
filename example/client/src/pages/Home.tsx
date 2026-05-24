import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import PageWrapper from "@/components/PageWrapper";
import {
  ArrowRight,
  Bot,
  Globe,
  Server,
  Gamepad2,
  Star,
  Users,
  ChevronDown,
  Sparkles,
  Code2,
  Zap,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  bot: Bot,
  globe: Globe,
  server: Server,
  gamepad: Gamepad2,
  code: Code2,
  zap: Zap,
};

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; hue: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() * 60 + 260, // purple range
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 70%, 65%, ${(1 - d / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

function ServiceCard({ project }: { project: any }) {
  const Icon = ICON_MAP[project.icon] ?? Code2;
  const tags: string[] = (() => {
    try { return JSON.parse(project.tags ?? "[]"); } catch { return []; }
  })();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative glass glow-border rounded-xl p-6 flex flex-col gap-4 overflow-hidden"
    >
      {/* Shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer pointer-events-none" />

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">{project.title}</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag: string) => (
          <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
            {tag}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { data: projects = [] } = trpc.projects.list.useQuery();
  const { data: reviewsData = [] } = trpc.reviews.list.useQuery();

  const avgRating = reviewsData.length
    ? (reviewsData.reduce((s: number, r: any) => s + r.rating, 0) / reviewsData.length).toFixed(1)
    : null;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {    initial: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <ParticleBackground />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.65 0.22 290 / 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="container relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Open for Work — No Charge for Now
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black mb-6 leading-none">
              Hi, I'm{" "}
              <span className="text-gradient glow-text">Nash</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground mb-4 font-light">
              Discord Developer · Web Designer · Community Builder
            </motion.p>

            <motion.p variants={itemVariants} className="text-base text-muted-foreground/80 mb-10 max-w-xl leading-relaxed">
              I build custom Discord bots, design stunning servers, create professional websites,
              and help with Minecraft mods. All services are{" "}
              <span className="text-primary font-semibold">completely free</span> for now — reach out and let's build something great.
            </motion.p>

            {/* Stats */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{avgRating ?? "New"}</div>
                  <div className="text-muted-foreground text-xs">{reviewsData.length} reviews</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Free</div>
                  <div className="text-muted-foreground text-xs">All services</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Fast</div>
                  <div className="text-muted-foreground text-xs">Quick delivery</div>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <Link href="/projects">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow group">
                  View My Work
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/50 hover:bg-primary/5">
                  Get In Touch
                </Button>
              </Link>
              <Link href="/join">
                <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Join Discord
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
        </motion.div>
      </section>

      {/* Services Preview */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.65 0.22 290 / 0.04) 0%, transparent 70%)",
          }}
        />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Services</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What I <span className="text-gradient">Do</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From Discord ecosystems to full web applications — I craft digital experiences that stand out.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {projects.map((project: any) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ServiceCard project={project} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link href="/projects">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                See All Projects <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Reviews teaser */}
      {reviewsData.length > 0 && (
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass glow-border rounded-2xl p-8 text-center"
            >
              <div className="flex justify-center gap-1 mb-3">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= Math.round(Number(avgRating ?? 0)) ? "star-filled fill-current" : "star-empty"}`} />
                ))}
              </div>
              <p className="text-2xl font-bold mb-1">{avgRating} / 5</p>
              <p className="text-muted-foreground text-sm mb-4">Based on {reviewsData.length} server reviews</p>
              <Link href="/reviews">
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                  Read Reviews <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Free services notice */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative animated-border rounded-2xl p-px overflow-hidden"
          >
            <div className="bg-card rounded-2xl p-8 md:p-12 text-center">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                I Don't Charge <span className="text-gradient">Anything</span> For Now
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                All my services — Discord bots, website design, server setup, and Minecraft mod assistance — are
                completely free. Just reach out and we'll get started.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start a Project — It's Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
