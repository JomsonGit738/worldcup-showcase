import React from "react";
import { motion } from "framer-motion";
import wcupBg from "../assets/wcup.webp";

interface HeroProps {}

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

// Custom subtle diagonal crosshatch pattern
const patternSvg = `
<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <line x1='0' y1='28' x2='28' y2='0' stroke='white' stroke-opacity='0.18' stroke-width='1'/>
  <line x1='-7' y1='28' x2='21' y2='0' stroke='white' stroke-opacity='0.18' stroke-width='1'/>
  <line x1='7' y1='28' x2='35' y2='0' stroke='white' stroke-opacity='0.18' stroke-width='1'/>
</svg>
`.trim();

const heroBg: React.CSSProperties = {
  backgroundColor: '#0b0b0c',
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`,
};

export const Hero: React.FC<HeroProps> = () => {

  return (
    <section
      className="relative flex py-8 md:py-12 items-center overflow-hidden"
      style={heroBg}
    >

      {/* Pattern right-side fade — dissolves SVG pattern before image begins */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent 25%, rgba(11,11,12,0.7) 45%, #0b0b0c 55%)'
        }}
      />

      {/* Right-side background image with left-edge blend */}
      <div
        className="hidden md:block absolute inset-y-0 right-0 w-1/2 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src={wcupBg}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/* gradient overlay: blends left edge into the hero bg color */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #0b0b0c 0%, rgba(11,11,12,0.85) 30%, rgba(11,11,12,0.4) 60%, transparent 100%)'
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full px-6 text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Title */}
        <motion.h1 className="mb-2 text-2xl md:text-4xl font-bold text-white leading-tight" variants={itemVariants}>
          CM Builders Showcase
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="mb-2 text-sm md:text-base text-slate-400" variants={itemVariants}>
          Discover websites built by creators from our community.
        </motion.p>

        {/* Fairness Pill */}
        <motion.p className="mb-2 text-xs uppercase tracking-widest text-slate-500 font-medium" variants={itemVariants}>
          Equal visibility for every project — no rankings, no bias.
        </motion.p>

        {/* Community attribution */}
        <motion.a
          href="https://t.me/crypto_monkeyy_channel"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-[#f5c518]/60 italic tracking-wide pl-0.5 hover:text-[#f5c518]/90 transition-colors"
          variants={itemVariants}
        >
          {/* Telegram icon */}
          <svg className="w-3.5 h-3.5 not-italic flex-shrink-0" viewBox="0 0 24 24" fill="#2AABEE" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          by Crypto Monkey Community
        </motion.a>

      </motion.div>
    </section>
  );
};
