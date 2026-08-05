import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SunflowerBloomEngine } from '../utils/sunflowerCanvas';

interface SunflowerBloomProps {
  onBloomComplete?: () => void;
  onComplete?: () => void;
}

export const SunflowerBloom: React.FC<SunflowerBloomProps> = ({ onBloomComplete, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SunflowerBloomEngine | null>(null);
  const handleComplete = () => {
    if (onBloomComplete) onBloomComplete();
    if (onComplete) onComplete();
  };
  const onCompleteRef = useRef(handleComplete);

  useEffect(() => {
    onCompleteRef.current = handleComplete;
  }, [onBloomComplete, onComplete]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new SunflowerBloomEngine(canvasRef.current, {
      onBloomComplete: () => onCompleteRef.current(),
    });
    engineRef.current = engine;
    engine.start();

    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-50 w-full h-full bg-gradient-to-br from-[#fefae0] via-[#fdeed9] via-[#fce4ec] to-[#f5ebdc] overflow-hidden flex items-center justify-center cursor-pointer"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onCompleteRef.current();
        }}
        className="absolute bottom-6 right-6 z-10 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-xs font-medium text-amber-900 shadow-md backdrop-blur transition-all pointer-events-auto"
      >
        Skip Bloom 🌸
      </button>
    </motion.div>
  );
};

