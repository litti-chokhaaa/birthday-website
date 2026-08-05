import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { audioManager } from '../utils/audio';

export const CuteCat: React.FC = () => {
  const [showMeow, setShowMeow] = useState<boolean>(false);
  const [meowText, setMeowText] = useState<string>("Purrr~ Happy Birthday! 🐾");

  const meowQuotes = [
  "Purrr~ Happy Birthday! 🐾",
  "Meow! You are so special! 💖",
  "Sending cat hugs & soft purrs! 🐱✨",
  "Have the sweetest day ever! 🌸",
  "Meow meow! Stay blessed! 🎂",
  "Paws up! It's your special day! 🐾🎉",
  "You're paws-itively amazing! 😸💛",
  "May your birthday be filled with cuddles! 🤍🐱",
  "Wishing you endless smiles and happy purrs! 🌻",
  "Stay cute, stay kind, stay you! 💕",
  "Every birthday deserves extra purrs! 🐾",
  "Meow wishes coming your way! ✨",
  "You're the sunshine of every kitty! ☀️🐱",
  "Hope your day is as sweet as treats! 🍰",
  "Sending fluffy happiness your way! 🌸",
  "Keep smiling, beautiful human! 💛",
  "You deserve all the happiness today! 🎈",
  "A little purr, a lot of love! 🐱💖",
  "Today belongs to you! Celebrate! 🎉",
  "May your dreams bloom like sunflowers! 🌻",
  "Happy Birthday to the kindest soul! 🤍",
  "Meow says: Smile more today! 😊",
  "Life is better with birthdays and cats! 🐾",
  "Another year, another reason to shine! ✨",
  "May your heart stay as warm as sunshine! ☀️",
  "Sending a basket full of kitty hugs! 🧺🐱",
  "Wishing you purr-fect moments today! 💕",
  "Keep glowing, keep growing! 🌼",
  "Meow! Time for cake! 🎂🐾",
  "Your smile makes every day brighter! 🌷",
  "Hope today is filled with love and laughter! 💖",
  "Purrs, cuddles, and birthday wishes! 🐱🎀",
  "You're simply paw-some! 😺",
  "A birthday as wonderful as you! 🌻",
  "May happiness follow you everywhere! 🍀",
  "Smile big, dream bigger! ✨",
  "Sunflowers, smiles, and soft purrs just for you! 🌻🐾",
  "Have a magical birthday, beautiful friend! 🎂💛",
  "Paws, play, and plenty of birthday joy! 🐾🎉",
  "Keep blooming like a sunflower! 🌻✨"
  ];

  const handleCatClick = () => {
    audioManager.playChime('heart');
    const randomQuote = meowQuotes[Math.floor(Math.random() * meowQuotes.length)];
    setMeowText(randomQuote);
    setShowMeow(true);

    setTimeout(() => {
      setShowMeow(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-auto select-none">
      {/* Speech Dialogue Bubble */}
      <AnimatePresence>
        {showMeow && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="mb-2 mr-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl rounded-br-none shadow-lg border border-amber-200 text-xs font-semibold text-[#524438] flex items-center gap-1.5 max-w-[200px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{meowText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cute Cat SVG Graphic */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.92 }}
        onClick={handleCatClick}
        className="cursor-pointer group relative w-16 h-16 md:w-20 md:h-20 drop-shadow-md"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Tail */}
          <path
            d="M 25 75 Q 10 70 15 50 Q 18 35 22 45"
            fill="none"
            stroke="#d97706"
            strokeWidth="6"
            strokeLinecap="round"
            className="animate-pulse"
          />

          {/* Body */}
          <ellipse cx="50" cy="70" rx="25" ry="20" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Paws */}
          <circle cx="38" cy="85" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="62" cy="85" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />

          {/* Ears */}
          <polygon points="30,35 20,10 42,25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="26,30 22,16 36,25" fill="#fde047" />

          <polygon points="70,35 80,10 58,25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="74,30 78,16 64,25" fill="#fde047" />

          {/* Head */}
          <circle cx="50" cy="40" r="22" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Eyes */}
          <ellipse cx="40" cy="38" rx="3" ry="4" fill="#332e2b" />
          <circle cx="39" cy="37" r="1" fill="#ffffff" />

          <ellipse cx="60" cy="38" rx="3" ry="4" fill="#332e2b" />
          <circle cx="59" cy="37" r="1" fill="#ffffff" />

          {/* Cheeks */}
          <ellipse cx="33" cy="44" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />
          <ellipse cx="67" cy="44" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />

          {/* Nose & Mouth */}
          <polygon points="50,43 47,46 53,46" fill="#f43f5e" />
          <path d="M 47 48 Q 50 51 50 48 Q 50 51 53 48" fill="none" stroke="#332e2b" strokeWidth="1.5" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="28" y1="42" x2="16" y2="40" stroke="#d97706" strokeWidth="1.5" />
          <line x1="28" y1="46" x2="16" y2="48" stroke="#d97706" strokeWidth="1.5" />

          <line x1="72" y1="42" x2="84" y2="40" stroke="#d97706" strokeWidth="1.5" />
          <line x1="72" y1="46" x2="84" y2="48" stroke="#d97706" strokeWidth="1.5" />

          {/* Cute Party Hat */}
          <polygon points="50,20 42,2 58,2" fill="#f43f5e" />
          <circle cx="50" cy="2" r="3" fill="#fbbf24" />
        </svg>

        {/* Floating Heart indicator on hover */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-4 h-4 text-rose-500 fill-current animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
};
