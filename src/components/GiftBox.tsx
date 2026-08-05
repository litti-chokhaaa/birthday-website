import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Heart, Sun, CheckCircle } from 'lucide-react';
import { THEME } from '../config/theme';
import { audioManager } from '../utils/audio';
import { GiftCoupon } from '../types';

export const GiftBox: React.FC = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [redeemedCodes, setRedeemedCodes] = useState<{ [key: string]: boolean }>({});

  const handleOpenGift = () => {
    if (!isOpened) {
      setIsOpened(true);
      audioManager.playChime('unwrap');
      audioManager.playChime('confetti');

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f43f5e', '#a855f7'],
      });
    }
  };

  const handleRedeemCoupon = (coupon: GiftCoupon) => {
    audioManager.playChime('heart');
    setRedeemedCodes((prev) => ({ ...prev, [coupon.id]: true }));
  };

  return (
    <section id="gifts" className="py-24 px-4 sm:px-6 max-w-5xl mx-auto relative text-center">
      {/* Section Header */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <Gift className="w-3.5 h-3.5 text-amber-600" />
          <span>Surprise Vouchers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#3d3228] tracking-tight mb-3">
          Your Birthday Gift Box
        </h2>
        <p className="text-sm sm:text-base text-[#786b5f]">
          Click the ribbon to unwrap your special birthday coupons!
        </p>
      </div>

      {/* Gift Box Graphic */}
      {!isOpened ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
          onClick={handleOpenGift}
          className="cursor-pointer max-w-sm mx-auto glass-card p-10 rounded-3xl border-2 border-amber-300 shadow-2xl relative group"
        >
          {/* Ribbon 3D Graphic */}
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Box Body */}
            <div className="w-full h-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
              {/* Vertical Ribbon */}
              <div className="absolute top-0 bottom-0 w-8 bg-rose-500 shadow-md" />
              {/* Horizontal Ribbon */}
              <div className="absolute left-0 right-0 h-8 bg-rose-500 shadow-md" />
              <Sparkles className="w-10 h-10 text-white z-10 animate-bounce" />
            </div>
            {/* Ribbon Bow on top */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-rose-300 shadow-md -rotate-45" />
              <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-rose-300 shadow-md rotate-45" />
            </div>
          </div>

          <h3 className="text-xl font-serif font-bold text-[#3d3228] mb-2">
            Unwrap Gift Box
          </h3>
          <p className="text-xs text-[#786b5f] mb-6">
            4 Exclusive Love Coupons inside just for you!
          </p>

          <button className="px-6 py-2.5 rounded-full bg-rose-500 text-white text-xs font-semibold shadow-md group-hover:bg-rose-600 transition-colors inline-flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Click to Open</span>
          </button>
        </motion.div>
      ) : (
        /* Unwrapped Gift Coupons Grid */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
        >
          {THEME.giftCoupons.map((coupon, idx) => {
            const isRedeemed = redeemedCodes[coupon.id];

            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-3xl border border-amber-200 shadow-lg relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 py-1 px-3 rounded-full flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-600" /> Birthday Coupon
                    </span>
                    <span className="font-mono text-[11px] text-stone-500 font-semibold">
                      {coupon.code}
                    </span>
                  </div>

                  <h4 className="text-lg font-serif font-bold text-[#3d3228] mb-2">
                    {coupon.title}
                  </h4>
                  <p className="text-xs text-[#6e6052] leading-relaxed mb-6">
                    {coupon.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                  <span className="text-[11px] text-[#8c7b6c] italic">
                    Valid Forever
                  </span>

                  <button
                    onClick={() => handleRedeemCoupon(coupon)}
                    disabled={isRedeemed}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isRedeemed
                        ? 'bg-emerald-100 text-emerald-700 cursor-default'
                        : 'bg-amber-500 text-white hover:bg-amber-600 shadow-md'
                    }`}
                  >
                    {isRedeemed ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Redeemed!
                      </>
                    ) : (
                      <span>Redeem Voucher</span>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};
