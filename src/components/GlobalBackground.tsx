"use client";

import { useEffect, useRef } from "react";

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Slow motion speeds
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update(mouseX: number | null, mouseY: number | null) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Keep within bounds
        if (this.x < 0) this.x = 0;
        if (this.x > width) this.x = width;
        if (this.y < 0) this.y = 0;
        if (this.y > height) this.y = height;

        // Mouse interaction (repulsion)
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const forceRadius = 150;

          if (dist < forceRadius) {
            const force = (forceRadius - dist) / forceRadius; // 0 to 1
            const angle = Math.atan2(dy, dx);
            // Move away from mouse
            this.x += Math.cos(angle) * force * 1.5;
            this.y += Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(251, 58, 93, 0.4)"; // Soft red coral color
        ctx.fill();
      }
    }

    // Initialize particles
    const particleCount = Math.min(80, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Track mouse
    let mouseX: number | null = null;
    let mouseY: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = null;
      mouseY = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    const drawPlexus = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid overlay
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw active scanner beam (horizontal sweep)
      const sweepY = (Date.now() / 25) % (height + 200) - 100;
      if (sweepY > 0 && sweepY < height) {
        const sweepGrad = ctx.createLinearGradient(0, sweepY - 40, 0, sweepY + 40);
        sweepGrad.addColorStop(0, "rgba(251, 58, 93, 0.0)");
        sweepGrad.addColorStop(0.5, "rgba(251, 58, 93, 0.02)");
        sweepGrad.addColorStop(1, "rgba(251, 58, 93, 0.0)");
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, sweepY - 40, width, 80);

        // Thin glowing line in the center of sweep
        ctx.strokeStyle = "rgba(251, 58, 93, 0.06)";
        ctx.beginPath();
        ctx.moveTo(0, sweepY);
        ctx.lineTo(width, sweepY);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.update(mouseX, mouseY);
        p.draw();
      });

      // Connect particles within range
      const connectionDist = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.12; // Fades with distance
            ctx.strokeStyle = `rgba(251, 58, 93, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw line from mouse to nearby particles
      if (mouseX !== null && mouseY !== null) {
        const mouseRange = 180;
        particles.forEach((p) => {
          const dx = p.x - mouseX!;
          const dy = p.y - mouseY!;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRange) {
            const alpha = (1 - dist / mouseRange) * 0.15;
            ctx.strokeStyle = `rgba(251, 58, 93, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX!, mouseY!);
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(drawPlexus);
    };

    drawPlexus();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-50 bg-[#0a0a0a]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
