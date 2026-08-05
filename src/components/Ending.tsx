import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, Sun, PartyPopper, Crown, Moon } from 'lucide-react';
import { THEME } from '../config/theme';
import { audioManager } from '../utils/audio';
import { SkyLanternOverlay } from './SkyLanternOverlay';

interface EndingProps {
  onReplay: () => void;
}

export const Ending: React.FC<EndingProps> = ({ onReplay }) => {
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [celebrationCount, setCelebrationCount] = useState<number>(0);
  const [showSkyLanterns, setShowSkyLanterns] = useState<boolean>(false);

  const triggerFireworks = () => {
    // Multi-shot grand fireworks celebration
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Left side burst
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#fbbf24', '#f59e0b', '#ec4899', '#3b82f6'],
      origin: { x: 0.1, y: 0.6 },
    });

    // Right side burst
    fire(0.2, {
      spread: 60,
      colors: ['#f43f5e', '#a855f7', '#10b981', '#fbbf24'],
      origin: { x: 0.9, y: 0.6 },
    });

    // Center grand explosion
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 1.2,
      colors: ['#ffd700', '#ff69b4', '#ff4500', '#00e5ff'],
      origin: { x: 0.5, y: 0.5 },
    });

    // Stars & Streamers
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.5,
      shapes: ['star'],
      colors: ['#FFE15D', '#FFF', '#FF9393'],
      origin: { x: 0.5, y: 0.4 },
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#fbbf24', '#f43f5e', '#8b5cf6'],
      origin: { x: 0.5, y: 0.7 },
    });
  };

  const handleGrandCelebration = () => {
    setIsCelebrating(true);
    setCelebrationCount((prev) => prev + 1);
    try {
      audioManager.playPop();
    } catch {
      // Safe fallback if audio context is blocked
    }
    triggerFireworks();

    // Secondary wave after 600ms
    setTimeout(() => {
      triggerFireworks();
    }, 600);

    // Third wave after 1200ms
    setTimeout(() => {
      triggerFireworks();
      setIsCelebrating(false);
    }, 1800);
  };

  useEffect(() => {
    // Launch initial warm golden fireworks burst on page load
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#fde047', '#f43f5e'],
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto relative text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card p-10 md:p-16 rounded-3xl border-2 border-amber-300/80 shadow-2xl relative overflow-hidden"
      >
        {/* Floating background decorative icons */}
        <div className="absolute top-4 left-6 text-amber-300/40 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-6 right-8 text-rose-300/40 animate-pulse">
          <Heart className="w-8 h-8" />
        </div>

        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 shadow-inner relative">
          <Sun className="w-10 h-10 animate-spin" style={{ animationDuration: '15s' }} />
          <Crown className="w-6 h-6 absolute -top-2 -right-1 text-amber-500 transform rotate-12" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#3d3228] tracking-tight mb-4">
          {THEME.messages.endingHeading}
        </h2>

        <p className="text-base sm:text-lg text-[#6e6052] max-w-xl mx-auto leading-relaxed mb-8">
          {THEME.messages.endingMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSkyLanterns(true)}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-amber-200 border border-amber-300/40 font-bold text-base shadow-xl shadow-purple-900/30 hover:shadow-2xl transition-all inline-flex items-center gap-3 relative overflow-hidden group cursor-pointer"
          >
            <Moon className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Click To Release Lanterns 🌌🏮</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGrandCelebration}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-white font-bold text-base shadow-xl shadow-rose-200/60 hover:shadow-2xl hover:shadow-rose-300 transition-all inline-flex items-center gap-3 relative overflow-hidden group cursor-pointer"
          >
            <PartyPopper className={`w-5 h-5 ${isCelebrating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
            <span>Grand Celebration Fireworks! 🎉</span>
            {celebrationCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/30 text-xs font-semibold">
                x{celebrationCount}
              </span>
            )}
          </motion.button>

          <button
            onClick={onReplay}
            className="px-7 py-4 rounded-full bg-white/80 border border-amber-200 text-amber-900 font-semibold text-sm hover:bg-white hover:border-amber-400 shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Relive the Surprise</span>
          </button>
        </div>

        {/* 100 Sky Lanterns Night Sky Overlay */}
        <AnimatePresence>
          {showSkyLanterns && (
            <SkyLanternOverlay onClose={() => setShowSkyLanterns(false)} />
          )}
        </AnimatePresence>

        {/* Celebration Toast Notice */}
        <AnimatePresence>
          {celebrationCount > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-sm font-medium text-amber-700 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Wishing you the happiest birthday filled with sunshine and joy! 🌻✨</span>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Footer Credit */}
        <p className="mt-12 text-xs text-[#a09082] font-medium"> Made with endless love & sunflowers for {THEME.personName} ❤️ </p>
      </motion.div>
    </section>
  );
};