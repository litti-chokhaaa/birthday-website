import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Flame, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { THEME } from '../config/theme';
import { audioManager } from '../utils/audio';

interface SkyLanternOverlayProps {
  onClose: () => void;
}

interface Lantern {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  swaySpeed: number;
  swayAmount: number;
  swayOffset: number;
  opacity: number;
  text?: string;
  hue: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
}

export const SkyLanternOverlay: React.FC<SkyLanternOverlayProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [releasedWishes, setReleasedWishes] = useState<number>(0);
  const [customWish, setCustomWish] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);

  const wishes = [
    `Happy Birthday ${THEME.personName}!`,
    'May all your dreams come true ✨',
    'Joy, love & endless smiles 🌻',
    'Health, peace & happiness 💛',
    'Shine bright like a star 🌟',
    'Best year ahead! 🎉',
    'Loved beyond words 💕',
    'Keep blooming & growing 🌸',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 150 Twinkling Stars
    const stars: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      twinkleSpeed: 0.005 + Math.random() * 0.015,
    }));

    // Initialize 100 Floating Sky Lanterns
    const lanterns: Lantern[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: height + Math.random() * height * 1.5,
      speed: 0.6 + Math.random() * 1.2,
      size: 14 + Math.random() * 22,
      swaySpeed: 0.01 + Math.random() * 0.02,
      swayAmount: 15 + Math.random() * 25,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: 0.7 + Math.random() * 0.3,
      text: wishes[i % wishes.length],
      hue: 35 + Math.random() * 20,
    }));

    let lastFireworkTime = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Cosmic Indigo Night Sky Gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#0a071b');
      skyGradient.addColorStop(0.4, '#120d31');
      skyGradient.addColorStop(0.8, '#1f1338');
      skyGradient.addColorStop(1, '#2c183b');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Render Stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
        ctx.fillStyle = `rgba(255, 255, 240, ${Math.max(0, Math.min(1, star.alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Periodic Background Fireworks
      if (time - lastFireworkTime > 2200) {
        lastFireworkTime = time;
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.3 },
          colors: ['#ffd700', '#ff7700', '#ff007f', '#a855f7', '#00f0ff'],
          disableForReducedMotion: true,
          zIndex: 100,
        });
      }

      // Render Floating Lanterns
      lanterns.forEach((lantern) => {
        lantern.y -= lantern.speed;
        lantern.swayOffset += lantern.swaySpeed;
        const currentX = lantern.x + Math.sin(lantern.swayOffset) * lantern.swayAmount;

        if (lantern.y < -60) {
          lantern.y = height + Math.random() * 200;
          lantern.x = Math.random() * width;
        }

        // Lantern Radial Glow
        const glowRadius = lantern.size * 2.2;
        const radialGlow = ctx.createRadialGradient(
          currentX,
          lantern.y,
          0,
          currentX,
          lantern.y,
          glowRadius
        );
        radialGlow.addColorStop(0, `hsla(${lantern.hue}, 100%, 65%, ${0.5 * lantern.opacity})`);
        radialGlow.addColorStop(0.5, `hsla(${lantern.hue - 10}, 100%, 50%, ${0.2 * lantern.opacity})`);
        radialGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(currentX, lantern.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw Lantern Body
        const w = lantern.size * 0.9;
        const h = lantern.size * 1.3;
        const topW = w * 0.75;

        ctx.save();
        ctx.translate(currentX, lantern.y);

        ctx.beginPath();
        ctx.moveTo(-topW / 2, -h / 2);
        ctx.bezierCurveTo(-w, -h / 4, -w, h / 4, -topW / 2, h / 2);
        ctx.lineTo(topW / 2, h / 2);
        ctx.bezierCurveTo(w, h / 4, w, -h / 4, topW / 2, -h / 2);
        ctx.closePath();

        const paperGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
        paperGrad.addColorStop(0, `hsla(${lantern.hue + 5}, 100%, 85%, ${lantern.opacity})`);
        paperGrad.addColorStop(0.5, `hsla(${lantern.hue}, 95%, 65%, ${lantern.opacity})`);
        paperGrad.addColorStop(1, `hsla(${lantern.hue - 15}, 90%, 45%, ${lantern.opacity})`);

        ctx.fillStyle = paperGrad;
        ctx.fill();

        ctx.strokeStyle = `rgba(180, 80, 20, ${0.4 * lantern.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Flame Glow Center
        const flameSize = lantern.size * 0.35;
        const flameGrad = ctx.createRadialGradient(0, h * 0.25, 0, 0, h * 0.25, flameSize * 1.8);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.4, '#ffea00');
        flameGrad.addColorStop(0.8, '#ff4500');
        flameGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.arc(0, h * 0.25, flameSize * 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSendCustomWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWish.trim()) return;

    audioManager.playChime('heart');
    setReleasedWishes((prev) => prev + 1);

    confetti({
      particleCount: 50,
      spread: 90,
      origin: { y: 0.8 },
      colors: ['#ffd700', '#ff9900', '#ff007f'],
    });

    setCustomWish('');
    setShowInput(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-between p-4 sm:p-8 select-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Header Overlay Controls */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto pt-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 shadow-lg flex items-center gap-2">
            <Moon className="w-5 h-5 text-amber-200" />
            <span className="font-serif text-sm sm:text-base font-semibold text-amber-100">
              Night Sky Wish Celebration
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-medium border border-white/10">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>100 Sky Lanterns Floating</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/15 hover:bg-white/25 text-white/90 backdrop-blur-md border border-white/20 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Center Banner */}
      <div className="relative z-10 text-center my-auto max-w-2xl mx-auto px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/35 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-amber-300/30 shadow-2xl text-white"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Grand Sky Lantern Festival</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100 tracking-tight mb-3 drop-shadow-md">
            100 Lanterns for {THEME.personName} 🌌✨
          </h1>

          <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed font-light max-w-lg mx-auto">
            Every glowing lantern carries a heartfelt wish of health, boundless happiness, and brilliant light for your journey ahead.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
            <button
              onClick={() => setShowInput(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 text-amber-950 font-bold text-sm shadow-xl hover:shadow-amber-400/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-900 fill-amber-900" />
              <span>Release Your Sky Lantern 🏮</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Wish Dialog */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed inset-x-4 bottom-8 z-20 max-w-lg mx-auto bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-amber-400/40 shadow-2xl text-white pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-bold text-amber-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Write a Sky Lantern Wish</span>
              </h3>
              <button onClick={() => setShowInput(false)} className="text-white/60 hover:text-white text-sm">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSendCustomWish} className="flex flex-col gap-3">
              <input
                type="text"
                value={customWish}
                onChange={(e) => setCustomWish(e.target.value)}
                placeholder={`Wish for ${THEME.personName}...`}
                maxLength={60}
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-amber-300/30 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 text-sm"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-bold text-sm shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 fill-amber-950" />
                <span>Light & Launch Lantern ✨</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-amber-200/60 pb-2">
        <span>✨ Tip: Lanterns carry warm birthday wishes into the night sky</span>
        {releasedWishes > 0 && (
          <span className="text-amber-300 font-semibold">
            {releasedWishes} custom lantern{releasedWishes > 1 ? 's' : ''} released! ❤️
          </span>
        )}
      </div>
    </motion.div>
  );
};