"use client";

import { useEffect, useRef } from "react";

/*
 * A small, honest SLAM illustration: a drone flies a serpentine route through a
 * maze, casts 2D LiDAR rays against the walls, and an occupancy grid is revealed
 * from the hits (free space along each ray, occupied cells at the hit point).
 * World units are metres-like; the canvas scales them to its size.
 */

type Seg = [number, number, number, number];

const W = 12;
const H = 8;

const WALLS: Seg[] = [
  // outer box
  [0, 0, 12, 0], [12, 0, 12, 8], [12, 8, 0, 8], [0, 8, 0, 0],
  // serpentine corridors
  [0, 2, 9, 2], [3, 4, 12, 4], [0, 6, 9, 6],
  // stubs and a small room so the map has features
  [6, 0, 6, 0.6], [4.5, 6, 4.5, 6.7], [8, 4, 8, 4.6], [2, 2, 2, 2.7],
  [10.2, 5.2, 11.2, 5.2], [11.2, 5.2, 11.2, 5.6],
];

const ROUTE: [number, number][] = [
  [1, 7], [10.5, 7], [10.5, 5], [1.5, 5], [1.5, 3], [10.5, 3], [10.5, 1], [1, 1],
];

const RAYS = 120;
const RANGE = 4.5;
const CELL = 0.1; // grid resolution in world units
const SPEED = 1.6; // world units per second

function hit(ox: number, oy: number, dx: number, dy: number): number {
  let best = RANGE;
  for (const [x1, y1, x2, y2] of WALLS) {
    const ex = x2 - x1;
    const ey = y2 - y1;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - ox) * ey - (y1 - oy) * ex) / den;
    const u = ((x1 - ox) * dy - (y1 - oy) * dx) / den;
    if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
  }
  return best;
}

export default function LidarMap({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GW = Math.round(W / CELL);
    const GH = Math.round(H / CELL);
    let grid = new Uint8Array(GW * GH); // 0 unknown, 1 free, 2 occupied

    const map = document.createElement("canvas");
    map.width = GW;
    map.height = GH;
    const mctx = map.getContext("2d")!;
    const img = mctx.createImageData(GW, GH);

    let seg = 0;
    let s = 0;
    let x = ROUTE[0][0];
    let y = ROUTE[0][1];
    let heading = 0;
    const trail: [number, number][] = [];
    let last = performance.now();
    let raf = 0;
    let visible = true;
    let lap = 0;

    const paint = (i: number, v: number) => {
      if (grid[i] === 2 || grid[i] === v) return;
      grid[i] = v;
      const p = i * 4;
      if (v === 1) {
        img.data[p] = 159; img.data[p + 1] = 211; img.data[p + 2] = 199; img.data[p + 3] = 26;
      } else {
        img.data[p] = 230; img.data[p + 1] = 230; img.data[p + 2] = 230; img.data[p + 3] = 255;
      }
    };

    const scan = () => {
      for (let k = 0; k < RAYS; k++) {
        const a = (k / RAYS) * Math.PI * 2;
        const dx = Math.cos(a);
        const dy = Math.sin(a);
        const d = hit(x, y, dx, dy);
        for (let t = 0; t < d - CELL; t += CELL * 0.8) {
          const gx = Math.floor((x + dx * t) / CELL);
          const gy = Math.floor((y + dy * t) / CELL);
          if (gx >= 0 && gy >= 0 && gx < GW && gy < GH) paint(gy * GW + gx, 1);
        }
        if (d < RANGE) {
          const gx = Math.floor((x + dx * (d - 0.01)) / CELL);
          const gy = Math.floor((y + dy * (d - 0.01)) / CELL);
          if (gx >= 0 && gy >= 0 && gx < GW && gy < GH) paint(gy * GW + gx, 2);
        }
      }
      mctx.putImageData(img, 0, 0);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
    };

    const step = (dt: number) => {
      const [ax, ay] = ROUTE[seg];
      const [bx, by] = ROUTE[(seg + 1) % ROUTE.length];
      const len = Math.hypot(bx - ax, by - ay);
      s += SPEED * dt;
      if (s >= len) {
        s -= len;
        seg = (seg + 1) % ROUTE.length;
        if (seg === 0) {
          lap++;
          if (lap % 2 === 0) {
            grid = new Uint8Array(GW * GH);
            img.data.fill(0);
            trail.length = 0;
          }
        }
      }
      const [cx, cy] = ROUTE[seg];
      const [nx, ny] = ROUTE[(seg + 1) % ROUTE.length];
      const l = Math.hypot(nx - cx, ny - cy) || 1;
      x = cx + ((nx - cx) * Math.min(s, l)) / l;
      y = cy + ((ny - cy) * Math.min(s, l)) / l;
      const target = Math.atan2(ny - cy, nx - cx);
      let diff = target - heading;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      heading += diff * Math.min(1, dt * 6);
      trail.push([x, y]);
      if (trail.length > 900) trail.shift();
    };

    const draw = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      const sc = Math.min(cw / W, ch / H);
      const ox = (cw - W * sc) / 2;
      const oy = (ch - H * sc) / 2;
      ctx.clearRect(0, 0, cw, ch);

      // revealed occupancy grid
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(map, ox, oy, W * sc, H * sc);

      // current rays
      ctx.lineWidth = Math.max(1, sc * 0.008);
      ctx.strokeStyle = "rgba(230,230,230,0.12)";
      ctx.beginPath();
      for (let k = 0; k < RAYS; k += 2) {
        const a = (k / RAYS) * Math.PI * 2;
        const d = hit(x, y, Math.cos(a), Math.sin(a));
        ctx.moveTo(ox + x * sc, oy + y * sc);
        ctx.lineTo(ox + (x + Math.cos(a) * d) * sc, oy + (y + Math.sin(a) * d) * sc);
      }
      ctx.stroke();

      // trail
      ctx.strokeStyle = "rgba(232,200,114,0.85)";
      ctx.lineWidth = Math.max(1, sc * 0.02);
      ctx.beginPath();
      trail.forEach(([tx, ty], i) => {
        const px = ox + tx * sc;
        const py = oy + ty * sc;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // drone (quad-X)
      const px = ox + x * sc;
      const py = oy + y * sc;
      const r = sc * 0.16;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(heading);
      ctx.strokeStyle = "#e6e6e6";
      ctx.lineWidth = Math.max(1, sc * 0.025);
      ctx.beginPath();
      ctx.moveTo(-r, -r); ctx.lineTo(r, r);
      ctx.moveTo(-r, r); ctx.lineTo(r, -r);
      ctx.stroke();
      ctx.fillStyle = "#0a0f1a";
      for (const [mx, my] of [[-r, -r], [r, r], [-r, r], [r, -r]]) {
        ctx.beginPath();
        ctx.arc(mx, my, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = "#e8c872";
      ctx.beginPath();
      ctx.arc(r * 0.55, 0, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        step(dt);
        scan();
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    if (reduce) {
      // static: reveal the whole route once and draw a single frame
      for (let i = 0; i < 1400; i++) {
        step(0.03);
        if (i % 4 === 0) scan();
      }
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label="Animation of a drone mapping a maze with 2D LiDAR: rays sweep the walls and an occupancy map is revealed."
    />
  );
}
