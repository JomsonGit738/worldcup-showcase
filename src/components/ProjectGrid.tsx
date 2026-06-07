import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../types";
import { shuffleArray } from "../lib/utils";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, isLoading, error }) => {
  const [shuffled, setShuffled] = useState<Project[]>([]);

  useEffect(() => {
    if (!isLoading && !error) {
      setShuffled(shuffleArray(projects));
    }
  }, [projects, isLoading, error]);

  // Motion variants for staggered entrance
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="showcase" className="relative overflow-hidden p-6">
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 w-full"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="showcase-dots" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1.4" fill="rgba(255,255,255,0.18)" />
            <circle cx="36" cy="36" r="1" fill="rgba(255,255,255,0.12)" />
            <path d="M0 48L48 0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>
          <linearGradient id="showcase-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(11,11,12,0.92)" />
            <stop offset="55%" stopColor="rgba(11,11,12,0.5)" />
            <stop offset="100%" stopColor="rgba(11,11,12,0)" />
          </linearGradient>
        </defs>
        <rect width="1200" height="160" fill="url(#showcase-fade)" />
        <rect width="1200" height="160" fill="url(#showcase-dots)" />
        <path
          d="M0 36C110 10 240 10 360 36C480 62 600 62 720 36C840 10 970 10 1200 36"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.5"
        />
        <path
          d="M0 78C120 52 240 52 360 78C480 104 600 104 720 78C840 52 960 52 1200 78"
          fill="none"
          stroke="rgba(103,232,249,0.10)"
          strokeWidth="1.25"
        />
      </svg>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#1e2d45] border-t-[#f5c518] rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && shuffled.length === 0 && (
        <div className="relative z-10 flex items-center justify-center py-12 text-gray-400">
          No projects yet. Be the first to showcase!
        </div>
      )}

      {!isLoading && !error && shuffled.length > 0 && (
        <motion.div
          className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {shuffled.map((project) => (
              <motion.div key={project.id} variants={item}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};
