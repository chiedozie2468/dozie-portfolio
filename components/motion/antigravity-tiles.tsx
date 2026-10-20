"use client";

import { useEffect, useRef } from "react";

// Full spectrum of vibrant colors including greens, blues, yellows, oranges, reds, purples, cyan, pink
const PALETTE = [
  "#22C55E", // Green
  "#10B981", // Emerald
  "#84CC16", // Lime Green
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#FACC15", // Yellow
  "#F97316", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
] as const;

interface MicroParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  color: string;
  alpha: number;
  length: number;
  thickness: number;
}

interface AntigravityTilesProps {
  className?: string;
}

/**
 * Very tiny multi-colored micro-particles that appear ONLY while the mouse is actively moving,
 * trailing and scattering gently along the cursor path and fading out completely when the mouse stops.
 */
export function AntigravityTiles({ className = "" }: AntigravityTilesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let lastX = -9999;
    let lastY = -9999;
    let colorCycle = 0;
    const particles: MicroParticle[] = [];

    const updateCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize, { passive: true });

    const spawnTinyParticles = (x: number, y: number, dx: number, dy: number) => {
      const speed = Math.hypot(dx, dy);
      const baseAngle = Math.atan2(dy, dx);
      const count = Math.min(5, Math.max(2, Math.floor(speed / 5)));

      for (let i = 0; i < count; i++) {
        const spreadRadius = (Math.random() - 0.5) * 28;
        const spreadAngle = baseAngle + Math.PI / 2 + (Math.random() - 0.5) * 0.8;

        particles.push({
          x: x + Math.cos(spreadAngle) * spreadRadius + (Math.random() - 0.5) * 8,
          y: y + Math.sin(spreadAngle) * spreadRadius + (Math.random() - 0.5) * 8,
          vx: dx * 0.05 + (Math.random() - 0.5) * 0.7,
          vy: dy * 0.05 + (Math.random() - 0.5) * 0.7,
          angle: baseAngle + (Math.random() - 0.5) * 1.4,
          vAngle: (Math.random() - 0.5) * 0.04,
          color: PALETTE[colorCycle % PALETTE.length],
          alpha: 0.85 + Math.random() * 0.15,
          // Very tiny micro-tiles (2.8px - 4.5px long, 1.1px - 1.5px thin)
          length: 2.8 + Math.random() * 1.7,
          thickness: 1.1 + Math.random() * 0.4,
        });
        colorCycle += 1;
      }

      if (particles.length > 160) {
        particles.splice(0, particles.length - 160);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (lastX === -9999) {
        lastX = x;
        lastY = y;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);

      lastX = x;
      lastY = y;

      // Only spawn when the mouse is actively moving
      if (dist > 2) {
        spawnTinyParticles(x, y, dx, dy);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.angle += p.vAngle;
        p.alpha *= 0.93;

        if (p.alpha < 0.03) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(
          -p.length / 2,
          -p.thickness / 2,
          p.length,
          p.thickness,
          p.thickness / 2
        );
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-30 ${className}`}
    />
  );
}
