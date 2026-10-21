"use client";

import { useEffect, useRef } from "react";

// Vibrant multi-color spectrum for scattered micro-particles
const PALETTE = [
  "#22C55E", // Green
  "#10B981", // Emerald
  "#84CC16", // Lime Green
  "#38BDF8", // Sky Blue
  "#3B82F6", // Royal Blue
  "#06B6D4", // Cyan
  "#FACC15", // Gold Yellow
  "#F59E0B", // Amber
  "#F97316", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
] as const;

const NUM_COLORS = PALETTE.length;
const MAX_PARTICLES = 2400;

interface AntigravityTilesProps {
  className?: string;
}

/**
 * "7million" density multi-colored micro-particles scattered widely in a large
 * circular field around the cursor so plenty of colorful specks appear while
 * staying generously spaced out so text and images always show clearly.
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

    const px = new Float32Array(MAX_PARTICLES);
    const py = new Float32Array(MAX_PARTICLES);
    const pvx = new Float32Array(MAX_PARTICLES);
    const pvy = new Float32Array(MAX_PARTICLES);
    const pAngle = new Float32Array(MAX_PARTICLES);
    const pvAngle = new Float32Array(MAX_PARTICLES);
    const pLength = new Float32Array(MAX_PARTICLES);
    const pAlpha = new Float32Array(MAX_PARTICLES);
    const pDecay = new Float32Array(MAX_PARTICLES);
    const pColor = new Uint8Array(MAX_PARTICLES);
    const pActive = new Uint8Array(MAX_PARTICLES);

    let head = 0;
    let activeCount = 0;
    let colorCycle = 0;

    let lastX = -9999;
    let lastY = -9999;

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

    const spawnScatteredRing = (
      cx: number,
      cy: number,
      dx: number,
      dy: number,
      count: number
    ) => {
      // Evenly distribute angles around a circle with random jitter so specks are widely scattered
      const baseTheta = Math.random() * Math.PI * 2;
      for (let i = 0; i < count; i++) {
        const idx = head;
        head = (head + 1) % MAX_PARTICLES;
        if (pActive[idx] === 0) {
          pActive[idx] = 1;
          activeCount += 1;
        }

        const theta =
          baseTheta +
          (i / count) * Math.PI * 2 +
          (Math.random() - 0.5) * ((Math.PI * 1.6) / count);
        // Wide circular scatter (45px inner clearance out to 335px radius) so many specks appear while staying spaced out
        const r = 45 + Math.sqrt(Math.random()) * 290;
        const outwardSpeed = 0.7 + Math.random() * 2.1;

        px[idx] = cx + Math.cos(theta) * r;
        py[idx] = cy + Math.sin(theta) * r;
        pvx[idx] =
          dx * 0.025 +
          Math.cos(theta) * outwardSpeed +
          (Math.random() - 0.5) * 0.65;
        pvy[idx] =
          dy * 0.025 +
          Math.sin(theta) * outwardSpeed +
          (Math.random() - 0.5) * 0.65;
        pAngle[idx] = theta + Math.PI * 0.5 + (Math.random() - 0.5) * 0.7;
        pvAngle[idx] = (Math.random() - 0.5) * 0.06;
        pLength[idx] = 1.8 + Math.random() * 1.6;
        pAlpha[idx] = 0.65 + Math.random() * 0.3;
        pDecay[idx] = 0.955 + Math.random() * 0.028;
        pColor[idx] = colorCycle % NUM_COLORS;
        colorCycle += 1;
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

      if (dist > 4) {
        const count = Math.min(44, Math.max(22, Math.floor(dist * 0.85)));
        spawnScatteredRing(x, y, dx, dy, count);
        lastX = x;
        lastY = y;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (activeCount > 0) {
        ctx.lineWidth = 1.1;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.62;

        for (let c = 0; c < NUM_COLORS; c++) {
          ctx.strokeStyle = PALETTE[c];
          ctx.beginPath();
          let hasAnyInColor = false;

          for (let i = 0; i < MAX_PARTICLES; i++) {
            if (pActive[i] === 0 || pColor[i] !== c) continue;

            const nextAlpha = pAlpha[i] * pDecay[i];
            if (nextAlpha < 0.04) {
              pActive[i] = 0;
              activeCount -= 1;
              continue;
            }

            pAlpha[i] = nextAlpha;
            const nx = px[i] + pvx[i];
            const ny = py[i] + pvy[i];
            px[i] = nx;
            py[i] = ny;
            pvx[i] *= 0.94;
            pvy[i] *= 0.94;
            const ang = pAngle[i] + pvAngle[i];
            pAngle[i] = ang;

            const halfLen = pLength[i] * 0.5 * nextAlpha;
            const hx = Math.cos(ang) * halfLen;
            const hy = Math.sin(ang) * halfLen;

            ctx.moveTo(nx - hx, ny - hy);
            ctx.lineTo(nx + hx, ny + hy);
            hasAnyInColor = true;
          }

          if (hasAnyInColor) {
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
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
      className={`pointer-events-none fixed inset-0 z-40 ${className}`}
    />
  );
}
