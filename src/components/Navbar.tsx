import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, Menu, X, Camera, Heart, ListChecks, Calendar, Cake, Gift } from 'lucide-react';
import { THEME } from '../config/theme';
import { audioManager } from '../utils/audio';

export const Navbar: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleToggleAudio = () => {
    const newState = audioManager.toggleMusic();
    setIsPlaying(newState);
  };

  const navItems = [
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'letter', label: 'Love Letter', icon: Heart },
    { id: 'reasons', label: 'Reasons', icon: ListChecks },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'cake', label: 'Cake', icon: Cake },
    { id: 'gifts', label: 'Gifts', icon: Gift },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-5xl"
    >
      <div className="glass-card px-4 py-2.5 md:px-6 md:py-3 rounded-2xl md:rounded-full flex items-center justify-between border border-white/60 shadow-lg relative z-50">
        {/* Logo / Title */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-base md:text-lg text-[#3d3228] tracking-tight">
            {THEME.personName}'s Day
          </span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#6e6052]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="hover:text-amber-600 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleAudio}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              isPlaying
                ? 'bg-amber-100 text-amber-800 border border-amber-300/80 shadow-sm'
                : 'bg-stone-200/80 text-stone-600'
            }`}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="hidden sm:inline text-[11px]">Playing Music</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline text-[11px]">Muted</span>
              </>
            )}
          </motion.button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-800" /> : <Menu className="w-5 h-5 text-amber-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden"
            />

            {/* Menu Card */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-amber-200/80 shadow-xl rounded-2xl p-3 z-40 md:hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/80 text-[#3d3228] text-xs font-medium transition-all active:scale-95 text-left border border-amber-100/60"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-200/60 flex items-center justify-center text-amber-800 shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
