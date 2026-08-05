// Background Particle Engine for floating petals, sparkles, hearts, balloons, music notes, bokeh orbs, flowers, shooting stars, clouds & butterflies

export interface ParticleOptions {
  canvas: HTMLCanvasElement;
}

export class BackgroundParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number | null = null;

  // Particle collections
  private petals: Array<{
    x: number; y: number; size: number; speedY: number; speedX: number;
    rot: number; rotSpeed: number; color: string; opacity: number;
  }> = [];

  private sparkles: Array<{
    x: number; y: number; size: number; maxOpacity: number;
    phase: number; speed: number;
  }> = [];

  private hearts: Array<{
    x: number; y: number; size: number; speedY: number; speedX: number;
    opacity: number; scale: number;
  }> = [];

  private balloons: Array<{
    x: number; y: number; size: number; speedY: number;
    swayPhase: number; color: string; stringLength: number;
  }> = [];

  private bokehOrbs: Array<{
    x: number; y: number; radius: number; vx: number; vy: number;
    color: string; opacity: number; phase: number;
  }> = [];

  private musicNotes: Array<{
    x: number; y: number; symbol: string; size: number; speedY: number;
    swayPhase: number; opacity: number; rot: number;
  }> = [];

  private flowers: Array<{
    x: number; y: number; size: number; speedY: number; speedX: number;
    rot: number; rotSpeed: number; petalsCount: number; color: string; centerColor: string;
  }> = [];

  private clouds: Array<{
    x: number; y: number; scale: number; speedX: number; opacity: number;
  }> = [];

  private shootingStar: {
    active: boolean; x: number; y: number; vx: number; vy: number;
    length: number; opacity: number; nextTime: number;
  } = {
    active: false, x: 0, y: 0, vx: 0, vy: 0, length: 0, opacity: 0, nextTime: 0
  };

  private butterflies: Array<{
    x: number; y: number; speedX: number; speedY: number;
    wingPhase: number; color: string; size: number;
  }> = [];

  private bird: {
    active: boolean; x: number; y: number; speedX: number;
    wingPhase: number; size: number; nextSpawnTime: number;
  } = {
    active: false, x: -50, y: 100, speedX: 1.8, wingPhase: 0, size: 18, nextSpawnTime: 0
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2d context");
    this.ctx = ctx;

    this.resize();
    this.initParticles();
  }

  public resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.scale(dpr, dpr);
  }

  private initParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 1. Soft Glowing Bokeh Orbs (fills background empty spaces with warm atmospheric ambient light)
    const orbColors = [
      'rgba(254, 215, 170, ', // soft amber/warm orange
      'rgba(254, 205, 211, ', // soft rose pink
      'rgba(253, 230, 138, ', // soft gold
      'rgba(233, 213, 255, ', // soft lavender
      'rgba(251, 146, 60,  ', // peach
    ];
    this.bokehOrbs = Array.from({ length: 12 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 40 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      color: orbColors[Math.floor(Math.random() * orbColors.length)],
      opacity: 0.08 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2
    }));

    // 2. Petals (24 petals)
    this.petals = Array.from({ length: 24 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 6 + Math.random() * 9,
      speedY: 0.3 + Math.random() * 0.7,
      speedX: -0.2 + Math.random() * 0.4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      color: Math.random() > 0.4 ? 'rgba(251, 191, 36, 0.7)' : 'rgba(251, 113, 133, 0.65)',
      opacity: 0.5 + Math.random() * 0.4
    }));

    // 3. Sparkles & Twinkling Stars (35 sparkles)
    this.sparkles = Array.from({ length: 35 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 1.5 + Math.random() * 3,
      maxOpacity: 0.35 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.035
    }));

    // 4. Floating Hearts (10 hearts)
    this.hearts = Array.from({ length: 10 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h + h,
      size: 9 + Math.random() * 11,
      speedY: 0.35 + Math.random() * 0.55,
      speedX: -0.15 + Math.random() * 0.3,
      opacity: 0.35 + Math.random() * 0.5,
      scale: 0.75 + Math.random() * 0.45
    }));

    // 5. Balloons (5 soft pastel balloons)
    const balloonColors = ['rgba(253, 164, 175, 0.75)', 'rgba(254, 215, 170, 0.75)', 'rgba(253, 230, 138, 0.75)', 'rgba(233, 213, 255, 0.75)', 'rgba(196, 240, 227, 0.75)'];
    this.balloons = Array.from({ length: 5 }, (_, i) => ({
      x: (w / 6) * (i + 1) + (Math.random() - 0.5) * 70,
      y: h + 80 + i * 160,
      size: 22 + Math.random() * 8,
      speedY: 0.3 + Math.random() * 0.35,
      swayPhase: Math.random() * Math.PI * 2,
      color: balloonColors[i % balloonColors.length],
      stringLength: 35 + Math.random() * 15
    }));

    // 6. Floating Music Notes (♪, ♫, ♬, ♩)
    const noteSymbols = ['♪', '♫', '♬', '♩'];
    this.musicNotes = Array.from({ length: 8 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      symbol: noteSymbols[Math.floor(Math.random() * noteSymbols.length)],
      size: 14 + Math.random() * 10,
      speedY: 0.25 + Math.random() * 0.45,
      swayPhase: Math.random() * Math.PI * 2,
      opacity: 0.25 + Math.random() * 0.4,
      rot: (Math.random() - 0.5) * 0.4
    }));

    // 7. Floating Blossoms / Flowers (6 whole small flower blossoms)
    this.flowers = Array.from({ length: 6 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 7 + Math.random() * 6,
      speedY: 0.2 + Math.random() * 0.4,
      speedX: -0.15 + Math.random() * 0.3,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      petalsCount: 5,
      color: Math.random() > 0.5 ? 'rgba(252, 165, 165, 0.75)' : 'rgba(253, 224, 71, 0.75)',
      centerColor: '#f59e0b'
    }));

    // 8. Soft Drifting Clouds (3 background clouds)
    this.clouds = Array.from({ length: 3 }, (_, i) => ({
      x: (w / 3) * i + Math.random() * 100,
      y: 40 + Math.random() * 180,
      scale: 0.7 + Math.random() * 0.6,
      speedX: 0.15 + Math.random() * 0.25,
      opacity: 0.25 + Math.random() * 0.2
    }));

    // 9. Fluttering Butterflies (3 butterflies)
    const butterflyColors = ['rgba(251, 146, 60, 0.85)', 'rgba(244, 114, 182, 0.85)', 'rgba(250, 204, 21, 0.85)'];
    this.butterflies = Array.from({ length: 3 }, (_, i) => ({
      x: Math.random() * w,
      y: 120 + Math.random() * (h * 0.6),
      speedX: 0.6 + Math.random() * 0.8,
      speedY: (Math.random() - 0.5) * 0.4,
      wingPhase: Math.random() * Math.PI * 2,
      color: butterflyColors[i % butterflyColors.length],
      size: 10 + Math.random() * 4
    }));

    // 10. Shooting Star & Bird Schedule
    this.shootingStar.nextTime = performance.now() + 3000;
    this.bird.nextSpawnTime = performance.now() + 5000;
  }

  public start() {
    this.loop();
  }

  private loop = () => {
    const now = performance.now();
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.ctx.clearRect(0, 0, w, h);

    // 1. Draw Soft Glowing Bokeh Orbs
    this.bokehOrbs.forEach((orb) => {
      orb.x += orb.vx;
      orb.y += orb.vy;
      orb.phase += 0.01;

      if (orb.x < -orb.radius) orb.x = w + orb.radius;
      if (orb.x > w + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = h + orb.radius;
      if (orb.y > h + orb.radius) orb.y = -orb.radius;

      const currentOpacity = orb.opacity + Math.sin(orb.phase) * 0.03;

      const gradient = this.ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, orb.radius
      );
      gradient.addColorStop(0, `${orb.color}${Math.max(0, currentOpacity)})`);
      gradient.addColorStop(1, `${orb.color}0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 2. Draw Drifting Clouds
    this.clouds.forEach((cloud) => {
      cloud.x += cloud.speedX;
      if (cloud.x > w + 180) {
        cloud.x = -180;
        cloud.y = 40 + Math.random() * 180;
      }

      this.ctx.save();
      this.ctx.translate(cloud.x, cloud.y);
      this.ctx.scale(cloud.scale, cloud.scale);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;

      this.ctx.beginPath();
      this.ctx.arc(0, 0, 30, 0, Math.PI * 2);
      this.ctx.arc(25, -15, 25, 0, Math.PI * 2);
      this.ctx.arc(50, 0, 30, 0, Math.PI * 2);
      this.ctx.arc(25, 10, 20, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();
    });

    // 3. Draw Sparkles & Twinkling Stars
    this.sparkles.forEach((s) => {
      s.phase += s.speed;
      const opacity = Math.abs(Math.sin(s.phase)) * s.maxOpacity;
      this.ctx.fillStyle = `rgba(253, 224, 71, ${opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();

      if (opacity > 0.35) {
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.85})`;
        this.ctx.lineWidth = 0.9;
        this.ctx.beginPath();
        this.ctx.moveTo(s.x - s.size * 2.2, s.y);
        this.ctx.lineTo(s.x + s.size * 2.2, s.y);
        this.ctx.moveTo(s.x, s.y - s.size * 2.2);
        this.ctx.lineTo(s.x, s.y + s.size * 2.2);
        this.ctx.stroke();
      }
    });

    // 4. Draw Shooting Star
    if (!this.shootingStar.active && now > this.shootingStar.nextTime) {
      this.shootingStar.active = true;
      this.shootingStar.x = Math.random() * (w * 0.7);
      this.shootingStar.y = Math.random() * (h * 0.3);
      this.shootingStar.vx = 8 + Math.random() * 4;
      this.shootingStar.vy = 4 + Math.random() * 3;
      this.shootingStar.length = 80 + Math.random() * 60;
      this.shootingStar.opacity = 0.9;
    }

    if (this.shootingStar.active) {
      const ss = this.shootingStar;
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.opacity -= 0.02;

      if (ss.opacity <= 0 || ss.x > w || ss.y > h) {
        ss.active = false;
        ss.nextTime = now + 6000 + Math.random() * 8000;
      } else {
        const tailX = ss.x - (ss.vx / Math.hypot(ss.vx, ss.vy)) * ss.length;
        const tailY = ss.y - (ss.vy / Math.hypot(ss.vx, ss.vy)) * ss.length;

        const grad = this.ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        grad.addColorStop(0.3, `rgba(253, 224, 71, ${ss.opacity * 0.8})`);
        grad.addColorStop(1, 'rgba(253, 224, 71, 0)');

        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(ss.x, ss.y);
        this.ctx.lineTo(tailX, tailY);
        this.ctx.stroke();

        // Bright star head
        this.ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(ss.x, ss.y, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // 5. Draw Petals
    this.petals.forEach((p) => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.012) * 0.6 + p.speedX;
      p.rot += p.rotSpeed;

      if (p.y > h + 20) {
        p.y = -20;
        p.x = Math.random() * w;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot);
      this.ctx.fillStyle = p.color;

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // 6. Draw Whole Flower Blossoms
    this.flowers.forEach((fl) => {
      fl.y += fl.speedY;
      fl.x += Math.sin(fl.y * 0.015) * 0.5 + fl.speedX;
      fl.rot += fl.rotSpeed;

      if (fl.y > h + 30) {
        fl.y = -30;
        fl.x = Math.random() * w;
      }

      this.ctx.save();
      this.ctx.translate(fl.x, fl.y);
      this.ctx.rotate(fl.rot);

      // Draw Petals
      this.ctx.fillStyle = fl.color;
      for (let i = 0; i < fl.petalsCount; i++) {
        const angle = (i * 2 * Math.PI) / fl.petalsCount;
        this.ctx.save();
        this.ctx.rotate(angle);
        this.ctx.beginPath();
        this.ctx.ellipse(0, -fl.size * 0.7, fl.size * 0.4, fl.size * 0.7, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      // Center disc
      this.ctx.fillStyle = fl.centerColor;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, fl.size * 0.35, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });

    // 7. Draw Floating Hearts
    this.hearts.forEach((ht) => {
      ht.y -= ht.speedY;
      ht.x += Math.sin(ht.y * 0.02) * 0.35;

      if (ht.y < -30) {
        ht.y = h + 30;
        ht.x = Math.random() * w;
      }

      this.ctx.save();
      this.ctx.translate(ht.x, ht.y);
      this.ctx.scale(ht.scale, ht.scale);
      this.ctx.fillStyle = `rgba(244, 63, 94, ${ht.opacity})`;

      this.ctx.beginPath();
      const topCurveHeight = ht.size * 0.3;
      this.ctx.moveTo(0, topCurveHeight);
      this.ctx.bezierCurveTo(0, 0, -ht.size / 2, 0, -ht.size / 2, topCurveHeight);
      this.ctx.bezierCurveTo(-ht.size / 2, (ht.size + topCurveHeight) / 2, 0, ht.size, 0, ht.size);
      this.ctx.bezierCurveTo(0, ht.size, ht.size / 2, (ht.size + topCurveHeight) / 2, ht.size / 2, topCurveHeight);
      this.ctx.bezierCurveTo(ht.size / 2, 0, 0, 0, 0, topCurveHeight);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    });

    // 8. Draw Music Notes
    this.musicNotes.forEach((mn) => {
      mn.y -= mn.speedY;
      mn.swayPhase += 0.02;
      const swayX = mn.x + Math.sin(mn.swayPhase) * 15;

      if (mn.y < -40) {
        mn.y = h + 40;
        mn.x = Math.random() * w;
      }

      this.ctx.save();
      this.ctx.translate(swayX, mn.y);
      this.ctx.rotate(mn.rot);
      this.ctx.font = `${mn.size}px serif`;
      this.ctx.fillStyle = `rgba(217, 119, 6, ${mn.opacity})`;
      this.ctx.fillText(mn.symbol, 0, 0);
      this.ctx.restore();
    });

    // 9. Draw Balloons
    this.balloons.forEach((b) => {
      b.y -= b.speedY;
      b.swayPhase += 0.015;
      const swayX = b.x + Math.sin(b.swayPhase) * 12;

      if (b.y < -120) {
        b.y = h + 120;
        b.x = Math.random() * w;
      }

      this.ctx.save();
      // Balloon body
      this.ctx.fillStyle = b.color;
      this.ctx.beginPath();
      this.ctx.ellipse(swayX, b.y, b.size * 0.85, b.size, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Balloon highlight
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      this.ctx.beginPath();
      this.ctx.ellipse(swayX - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.25, b.size * 0.35, -Math.PI / 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Balloon knot
      this.ctx.fillStyle = b.color;
      this.ctx.beginPath();
      this.ctx.arc(swayX, b.y + b.size, 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Balloon string
      this.ctx.strokeStyle = 'rgba(160, 150, 140, 0.5)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(swayX, b.y + b.size);
      this.ctx.bezierCurveTo(
        swayX - 8, b.y + b.size + b.stringLength * 0.5,
        swayX + 8, b.y + b.size + b.stringLength * 0.7,
        swayX, b.y + b.size + b.stringLength
      );
      this.ctx.stroke();

      this.ctx.restore();
    });

    // 10. Draw Butterflies
    this.butterflies.forEach((bf) => {
      bf.x += bf.speedX;
      bf.y += Math.sin(bf.x * 0.03) * 0.8 + bf.speedY;
      bf.wingPhase += 0.18;

      if (bf.x > w + 40) {
        bf.x = -40;
        bf.y = 120 + Math.random() * (h * 0.6);
      }

      const wingScale = Math.abs(Math.sin(bf.wingPhase));

      this.ctx.save();
      this.ctx.translate(bf.x, bf.y);
      this.ctx.fillStyle = bf.color;

      // Left wing
      this.ctx.beginPath();
      this.ctx.ellipse(-bf.size * 0.6 * wingScale, 0, bf.size * 0.6 * wingScale, bf.size * 0.9, Math.PI / 6, 0, Math.PI * 2);
      this.ctx.fill();

      // Right wing
      this.ctx.beginPath();
      this.ctx.ellipse(bf.size * 0.6 * wingScale, 0, bf.size * 0.6 * wingScale, bf.size * 0.9, -Math.PI / 6, 0, Math.PI * 2);
      this.ctx.fill();

      // Body
      this.ctx.fillStyle = 'rgba(70, 50, 40, 0.8)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, 1.8, bf.size * 0.7, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });

    // 11. Draw Flying Bird
    if (!this.bird.active && now > this.bird.nextSpawnTime) {
      this.bird.active = true;
      this.bird.x = -60;
      this.bird.y = 80 + Math.random() * (h * 0.35);
      this.bird.speedX = 1.6 + Math.random() * 1.2;
    }

    if (this.bird.active) {
      this.bird.x += this.bird.speedX;
      this.bird.wingPhase += 0.12;

      if (this.bird.x > w + 60) {
        this.bird.active = false;
        this.bird.nextSpawnTime = now + 12000 + Math.random() * 10000;
      }

      const wingY = Math.sin(this.bird.wingPhase) * 8;

      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(80, 70, 60, 0.65)';
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';

      this.ctx.beginPath();
      this.ctx.moveTo(this.bird.x - this.bird.size, this.bird.y + wingY);
      this.ctx.quadraticCurveTo(this.bird.x - this.bird.size / 2, this.bird.y - 6, this.bird.x, this.bird.y);
      this.ctx.quadraticCurveTo(this.bird.x + this.bird.size / 2, this.bird.y - 6, this.bird.x + this.bird.size, this.bird.y + wingY);
      this.ctx.stroke();

      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(this.loop);
  };

  public stop() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
