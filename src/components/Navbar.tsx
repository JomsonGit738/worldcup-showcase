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
      className="fixed top-0 inset-x-0 bg-black/50 backdrop-blur-md flex items-center justify-between px-4 py-2 z-50"
    >
      <span className="text-white font-bold text-lg">⚽ WC Showcase</span>
      <button
        onClick={onSubmitClick}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded px-3 py-1.5 text-sm transition-colors"
      >
        <span className="hidden sm:inline">Showcase Your Website</span>
        <span className="inline sm:hidden">Showcase +</span>
      </button>
    </motion.nav>
  );
};
