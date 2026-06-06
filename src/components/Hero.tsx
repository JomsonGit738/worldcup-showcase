import React from "react";
import { motion } from "framer-motion";

interface HeroProps {
  onSubmitClick: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Hero: React.FC<HeroProps> = ({ onSubmitClick }) => {
  const scrollToShowcase = () => {
    const el = document.getElementById("showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center pt-[64px] bg-gradient-to-b from-[#0a0f1a] via-[#0d1f12] to-[#0a0f1a]">
      <motion.div
        className="max-w-2xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div className="mb-6 inline-block rounded-full border border-[#1e2d45] bg-[#111827] px-3 py-1 text-xs text-[#94a3b8]" variants={itemVariants}>
          Community · 2025
        </motion.div>

        {/* Title */}
        <motion.h1 className="mb-4 text-5xl font-bold text-white leading-tight md:text-6xl" variants={itemVariants}>
          World Cup Community Showcase
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="mb-4 text-lg text-slate-400" variants={itemVariants}>
          Discover websites built by creators from our community.
        </motion.p>

        {/* Fairness Pill */}
        <motion.div className="mb-10 inline-block rounded-full border border-slate-800 px-4 py-2 text-xs text-slate-500" variants={itemVariants}>
          No rankings. No favorites. Every project gets equal visibility.
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="flex flex-wrap justify-center gap-4" variants={itemVariants}>
          <button
            onClick={scrollToShowcase}
            className="rounded-xl bg-[#f5c518] px-6 py-3 font-semibold text-[#0a0f1a] transition-colors hover:bg-[#e0b015]"
          >
            Explore Projects
          </button>
          <button
            onClick={onSubmitClick}
            className="rounded-xl border border-[#f5c518] bg-transparent px-6 py-3 text-[#f5c518] transition-colors hover:bg-[#f5c518]/20"
          >
            Showcase Your Website
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
