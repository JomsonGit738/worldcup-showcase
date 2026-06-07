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

  const renderSkeleton = (key: number) => (
    <div
      key={key}
      className="relative overflow-hidden rounded-lg border p-4 animate-pulse bg-gray-800"
    />
  );

  return (
    <section id="showcase" className="p-6">
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(6)].map((_, i) => renderSkeleton(i))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
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
        <div className="flex items-center justify-center py-12 text-gray-400">
          No projects yet. Be the first to showcase!
        </div>
      )}

      {!isLoading && !error && shuffled.length > 0 && (
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
