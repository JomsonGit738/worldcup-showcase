import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { getCardTheme, getDomain } from '../lib/utils';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const theme = getCardTheme(project.telegramUsername);

  const handleRedirectClick = () => {
    window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl border p-4 md:p-5 h-full flex flex-col justify-between transition-[transform,border-color] duration-150 ease-out hover:scale-[1.01] border-[color:var(--card-border)] hover:border-[color:var(--card-border-hover)]"
      style={{
        background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
        ['--card-border' as string]: `${theme.border}80`,
        ['--card-border-hover' as string]: `${theme.border}cc`,
      } as React.CSSProperties}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 pointer-events-none z-0 bg-gradient-to-br ${theme.gradient}`}
      />

      <div
        className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0"
        style={{
          backgroundImage: theme.pattern,
          backgroundSize: theme.patternSize,
          color: theme.accent,
          opacity: 0.06,
        }}
      />

      {/* Decorative avatar */}
      <button
        type="button"
        onClick={handleRedirectClick}
        aria-label="Open website"
        title="Open website"
        className="absolute top-4 right-4 z-20 pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
        style={{
          backgroundColor: `${theme.accent}26`,
          border: `1px solid ${theme.accent}66`,
          color: theme.accent,
        }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 3h7v7" />
          <path d="M10 14L21 3" />
          <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-1 truncate max-w-[80%]">@{project.telegramUsername}</h3>
        <p className="text-sm font-medium mb-1 truncate" style={{ color: theme.accent }}>{project.telegramId}</p>
        <p className="text-xs font-mono font-medium mb-2 text-white truncate max-w-full">{getDomain(project.websiteUrl)}</p>
      </div>
      
    </motion.div>
  );
};
