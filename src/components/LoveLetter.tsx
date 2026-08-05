import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { THEME } from '../config/theme';
import { audioManager } from '../utils/audio';

export const LoveLetter: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenLetter = () => {
    if (!isOpen) {
      audioManager.playChime('unwrap');
      setIsOpen(true);
    }
  };

  return (
    <section id="letter" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100/80 text-rose-900 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5 text-rose-600" />
          <span>Special Delivery</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#3d3228] tracking-tight">
          {THEME.messages.loveLetterTitle}
        </h2>
      </div>

      {/* Envelope / Letter Card */}
      <div className="relative min-h-[420px] flex items-center justify-center">
        {!isOpen ? (
          /* Sealed Envelope View */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            onClick={handleOpenLetter}
            className="cursor-pointer w-full max-w-lg glass-card p-8 md:p-12 rounded-3xl text-center border-2 border-amber-200/80 shadow-xl relative overflow-hidden group"
          >
            {/* Soft decorative background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-amber-100/40 pointer-events-none" />

            {/* Wax Seal Icon */}
            <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-300/60 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-9 h-9 fill-current text-white animate-pulse" />
            </div>

            <h3 className="relative z-10 text-xl font-serif font-bold text-[#3d3228] mb-2">
              To: {THEME.personName} ❤️
            </h3>
            <p className="relative z-10 text-xs text-[#786b5f] mb-6">
              Click the wax seal to open your birthday letter...
            </p>

            <button className="relative z-10 px-6 py-2.5 rounded-full bg-amber-500 text-white font-semibold text-xs shadow-md group-hover:bg-amber-600 transition-colors inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unseal Letter</span>
            </button>
          </motion.div>
        ) : (
          /* Opened Parchment Letter View */
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#fcf8f2] p-8 md:p-14 rounded-3xl border-2 border-amber-200/90 shadow-2xl relative"
          >
            {/* Top Sunflower Stamp */}
            <div className="flex justify-between items-center mb-8 border-b border-amber-200/80 pb-4">
              <span className="font-serif italic text-sm text-amber-800 font-semibold">
                Private & Confidential
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                <Heart className="w-3.5 h-3.5 fill-current" /> Opened with Love
              </div>
            </div>

            {/* Letter Content Paragraphs */}
            <div className="space-y-5 text-[#3d3228]">
              {THEME.messages.loveLetterText.map((paragraph, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className={
                    idx === 0
                      ? 'font-serif font-bold text-xl sm:text-2xl text-amber-900 mb-2'
                      : idx === THEME.messages.loveLetterText.length - 1
                      ? 'font-handwriting text-2xl sm:text-3xl text-rose-600 font-bold pt-4'
                      : 'text-sm sm:text-base leading-relaxed text-[#4a3f35] font-normal'
                  }
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Close / Reseal Option */}
            <div className="mt-10 pt-6 border-t border-amber-200/80 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#8c7b6c] hover:text-[#3d3228] transition-colors underline underline-offset-4"
              >
                Reseal letter
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
