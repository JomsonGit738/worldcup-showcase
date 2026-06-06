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
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-green-900 via-green-800 to-gray-900 text-white">
      <motion.div
        className="max-w-2xl px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div className="mb-2 inline-block rounded-full border border-white/30 px-3 py-0.5 text-xs" variants={itemVariants}>
          Community · 2025
        </motion.div>

        {/* Title */}
        <motion.h1 className="mb-4 text-4xl font-bold md:text-5xl" variants={itemVariants}>
          World Cup Community Showcase
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="mb-6 text-lg text-gray-300 md:text-xl" variants={itemVariants}>
          Discover websites built by creators from our community.
        </motion.p>

        {/* Fairness Pill */}
        <motion.div className="mx-auto mb-8 inline-block rounded-full bg-white/10 px-4 py-1 text-xs text-gray-300" variants={itemVariants}>
          No rankings. No favorites. Every project gets equal visibility.
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="grid grid-cols-1 gap-4 md:grid-cols-2" variants={itemVariants}>
          <button
            onClick={scrollToShowcase}
            className="rounded bg-yellow-500 px-6 py-2 font-medium text-gray-900 transition-colors hover:bg-yellow-400"
          >
            Explore Projects
          </button>
          <button
            onClick={onSubmitClick}
            className="rounded bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-500"
          >
            Showcase Your Website
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
