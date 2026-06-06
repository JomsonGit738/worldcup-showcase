import React from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
  onSubmitClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSubmitClick }) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-[#0a0f1a]/80 backdrop-blur-md border-b border-[#1e2d45] flex items-center justify-between px-4"
    >
      <span className="text-white font-bold">⚽ WC Showcase</span>
      <button
        onClick={onSubmitClick}
        className="bg-[#f5c518] hover:bg-[#e0b015] text-[#0a0f1a] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Showcase Your Website
      </button>
    </motion.nav>
  );
};
