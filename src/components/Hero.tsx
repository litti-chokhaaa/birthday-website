import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, ChevronDown, Sun } from 'lucide-react';
import { THEME } from '../config/theme';

export const Hero: React.FC = () => {
  const scrollToNext = () => {
    const el = document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-20 pb-12 text-center overflow-hidden">
      {/* Soft glowing background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Floating sunflower badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold mb-6 shadow-sm"
      >
        <Sun className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '10s' }} />
        <span>Today is All About You ✨</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-[#3d3228] tracking-tight mb-6 max-w-4xl leading-[1.1]"
      >
        {THEME.messages.heroHeading}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-base sm:text-lg md:text-xl text-[#736354] max-w-2xl mx-auto leading-relaxed font-normal mb-10"
      >
        {THEME.messages.heroSubtitle}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4 z-10"
      >
        <button
          onClick={scrollToNext}
          className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white font-semibold text-sm shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <span>Explore Memories</span>
          <Heart className="w-4 h-4 fill-current text-white/90" />
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('cake');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-7 py-3.5 rounded-full glass-card text-[#4a3d31] font-semibold text-sm border border-amber-200/80 hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Blow Candle</span>
        </button>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        onClick={scrollToNext}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer text-[#8c7b6c] hover:text-[#3d3228] transition-colors"
      >
        <span className="text-[11px] font-medium tracking-widest uppercase">Scroll Down</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
};
