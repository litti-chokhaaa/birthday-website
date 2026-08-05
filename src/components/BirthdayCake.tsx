import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Sparkles, Heart, Flame, Gift } from 'lucide-react';
import { THEME } from '../config/theme';
import { audioManager } from '../utils/audio';
import { useMicrophoneBlowDetection } from '../hooks/useMicrophone';

export const BirthdayCake: React.FC = () => {
  const [isLit, setIsLit] = useState<boolean>(true);
  const [showWishModal, setShowWishModal] = useState<boolean>(false);
  const [customWish, setCustomWish] = useState<string>(THEME.messages.defaultWish);
  const [useMic, setUseMic] = useState<boolean>(false);

  const triggerBlowOut = React.useCallback(() => {
    if (!isLit) return;
    setIsLit(false);
    audioManager.playChime('blow');
    audioManager.playChime('confetti');

    // Confetti explosion
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f43f5e', '#10b981', '#fde047', '#a855f7'],
    });

    setTimeout(() => {
      setShowWishModal(true);
    }, 800);
  }, [isLit]);

  const { isListening, blowVolume, micError, startListening, stopListening } = useMicrophoneBlowDetection(
    triggerBlowOut,
    useMic && isLit
  );

  const toggleMicMode = () => {
    if (useMic) {
      setUseMic(false);
      stopListening();
    } else {
      setUseMic(true);
      startListening();
    }
  };

  const handleRelight = () => {
    setIsLit(true);
    setShowWishModal(false);
  };

  return (
    <section id="cake" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto relative text-center">
      {/* Section Header */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Make a Wish</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#3d3228] tracking-tight mb-3">
          Interactive Birthday Cake
        </h2>
        <p className="text-sm sm:text-base text-[#786b5f]">
          {THEME.messages.cakeWishPrompt}
        </p>

        {/* Mic Blow Toggle Button */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            onClick={toggleMicMode}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              useMic
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200 animate-pulse'
                : 'glass-card text-[#6e6052] hover:bg-white'
            }`}
          >
            {useMic ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span>{useMic ? 'Microphone Active (Blow into your mic!)' : 'Enable Microphone Blow'}</span>
          </button>

          {micError && (
            <p className="text-xs text-rose-500 font-medium mt-1">
              ⚠️ {micError}
            </p>
          )}

          {useMic && isListening && isLit && (
            <div className="mt-2 w-56 p-2 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col items-center gap-1.5">
              <div className="flex justify-between w-full text-[11px] font-semibold text-amber-900 px-1">
                <span>🌬️ Blow Intensity</span>
                <span>{blowVolume}%</span>
              </div>
              <div className="w-full bg-amber-200/60 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-75 ${
                    blowVolume > 20 ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${blowVolume}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Aesthetic Interactive 3D Tier Cake SVG Graphic */}
      <div className="relative my-8 flex flex-col items-center justify-center">
        <div
          onClick={triggerBlowOut}
          className="cursor-pointer group relative w-72 h-80 sm:w-80 sm:h-96 flex flex-col items-center justify-end"
        >
          {/* Candle Flame & Glow */}
          <div className="relative mb-[-8px] z-20 flex flex-col items-center">
            <AnimatePresence>
              {isLit ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.15, 0.95, 1] }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="relative flex flex-col items-center"
                >
                  {/* Outer Warm Flame Glow */}
                  <div className="w-12 h-12 bg-amber-400/40 rounded-full blur-md absolute -top-3" />
                  {/* Inner Flame SVG */}
                  <div className="w-6 h-10 bg-gradient-to-t from-amber-500 via-yellow-400 to-white rounded-full animate-candle shadow-[0_0_20px_#f59e0b]" />
                </motion.div>
              ) : (
                /* Candle Smoke Particle Effect */
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -25 }}
                  transition={{ duration: 1.5 }}
                  className="flex flex-col items-center text-stone-400 text-xs font-mono"
                >
                  <div className="w-1.5 h-6 bg-stone-300 rounded-full blur-[1px] animate-pulse" />
                  <span>~ smoke ~</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Candle Stick Body */}
            <div className="w-3.5 h-14 bg-gradient-to-b from-rose-200 via-rose-300 to-amber-200 rounded-t-sm shadow-inner border border-rose-300/60" />
          </div>

          {/* Cake Tier 1 (Top Tier) */}
          <div className="w-48 h-20 bg-gradient-to-b from-[#fff5eb] to-[#fce7f3] rounded-t-3xl border-2 border-rose-200 shadow-md relative overflow-hidden flex flex-col items-center justify-center">
            {/* Drip Cream Decoration */}
            <div className="absolute top-0 w-full h-5 bg-rose-200/60 rounded-b-xl" />
            <span className="font-serif font-bold text-sm text-rose-800 z-10">
              {THEME.personName}
            </span>
          </div>

          {/* Cake Tier 2 (Middle Tier) */}
          <div className="w-60 h-24 bg-gradient-to-b from-[#fef3c7] to-[#fde68a] border-2 border-amber-300/80 shadow-md relative overflow-hidden flex items-center justify-center">
            {/* Strawberries / Flowers decor */}
            <div className="flex gap-4">
              <span className="text-xl">🌸</span>
              <span className="text-xl">🍓</span>
              <span className="text-xl">🌻</span>
              <span className="text-xl">🍓</span>
              <span className="text-xl">🌸</span>
            </div>
          </div>

          {/* Cake Tier 3 (Bottom Base Tier) */}
          <div className="w-72 sm:w-80 h-28 bg-gradient-to-b from-[#fbcfe8] to-[#f472b6] rounded-b-2xl border-2 border-rose-300 shadow-xl relative overflow-hidden flex items-center justify-center">
            <div className="flex gap-6">
              <span className="text-2xl">✨</span>
              <span className="text-2xl">💖</span>
              <span className="text-2xl">🎂</span>
              <span className="text-2xl">💖</span>
              <span className="text-2xl">✨</span>
            </div>
          </div>

          {/* Cake Plate Base */}
          <div className="w-80 sm:w-96 h-5 bg-stone-200/90 rounded-full shadow-lg border border-stone-300/80 mt-1" />
        </div>

        {/* Action Instruction Button */}
        <div className="mt-8">
          {isLit ? (
            <button
              onClick={triggerBlowOut}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Click Candle to Blow Out!</span>
            </button>
          ) : (
            <button
              onClick={handleRelight}
              className="px-6 py-2.5 rounded-full glass-card text-[#4a3f35] font-semibold text-xs border border-amber-200 hover:bg-white transition-all inline-flex items-center gap-2"
            >
              <span>Relight Candle 🕯️</span>
            </button>
          )}
        </div>
      </div>

      {/* Birthday Wish Popup Modal */}
      <AnimatePresence>
        {showWishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="glass-card bg-white p-8 md:p-10 rounded-3xl max-w-lg w-full text-center relative shadow-2xl border-2 border-amber-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Sparkles className="w-8 h-8" />
              </div>

              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#3d3228] mb-3">
                Your Birthday Wish Came True! ✨
              </h3>

              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/60 mb-6">
                <p className="font-handwriting text-2xl text-[#3d3228] leading-relaxed">
                  "{customWish}"
                </p>
              </div>

              <button
                onClick={() => setShowWishModal(false)}
                className="w-full py-3 rounded-2xl bg-amber-500 text-white font-semibold text-sm shadow-md hover:bg-amber-600 transition-colors"
              >
                Keep Celebrating! 🎉
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
