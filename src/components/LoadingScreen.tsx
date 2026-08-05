import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { THEME } from '../config/theme';
import { audioManager } from '../utils/audio';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete, onComplete }) => {
  const [progress, setProgress] = useState<number>(0);

  const notifyComplete = () => {
    if (onLoadingComplete) onLoadingComplete();
    if (onComplete) onComplete();
  };

  useEffect(() => {
    // Start background music
    try {
      audioManager.setMusic(THEME.musicUrl);
      audioManager.playMusic();
    } catch {
      // ignore audio errors
    }

    // Paced, realistic loading progress (~3.5 seconds total)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const delta = Math.floor(Math.random() * 2) + 1;
        return Math.min(100, prev + delta);
      });
    }, 35);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Hold 1200ms at 100% so user can admire the fully bloomed golden sunflower head
      const timeout = setTimeout(() => {
        notifyComplete();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  const handleSkip = () => {
    try {
      audioManager.setMusic(THEME.musicUrl);
      audioManager.playMusic();
    } catch {
      // ignore
    }
    notifyComplete();
  };

  // Calculate bloom scale and fill level from progress (0 to 1)
  const fillFactor = progress / 100;
  const sunflowerScale = 0.5 + fillFactor * 0.5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#fefae0] via-[#fdeed9] via-[#fce4ec] to-[#f5ebdc] p-6 text-center select-none"
    >
      {/* Sunflower Head Container with Golden Bloom Fill */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 mb-8 flex items-center justify-center">
        {/* Soft Radial Backlight Glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl"
          style={{ transform: `scale(${sunflowerScale})` }}
        />

        {/* Rotating Sunflower Head with Fill & Bloom */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full drop-shadow-2xl relative z-10"
          style={{ transform: `scale(${sunflowerScale})` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              {/* Vertical Fill Gradient Mask for Sunflower Head */}
              <linearGradient id="sunflowerFillGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset={`${progress}%`} stopColor="#fbbf24" />
                <stop offset={`${progress}%`} stopColor="#e5e7eb" stopOpacity="0.4" />
              </linearGradient>

              {/* Glowing Seed Center Gradient */}
              <radialGradient id="centerDiskGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#291d0f" />
                <stop offset="70%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>
            </defs>

            {/* Sunflower Petals (28 Petals) */}
            {Array.from({ length: 28 }).map((_, i) => {
              const petalAngle = i * (360 / 28);
              // Petals fill dynamically as progress increases
              const isPetalActive = (i / 28) <= fillFactor;
              const petalFill = isPetalActive
                ? i % 2 === 0 ? '#fbbf24' : '#f59e0b'
                : 'rgba(217, 205, 190, 0.4)';

              return (
                <ellipse
                  key={i}
                  cx="50"
                  cy="16"
                  rx="4.5"
                  ry="18"
                  fill={petalFill}
                  stroke={isPetalActive ? '#d97706' : 'transparent'}
                  strokeWidth="0.4"
                  transform={`rotate(${petalAngle} 50 50)`}
                  style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
                />
              );
            })}

            {/* Center Sunflower Seed Disk */}
            <circle cx="50" cy="50" r="19" fill="url(#centerDiskGrad)" stroke="#b45309" strokeWidth="1" />
            <circle cx="50" cy="50" r="15" fill="#582307" />

            {/* Seed Spiral Dots appearing with progress */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 137.5 * Math.PI) / 180;
              const radius = Math.sqrt(i / 24) * 13;
              const dotX = 50 + radius * Math.cos(angle);
              const dotY = 50 + radius * Math.sin(angle);
              const isDotVisible = (i / 24) <= fillFactor;

              return (
                <circle
                  key={`dot-${i}`}
                  cx={dotX}
                  cy={dotY}
                  r={1 + (i / 24) * 0.8}
                  fill={isDotVisible ? '#f59e0b' : '#321404'}
                  opacity={isDotVisible ? 1 : 0.3}
                  style={{ transition: 'fill 0.3s ease' }}
                />
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Loading Text */}
      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4a3f35] mb-2 tracking-wide">
        Sunflower Blooming... 🌻
      </h2>
      <p className="text-xs text-[#7c6c5d] font-medium mb-6">
        Filling with love and sunshine
      </p>

      {/* Thin elegant progress bar */}
      <div className="w-64 md:w-80 h-2.5 bg-[#e8ded3] rounded-full overflow-hidden mb-3 border border-[#d9cdbf]/60 shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage & Click Prompt */}
      <p className="text-xs font-mono font-bold text-amber-900 mb-6 tracking-wider">
        {progress}%
      </p>

      <button
        type="button"
        onClick={handleSkip}
        className="px-5 py-2.5 rounded-full bg-white/90 hover:bg-white border border-amber-300 text-amber-900 text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        Skip Loading ✨
      </button>
    </motion.div>
  );
};


