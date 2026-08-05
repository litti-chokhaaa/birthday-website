import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Heart, MapPin } from 'lucide-react';
import { THEME } from '../config/theme';

export const Timeline: React.FC = () => {
  return (
    <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Story Timeline</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#3d3228] tracking-tight mb-4">
          A Beautiful Journey 🌼
        </h2>
        <p className="text-sm sm:text-base text-[#786b5f]">
          Celebrating the beautiful moments and milestones that shaped your journey.
        </p>
      </div>

      {/* Timeline Vertical Line Container */}
      <div className="relative">
        {/* Central Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-rose-300 to-amber-400 -translate-x-1/2" />

        <div className="space-y-12">
          {THEME.timeline.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Center Node Badge Icon */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white border-4 border-amber-400 shadow-md flex items-center justify-center text-amber-600">
                  <Heart className="w-4 h-4 fill-current text-rose-500" />
                </div>

                {/* Content Box */}
                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8 w-full">
                  <div className="glass-card p-6 rounded-3xl border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Optional Image */}
                    {item.image && (
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-stone-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 py-1 px-3 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.date}
                      </span>
                      {item.badge && (
                        <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-serif font-bold text-[#3d3228] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#6e6052] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
