"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3; // covers full scroll
    }

    function draw() {
      if (!canvas || !ctx) return;
      const isDark = resolvedTheme === "dark";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base gradient
      const base = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (isDark) {
        base.addColorStop(0, "#0a0a0f");
        base.addColorStop(0.4, "#0f0a1a");
        base.addColorStop(0.7, "#0a0f1a");
        base.addColorStop(1, "#050510");
      } else {
        base.addColorStop(0, "#f8f7ff");
        base.addColorStop(0.4, "#f0eeff");
        base.addColorStop(0.7, "#eff6ff");
        base.addColorStop(1, "#fafafa");
      }
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Breathing orbs
      const orbs = [
        {
          x: canvas.width * 0.15 + Math.sin(t * 0.3) * 60,
          y: canvas.height * 0.12 + Math.cos(t * 0.2) * 40,
          r: 380,
          color: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.07)",
        },
        {
          x: canvas.width * 0.8 + Math.cos(t * 0.25) * 50,
          y: canvas.height * 0.08 + Math.sin(t * 0.35) * 30,
          r: 300,
          color: isDark ? "rgba(139,92,246,0.10)" : "rgba(139,92,246,0.06)",
        },
        {
          x: canvas.width * 0.5 + Math.sin(t * 0.2) * 80,
          y: canvas.height * 0.3 + Math.cos(t * 0.15) * 60,
          r: 500,
          color: isDark ? "rgba(59,130,246,0.07)" : "rgba(59,130,246,0.04)",
        },
        {
          x: canvas.width * 0.1 + Math.cos(t * 0.4) * 40,
          y: canvas.height * 0.55 + Math.sin(t * 0.3) * 50,
          r: 350,
          color: isDark ? "rgba(245,158,11,0.06)" : "rgba(245,158,11,0.04)",
        },
      ];

      orbs.forEach((orb) => {
        const g = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.r
        );
        g.addColorStop(0, orb.color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Subtle grid lines (dark mode only)
      if (isDark) {
        ctx.strokeStyle = "rgba(99,102,241,0.03)";
        ctx.lineWidth = 1;
        const gridSize = 80;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      t += 0.005;
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}