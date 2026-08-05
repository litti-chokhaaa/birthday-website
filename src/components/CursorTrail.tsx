import React, { useEffect, useRef } from 'react';

interface CursorParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  maxLife: number;
  life: number;
  type: 'heart' | 'petal' | 'sparkle';
  color: string;
}

export const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<CursorParticle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = {
      hearts: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#f25c54'],
      petals: ['#fbbf24', '#f59e0b', '#fb7185', '#f43f5e', '#fecdd3'],
      sparkles: ['#fbbf24', '#fef08a', '#ffffff', '#fda4af']
    };

    const spawnParticle = (x: number, y: number, isMove = true) => {
      const count = isMove ? 2 : 5;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.4;
        const pTypeRand = Math.random();
        const type: 'heart' | 'petal' | 'sparkle' = 
          pTypeRand < 0.5 ? 'heart' : pTypeRand < 0.85 ? 'petal' : 'sparkle';

        const palette = colors[type === 'heart' ? 'hearts' : type === 'petal' ? 'petals' : 'sparkles'];
        const color = palette[Math.floor(Math.random() * palette.length)];

        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed * (type === 'petal' ? 0.7 : 1),
          vy: Math.sin(angle) * speed - (type === 'heart' ? 0.6 : 0.2),
          size: type === 'heart' ? 10 + Math.random() * 8 : type === 'petal' ? 8 + Math.random() * 6 : 3 + Math.random() * 3,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          opacity: 0.9,
          maxLife: type === 'sparkle' ? 25 + Math.random() * 20 : 45 + Math.random() * 25,
          life: 0,
          type,
          color,
        });
      }

      if (particlesRef.current.length > 120) {
        particlesRef.current.splice(0, particlesRef.current.length - 120);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let x = 0;
      let y = 0;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ('clientX' in e) {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      } else {
        return;
      }

      const last = lastPosRef.current;
      if (!last || Math.hypot(x - last.x, y - last.y) > 8) {
        spawnParticle(x, y, true);
        lastPosRef.current = { x, y };
      }
    };

    const handleClick = (e: MouseEvent) => {
      spawnParticle(e.clientX, e.clientY, false);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        p.opacity = Math.max(0, 1 - progress);

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'heart') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          const s = p.size;
          const topCurveHeight = s * 0.3;
          ctx.moveTo(0, topCurveHeight);
          ctx.bezierCurveTo(0, 0, -s / 2, 0, -s / 2, topCurveHeight);
          ctx.bezierCurveTo(-s / 2, (s + topCurveHeight) / 2, 0, s, 0, s);
          ctx.bezierCurveTo(0, s, s / 2, (s + topCurveHeight) / 2, s / 2, topCurveHeight);
          ctx.bezierCurveTo(s / 2, 0, 0, 0, 0, topCurveHeight);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'petal') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.45, p.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};