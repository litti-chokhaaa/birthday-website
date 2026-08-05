import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Sun } from 'lucide-react';
import { THEME } from '../config/theme';
import { audioManager } from '../utils/audio';

export const ReasonsILoveYou: React.FC = () => {
  const [likesState, setLikesState] = useState<{ [key: number]: { count: number; liked: boolean } }>(() => {
    const initial: { [key: number]: { count: number; liked: boolean } } = {};
    THEME.reasons.forEach((r) => {
      initial[r.id] = { count: r.likes, liked: false };
    });
    return initial;
  });

  const toggleLike = (id: number) => {
    audioManager.playChime('heart');
    setLikesState((prev) => {
      const current = prev[id] || { count: 0, liked: false };
      return {
        ...prev,
        [id]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked,
        },
      };
    });
  };

  return (
    <section id="reasons" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          <span>Endless Reasons</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-4xl font-serif font-bold text-[#3d3228] tracking-tight mb-4">
          Things I Admire About You 💛
        </h2>
        <p className="text-sm sm:text-base text-[#786b5f]">
          Your kindness, positivity, and beautiful personality are just a few reasons you're so special.
        </p>
      </div>

      {/* Grid of Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEME.reasons.map((reason, index) => {
          const state = likesState[reason.id] || { count: reason.likes, liked: false };

          return (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass-card p-6 md:p-8 rounded-3xl border border-white/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                    #{reason.id}
                  </span>
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>

                <h3 className="text-xl font-serif font-bold text-[#3d3228] mb-3">
                  {reason.title}
                </h3>
                <p className="text-sm text-[#6e6052] leading-relaxed mb-6">
                  {reason.description}
                </p>
              </div>

              {/* Bottom Heart Like Counter */}
              <div className="pt-4 border-t border-amber-100/60 flex items-center justify-between">
                <span className="text-xs text-[#8c7b6c] font-medium">
                  Your Love Score
                </span>
                <button
                  onClick={() => toggleLike(reason.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    state.liked
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105'
                      : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${state.liked ? 'fill-current' : ''}`} />
                  <span>{state.count}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
