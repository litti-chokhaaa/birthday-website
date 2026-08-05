import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Sparkles, ArrowRight, HelpCircle, Heart, Delete, RotateCcw } from 'lucide-react';
import { THEME } from '../config/theme';
import { audioManager } from '../utils/audio';
import { BackgroundOverlay } from './BackgroundOverlay';

interface PasscodeScreenProps {
  onUnlockSuccess: () => void;
}

export const PasscodeScreen: React.FC<PasscodeScreenProps> = ({ onUnlockSuccess }) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // Focus first box on mount for desktop users
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === THEME.passcode) {
      setIsSuccess(true);
      setIsError(false);
      audioManager.playChime('unlock');

      setTimeout(() => {
        onUnlockSuccess();
      }, 900);
    } else {
      setIsError(true);
      setIsSuccess(false);

      // Reset after shake
      setTimeout(() => {
        setPin(['', '', '', '']);
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
          inputRefs.current[0]?.focus();
        }
      }, 600);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (isSuccess) return;
    setIsError(false);

    // Accept only single digit or backspace
    const cleanVal = value.replace(/[^0-9]/g, '');
    const newPin = [...pin];

    if (cleanVal.length > 0) {
      newPin[index] = cleanVal[cleanVal.length - 1];
      setPin(newPin);

      // Auto move to next input box
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      newPin[index] = '';
      setPin(newPin);
    }

    // Auto submit if all 4 digits typed
    if (newPin.every((digit) => digit !== '')) {
      verifyPin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (isSuccess) return;
    setIsError(false);

    const firstEmptyIndex = pin.findIndex((d) => d === '');
    if (firstEmptyIndex !== -1) {
      const newPin = [...pin];
      newPin[firstEmptyIndex] = digit;
      setPin(newPin);

      if (newPin.every((d) => d !== '')) {
        verifyPin(newPin.join(''));
      }
    }
  };

  const handleKeypadDelete = () => {
    if (isSuccess) return;
    setIsError(false);

    const newPin = [...pin];
    // Find last non-empty index
    for (let i = 3; i >= 0; i--) {
      if (newPin[i] !== '') {
        newPin[i] = '';
        break;
      }
    }
    setPin(newPin);
  };

  const handleKeypadClear = () => {
    if (isSuccess) return;
    setIsError(false);
    setPin(['', '', '', '']);
  };

  const handleUnlockClick = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPin(pin.join(''));
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-y-auto bg-gradient-to-br from-[#faf3ea] via-[#f5e6d3] to-[#ebd2be]">
      {/* Soft animated background bokeh light spheres */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-200/35 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Particle Canvas Overlay */}
      <BackgroundOverlay />

      {/* Main Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.6 } }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 w-full max-w-md p-6 sm:p-8 md:p-10 rounded-3xl transition-all duration-500 my-auto ${
          isError
            ? 'glass-card border-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.35)] animate-shake'
            : isSuccess
            ? 'glass-card border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)]'
            : 'glass-card'
        }`}
      >
        {/* Decorative Top Sun Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <motion.div
            animate={{ rotate: isSuccess ? 360 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
              isSuccess ? 'bg-amber-100 text-amber-600' : isError ? 'bg-rose-100 text-rose-500' : 'bg-amber-50 text-amber-500'
            }`}
          >
            {isSuccess ? (
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" />
            ) : (
              <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
            )}
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3d3228] mb-2 tracking-tight">
            Secret Passcode
          </h1>
          <p className="text-xs sm:text-sm text-[#786b5f] max-w-xs mx-auto leading-relaxed">
            {THEME.messages.passcodeWelcome}
          </p>
        </div>

        {/* Form Input Boxes */}
        <form onSubmit={handleUnlockClick} className="space-y-5">
          <div className="flex justify-center items-center gap-2.5 sm:gap-4">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-2xl outline-none transition-all duration-300 ${
                  isError
                    ? 'bg-rose-50/80 border-2 border-rose-400 text-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                    : isSuccess
                    ? 'bg-emerald-50/80 border-2 border-emerald-400 text-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'glass-input text-[#3d3228] focus:border-amber-400'
                }`}
              />
            ))}
          </div>

          {/* Feedback Messages */}
          <div className="h-5 text-center">
            <AnimatePresence mode="wait">
              {isError && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-rose-500 flex items-center justify-center gap-1"
                >
                  Incorrect passcode. Try again!
                </motion.p>
              )}
              {isSuccess && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" /> Unlocking your birthday bloom...
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* On-Screen Touch Keypad */}
          <div className="pt-2 pb-1 max-w-[260px] sm:max-w-[280px] mx-auto">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <motion.button
                  key={num}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleKeypadPress(num)}
                  className="h-12 sm:h-13 rounded-2xl bg-white/70 hover:bg-white active:bg-amber-100/80 border border-stone-200/70 text-[#3d3228] text-lg font-bold shadow-xs flex items-center justify-center transition-colors"
                >
                  {num}
                </motion.button>
              ))}

              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={handleKeypadClear}
                className="h-12 sm:h-13 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/50 text-amber-800 text-xs font-semibold shadow-xs flex items-center justify-center transition-colors"
                title="Clear input"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => handleKeypadPress('0')}
                className="h-12 sm:h-13 rounded-2xl bg-white/70 hover:bg-white active:bg-amber-100/80 border border-stone-200/70 text-[#3d3228] text-lg font-bold shadow-xs flex items-center justify-center transition-colors"
              >
                0
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={handleKeypadDelete}
                className="h-12 sm:h-13 rounded-2xl bg-rose-50/60 hover:bg-rose-100/80 border border-rose-200/50 text-rose-700 text-xs font-semibold shadow-xs flex items-center justify-center transition-colors"
                title="Delete digit"
              >
                <Delete className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Unlock Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSuccess || pin.some((d) => d === '')}
            className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
              isSuccess
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white shadow-amber-200 hover:shadow-amber-300 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <span>{isSuccess ? 'Unlocked!' : 'Unlock Surprise'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        {/* Passcode Hint Toggle */}
        <div className="mt-5 text-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1.5 text-xs text-[#a09082] hover:text-[#524438] transition-colors focus:outline-none"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need a hint?</span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs font-medium text-amber-700 bg-amber-50/80 py-2 px-3 rounded-xl border border-amber-200/60 inline-block"
              >
                {THEME.passcodeHint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

