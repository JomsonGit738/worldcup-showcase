import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { getCardTheme, getDomain } from '../lib/utils';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const theme = getCardTheme(project.projectName);
  const [isHovered, setIsHovered] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = () => {
    window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer overflow-hidden rounded-2xl border p-4 md:p-5 h-full flex flex-col justify-between transition-all"
      style={{
        background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
        borderColor: isHovered ? `${theme.border}cc` : `${theme.border}80`,
      }}
      onClick={handleCardClick}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${theme.gradient}`}
      />

      {/* Decorative avatar */}
      <div
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
        style={{
          backgroundColor: `${theme.accent}26`,
          border: `1px solid ${theme.accent}66`,
          color: theme.accent,
        }}
      >
        {project.projectName.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{project.projectName}</h3>
        <p className="text-sm font-medium mb-1" style={{ color: theme.accent }}>@{project.telegramUsername}</p>
        <p className="text-xs font-mono text-slate-500 mb-2">{getDomain(project.websiteUrl)}</p>
        {project.description && (
          <p className="text-sm text-slate-400 line-clamp-1 md:line-clamp-2" title={project.description}>
            {project.description}
          </p>
        )}
      </div>
      
      <div className="relative z-10 mt-4">
        <button
          onClick={handleButtonClick}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.accent}1a`}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          className="w-full border py-2 text-sm font-medium rounded-lg transition-all duration-150"
          style={{ 
            borderColor: theme.border, 
            color: theme.accent,
            backgroundColor: 'transparent'
          }}
        >
          Visit Website →
        </button>
      </div>
    </motion.div>
  );
};
