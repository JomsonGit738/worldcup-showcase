import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { getCardTheme, getDomain } from '../lib/utils';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const theme = getCardTheme(project.projectName);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = () => {
    window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  // Simple decorative shape renderer
  const renderDecorShape = () => {
    const size = 24;
    const color = theme.accent;
    switch (theme.decorShape) {
      case 'circle':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" className={color} stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2 L22 22 H2 Z" className={color} stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'square':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" className={color} stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'diamond':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2 L22 12 L12 22 L2 12 Z" className={color} stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7 L12 2 L20 7 L20 17 L12 22 L4 17 Z" className={color} stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'wave':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12 Q8 4 14 12 T22 12" className={color} stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'cross':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4 L20 20 M20 4 L4 20" className={color} stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'dots':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="12" r="2" className={color} fill="currentColor" />
            <circle cx="12" cy="12" r="2" className={color} fill="currentColor" />
            <circle cx="16" cy="12" r="2" className={color} fill="currentColor" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative cursor-pointer overflow-hidden rounded-lg border p-4" // border color will be overridden
      style={{ borderColor: theme.border }}
      onClick={handleCardClick}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: theme.gradient, backgroundBlendMode: 'multiply' }}
      />

      {/* Decorative shape */}
      <div className="absolute right-2 top-2 text-xl opacity-30">
        {renderDecorShape()}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col space-y-2">
        <h3 className="text-lg font-bold text-white">{project.projectName}</h3>
        <p className={`text-sm ${theme.accent}`}>@{project.telegramUsername}</p>
        <p className="text-xs font-mono text-gray-300">{getDomain(project.websiteUrl)}</p>
        {project.description && (
          <p className="text-sm text-gray-300 line-clamp-2" title={project.description}>
            {project.description}
          </p>
        )}
        <button
          onClick={handleButtonClick}
          className="mt-2 w-full border-2 py-1 text-sm font-medium transition-colors"
          style={{ borderColor: theme.accent, color: theme.accent }}
        >
          Visit Website →
        </button>
      </div>
    </motion.div>
  );
};
