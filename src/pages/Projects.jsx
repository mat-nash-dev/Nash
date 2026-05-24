import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code, Folder } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabase';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container">
      <AnimatedSection>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">My <span className="text-gradient">Projects</span></h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Here are some of the things I've built. I'm always working on something new!
        </p>
      </AnimatedSection>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-accent border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass p-12 text-center text-muted-foreground rounded-xl">
          <Folder size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No projects found</h3>
          <p>Projects will appear here once added from the admin dashboard.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              variants={item}
              whileHover={{ y: -5 }}
              className="glass rounded-xl overflow-hidden flex flex-col group transition-all hover:glass-strong hover:glow-border"
            >
              {project.image_url ? (
                <div className="h-48 overflow-hidden">
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-48 bg-accent/20 flex items-center justify-center">
                  <Folder size={48} className="text-muted-foreground/50" />
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1">
                  {project.description}
                </p>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-4 mt-auto">
                  {project.source_url && (
                    <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors text-sm font-medium">
                      <Code size={16} /> Source
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary flex items-center gap-1 ml-auto transition-colors text-sm font-medium">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Projects;
