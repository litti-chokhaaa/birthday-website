import React, { useEffect, useRef } from 'react';
import { BackgroundParticleEngine } from '../utils/particles';

export const BackgroundOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new BackgroundParticleEngine(canvasRef.current);
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
