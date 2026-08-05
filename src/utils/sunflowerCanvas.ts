// High-performance 60 FPS Sunflower Bloom Canvas Engine

export interface BloomOptions {
  onBloomComplete: () => void;
}

export class SunflowerBloomEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private startTime: number = 0;
  private offscreenSunflower: HTMLCanvasElement | null = null;
  private onComplete: (() => void) | null = null;

  private phase: 'initial_two' | 'expanding' | 'full_screen_alive' | 'zoom_center' | 'done' = 'initial_two';
  private phaseStartTime: number = 0;

  // Flowers array
  private flowers: Array<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    scale: number;
    targetScale: number;
    rotation: number;
    rotSpeed: number;
    breathPhase: number;
    breathSpeed: number;
    glowOpacity: number;
    origin: 'left' | 'right' | 'spiral';
    spawnDelay: number;
    floatOffsetX: number;
    floatOffsetY: number;
  }> = [];

  constructor(canvas: HTMLCanvasElement, options?: BloomOptions) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error("Canvas 2D context not available");
    this.ctx = ctx;
    this.onComplete = options?.onBloomComplete || null;

    this.initSunflowerTexture();
    this.resize();
  }

  // Pre-render a high-definition vibrant Sunflower Face
  private initSunflowerTexture() {
    const size = 300;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = size;
    offCanvas.height = size;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;

    // Outer rich golden glow
    const glowGrad = ctx.createRadialGradient(cx, cy, cx * 0.35, cx, cy, cx);
    glowGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    glowGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.2)');
    glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, cx, 0, Math.PI * 2);
    ctx.fill();

    // Petals (Outer tier - 36 petals, Inner tier - 36 petals)
    const totalPetals = 36;
    const outerRadius = size * 0.48;
    const innerRadius = size * 0.22;

    // Draw outer petals layer with vibrant solid golden gradients
    ctx.save();
    for (let i = 0; i < totalPetals; i++) {
      const angle = (i * Math.PI * 2) / totalPetals;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      const grad = ctx.createLinearGradient(0, innerRadius, 0, outerRadius);
      grad.addColorStop(0, '#d97706');   // Warm amber base
      grad.addColorStop(0.3, '#f59e0b'); // Rich golden orange
      grad.addColorStop(0.75, '#fbbf24'); // Vibrant sunflower yellow
      grad.addColorStop(1, '#fde047');   // Bright yellow tip

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, innerRadius);
      ctx.bezierCurveTo(-16, innerRadius + 20, -14, outerRadius - 10, 0, outerRadius);
      ctx.bezierCurveTo(14, outerRadius - 10, 16, innerRadius + 20, 0, innerRadius);
      ctx.closePath();
      ctx.fill();

      // Petal texture crease line
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, innerRadius + 4);
      ctx.lineTo(0, outerRadius - 6);
      ctx.stroke();

      ctx.restore();
    }

    // Draw staggered inner petals layer
    for (let i = 0; i < totalPetals; i++) {
      const angle = (i * Math.PI * 2) / totalPetals + Math.PI / totalPetals;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      const grad = ctx.createLinearGradient(0, innerRadius * 0.88, 0, outerRadius * 0.9);
      grad.addColorStop(0, '#b45309');
      grad.addColorStop(0.4, '#d97706');
      grad.addColorStop(0.8, '#f59e0b');
      grad.addColorStop(1, '#fde047');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, innerRadius * 0.88);
      ctx.bezierCurveTo(-14, innerRadius + 12, -12, outerRadius * 0.9 - 8, 0, outerRadius * 0.9);
      ctx.bezierCurveTo(12, outerRadius * 0.9 - 8, 14, innerRadius + 12, 0, innerRadius * 0.88);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();

    // Center disk (Fibonacci spiral seed pattern)
    const diskRadius = innerRadius * 0.95;

    // Base disk gradient
    const diskGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, diskRadius);
    diskGrad.addColorStop(0, '#1c1309');
    diskGrad.addColorStop(0.7, '#381403');
    diskGrad.addColorStop(0.92, '#622708');
    diskGrad.addColorStop(1, '#9a3412');

    ctx.fillStyle = diskGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, diskRadius, 0, Math.PI * 2);
    ctx.fill();

    // Phyllotaxis seed dots
    const GoldenAngle = 137.5 * (Math.PI / 180);
    const totalSeeds = 200;
    for (let i = 0; i < totalSeeds; i++) {
      const r = Math.sqrt(i / totalSeeds) * (diskRadius - 4);
      const theta = i * GoldenAngle;
      const sx = cx + r * Math.cos(theta);
      const sy = cy + r * Math.sin(theta);
      const seedSize = 1.2 + (i / totalSeeds) * 1.6;

      ctx.fillStyle = (i % 2 === 0) ? '#f59e0b' : '#78350f';
      ctx.beginPath();
      ctx.arc(sx, sy, seedSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Soft rim ring highlight on disk
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy, diskRadius - 1, 0, Math.PI * 2);
    ctx.stroke();

    this.offscreenSunflower = offCanvas;
  }

  public resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.scale(dpr, dpr);
  }

  public start() {
    this.phase = 'initial_two';
    this.startTime = performance.now();
    this.phaseStartTime = this.startTime;
    this.setupInitialTwoFlowers();
    this.loop();
  }

  private setupInitialTwoFlowers() {
    this.flowers = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const centerY = h / 2;

    // Flower 1: Left
    this.flowers.push({
      x: -120,
      y: centerY,
      targetX: w * 0.28,
      targetY: centerY,
      scale: 0.1,
      targetScale: 0.9,
      rotation: 0,
      rotSpeed: 0.008,
      breathPhase: 0,
      breathSpeed: 0.03,
      glowOpacity: 0.8,
      origin: 'left',
      spawnDelay: 0,
      floatOffsetX: 0,
      floatOffsetY: 0,
    });

    // Flower 2: Right
    this.flowers.push({
      x: w + 120,
      y: centerY,
      targetX: w * 0.72,
      targetY: centerY,
      scale: 0.1,
      targetScale: 0.9,
      rotation: 0,
      rotSpeed: -0.008,
      breathPhase: Math.PI / 2,
      breathSpeed: 0.03,
      glowOpacity: 0.8,
      origin: 'right',
      spawnDelay: 0,
      floatOffsetX: 0,
      floatOffsetY: 0,
    });
  }

  private generateSpiralBloom() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const centerX = w / 2;
    const centerY = h / 2;

    const goldenAngle = 137.5 * (Math.PI / 180);
    const totalSpiralFlowers = 320; // Massive dense spiral bloom
    const maxDist = Math.hypot(w, h) * 0.85;

    // 1. Fibonacci Spiral Flowers Layer
    for (let i = 0; i < totalSpiralFlowers; i++) {
      const radius = Math.sqrt(i / totalSpiralFlowers) * maxDist;
      const angle = i * goldenAngle;

      const tx = centerX + radius * Math.cos(angle);
      const ty = centerY + radius * Math.sin(angle);

      const jitterX = (Math.random() - 0.5) * 30;
      const jitterY = (Math.random() - 0.5) * 30;

      // Larger scales so sunflowers overlap and completely fill the screen
      const baseScale = 0.75 + Math.random() * 0.65;
      const delay = (radius / maxDist) * 1.4 + Math.random() * 0.15;

      this.flowers.push({
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 20,
        targetX: tx + jitterX,
        targetY: ty + jitterY,
        scale: 0,
        targetScale: baseScale,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        breathPhase: Math.random() * Math.PI * 2,
        breathSpeed: 0.02 + Math.random() * 0.02,
        glowOpacity: 0.7 + Math.random() * 0.3,
        origin: 'spiral',
        spawnDelay: delay,
        floatOffsetX: 0,
        floatOffsetY: 0,
      });
    }

    // 2. Corner & Outer Edge Fillers to guarantee zero background gaps
    const edgeRows = 5;
    const edgeCols = 8;
    for (let r = 0; r < edgeRows; r++) {
      for (let c = 0; c < edgeCols; c++) {
        const tx = (c / (edgeCols - 1)) * w + (Math.random() - 0.5) * 60;
        const ty = (r / (edgeRows - 1)) * h + (Math.random() - 0.5) * 60;

        this.flowers.push({
          x: centerX,
          y: centerY,
          targetX: tx,
          targetY: ty,
          scale: 0,
          targetScale: 0.8 + Math.random() * 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.01,
          breathPhase: Math.random() * Math.PI * 2,
          breathSpeed: 0.02,
          glowOpacity: 0.8,
          origin: 'spiral',
          spawnDelay: 0.6 + Math.random() * 0.8,
          floatOffsetX: 0,
          floatOffsetY: 0,
        });
      }
    }
  }

  private loop = () => {
    const now = performance.now();
    const elapsedSec = (now - this.startTime) / 1000;
    const phaseElapsedSec = (now - this.phaseStartTime) / 1000;

    const w = window.innerWidth;
    const h = window.innerHeight;

    this.ctx.clearRect(0, 0, w, h);

    // Warm golden backdrop that intensifies as bloom fills screen
    if (this.phase === 'expanding' || this.phase === 'full_screen_alive' || this.phase === 'zoom_center') {
      const fillProgress = this.phase === 'expanding' ? Math.min(1, phaseElapsedSec / 2.5) : 1;
      const bgGrad = this.ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h));
      bgGrad.addColorStop(0, `rgba(254, 240, 138, ${0.4 * fillProgress})`);
      bgGrad.addColorStop(0.5, `rgba(251, 191, 36, ${0.35 * fillProgress})`);
      bgGrad.addColorStop(1, `rgba(245, 158, 11, ${0.25 * fillProgress})`);
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, h);
    }

    // Phase Transitions: ensure flowers fully bloom & fill screen before zoom
    if (this.phase === 'initial_two' && phaseElapsedSec >= 1.0) {
      this.phase = 'expanding';
      this.phaseStartTime = now;
      this.generateSpiralBloom();
    } else if (this.phase === 'expanding' && phaseElapsedSec >= 2.5) {
      this.phase = 'full_screen_alive';
      this.phaseStartTime = now;
    } else if (this.phase === 'full_screen_alive' && phaseElapsedSec >= 2.5) {
      this.phase = 'zoom_center';
      this.phaseStartTime = now;
    } else if (this.phase === 'zoom_center' && phaseElapsedSec >= 1.2) {
      this.phase = 'done';
      if (this.onComplete) {
        this.onComplete();
      }
      return;
    }

    // Render & Update Flowers
    this.flowers.forEach((flower) => {
      // Handle spawn delay during expansion
      if (this.phase === 'expanding' && flower.origin === 'spiral') {
        if (phaseElapsedSec < flower.spawnDelay) return;
      }

      // Fast, smooth movement towards target positions
      flower.x += (flower.targetX - flower.x) * 0.14;
      flower.y += (flower.targetY - flower.y) * 0.14;

      // Fast, full opening bloom scale
      if (flower.scale < flower.targetScale) {
        flower.scale += (flower.targetScale - flower.scale) * 0.14;
      }

      // Gentle continuous rotation
      flower.rotation += flower.rotSpeed;

      // Gentle breathing scale variation
      flower.breathPhase += flower.breathSpeed;
      const breathScale = 1 + Math.sin(flower.breathPhase) * 0.035;

      // Floating movement
      flower.floatOffsetX = Math.sin(elapsedSec * 1.5 + flower.breathPhase) * 4;
      flower.floatOffsetY = Math.cos(elapsedSec * 1.2 + flower.rotation) * 4;

      // Draw Flower
      if (this.offscreenSunflower && flower.scale > 0.01) {
        this.ctx.save();

        let renderX = flower.x + flower.floatOffsetX;
        let renderY = flower.y + flower.floatOffsetY;
        let renderScale = flower.scale * breathScale;

        // Extra center zoom during 'zoom_center' phase
        if (this.phase === 'zoom_center') {
          const zoomProgress = Math.min(1, phaseElapsedSec / 0.9);
          const easeZoom = zoomProgress * zoomProgress * (3 - 2 * zoomProgress); // cubic ease
          renderScale *= (1 + easeZoom * 8.0);

          // Focus towards screen center
          renderX += (w / 2 - renderX) * easeZoom * 0.85;
          renderY += (h / 2 - renderY) * easeZoom * 0.85;
        }

        this.ctx.translate(renderX, renderY);
        this.ctx.rotate(flower.rotation);
        this.ctx.scale(renderScale, renderScale);

        // Soft glow shadow
        this.ctx.shadowColor = 'rgba(251, 191, 36, 0.4)';
        this.ctx.shadowBlur = 18 * renderScale;

        const drawSize = 300;
        this.ctx.drawImage(
          this.offscreenSunflower,
          -drawSize / 2,
          -drawSize / 2,
          drawSize,
          drawSize
        );

        this.ctx.restore();
      }
    });

    if (this.phase !== 'done') {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  };

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
