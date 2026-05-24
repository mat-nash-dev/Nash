import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import PageWrapper from "@/components/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Bot, Globe, Server, Gamepad2, Code2, Zap, Sparkles } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  bot: Bot, globe: Globe, server: Server, gamepad: Gamepad2, code: Code2, zap: Zap,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Projects() {
  const { data: projects = [], isLoading } = trpc.projects.list.useQuery();

  return (
    <PageWrapper>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 20%, oklch(0.65 0.22 290 / 0.06) 0%, transparent 70%)" }}
      />

      <div className="container py-20 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            My Services
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            What I <span className="text-gradient">Build</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore the services I offer. Every project is handled with care, creativity, and zero cost to you.
          </p>
        </motion.div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass rounded-xl p-8 h-64 shimmer" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {projects.map((project: any) => {
              const Icon = ICON_MAP[project.icon] ?? Code2;
              const tags: string[] = (() => {
                try { return JSON.parse(project.tags ?? "[]"); } catch { return []; }
              })();

              return (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="group relative glass glow-border rounded-xl p-8 flex flex-col gap-5 overflow-hidden"
                >
                  {/* Background glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.65 0.22 290 / 0.08) 0%, transparent 70%)" }}
                  />

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors pulse-glow">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>

                  <div className="flex items-center gap-2 text-sm text-primary font-medium mt-auto">
                    <Sparkles className="w-4 h-4" />
                    Free — Contact me to get started
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass glow-border rounded-2xl p-8 max-w-xl mx-auto">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Don't see what you need?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              I'm flexible and open to new challenges. Reach out and let's discuss your project.
            </p>
            <a href="/contact">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors">
                Get In Touch
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
