"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/*
 * WebGL hero: a quadrotor flies a fixed route through a 3D maze, casts a 360°
 * 2D LiDAR scan at flight height, and the hit points accumulate into a point
 * cloud map, like watching Cartographer in RViz. Drag to orbit; scrolling the
 * page moves the camera to a top-down view.
 */

type Seg = [number, number, number, number];

const W = 12;
const H = 8;
const WALLS: Seg[] = [
  [0, 0, 12, 0], [12, 0, 12, 8], [12, 8, 0, 8], [0, 8, 0, 0],
  [0, 2, 9, 2], [3, 4, 12, 4], [0, 6, 9, 6],
  [6, 0, 6, 0.6], [4.5, 6, 4.5, 6.7], [8, 4, 8, 4.6], [2, 2, 2, 2.7],
  [10.2, 5.2, 11.2, 5.2], [11.2, 5.2, 11.2, 5.6],
];
const ROUTE: [number, number][] = [
  [1, 7], [10.5, 7], [10.5, 5], [1.5, 5], [1.5, 3], [10.5, 3], [10.5, 1], [1, 1],
];
const RAYS = 180;
const RANGE = 5;
const ALT = 0.7;
const SPEED = 1.3;
const MAX_POINTS = 24000;
const BLUE = new THREE.Color("#3b82f6");

function cast(ox: number, oy: number, dx: number, dy: number) {
  let best = RANGE;
  for (const [x1, y1, x2, y2] of WALLS) {
    const ex = x2 - x1, ey = y2 - y1;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - ox) * ey - (y1 - oy) * ex) / den;
    const u = ((x1 - ox) * dy - (y1 - oy) * dx) / den;
    if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
  }
  return best;
}

export default function Scene3D({ className = "" }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- renderer, scene, camera ----------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 18, 38);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const center = new THREE.Vector3(W / 2, 0, H / 2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(center);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = !reduce;
    controls.autoRotateSpeed = 0.35;
    controls.minPolarAngle = 0.15;
    controls.maxPolarAngle = 1.25;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 10, 6);
    scene.add(key);

    // ---------- floor grid ----------
    const grid = new THREE.GridHelper(24, 48, 0x3a3a3a, 0x222222);
    grid.position.set(W / 2, 0, H / 2);
    scene.add(grid);

    // ---------- maze walls (dark glass with white edges) ----------
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.85, metalness: 0.15, transparent: true, opacity: 0.32, depthWrite: false });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const WALL_H = 1.1;
    const WALL_T = 0.06;
    for (const [x1, y1, x2, y2] of WALLS) {
      const len = Math.hypot(x2 - x1, y2 - y1);
      const geo = new THREE.BoxGeometry(len + WALL_T, WALL_H, WALL_T);
      const m = new THREE.Mesh(geo, wallMat);
      m.position.set((x1 + x2) / 2, WALL_H / 2, (y1 + y2) / 2);
      m.rotation.y = -Math.atan2(y2 - y1, x2 - x1);
      scene.add(m);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
      edges.position.copy(m.position);
      edges.rotation.copy(m.rotation);
      scene.add(edges);
    }

    // ---------- quadrotor ----------
    const drone = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xe5e5e5, roughness: 0.5, metalness: 0.3 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.22), frameMat);
    drone.add(body);
    const lidar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 20), darkMat);
    lidar.position.y = 0.07;
    drone.add(lidar);
    const props: THREE.Mesh[] = [];
    for (const a of [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.025, 0.035), frameMat);
      arm.position.set(Math.cos(a) * 0.18, 0, Math.sin(a) * 0.18);
      arm.rotation.y = -a;
      drone.add(arm);
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 12), darkMat);
      motor.position.set(Math.cos(a) * 0.34, 0.03, Math.sin(a) * 0.34);
      drone.add(motor);
      const prop = new THREE.Mesh(
        new THREE.CircleGeometry(0.13, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
      );
      prop.rotation.x = -Math.PI / 2;
      prop.position.set(Math.cos(a) * 0.34, 0.06, Math.sin(a) * 0.34);
      drone.add(prop);
      props.push(prop);
    }
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 10), new THREE.MeshBasicMaterial({ color: BLUE }));
    led.position.set(0.12, 0, 0);
    drone.add(led);
    scene.add(drone);

    // ---------- LiDAR rays (current scan) ----------
    const rayPos = new Float32Array(RAYS * 2 * 3);
    const rayGeo = new THREE.BufferGeometry();
    rayGeo.setAttribute("position", new THREE.BufferAttribute(rayPos, 3));
    const rays = new THREE.LineSegments(rayGeo, new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 }));
    scene.add(rays);

    // ---------- accumulated point cloud map ----------
    const ptsPos = new Float32Array(MAX_POINTS * 3);
    const ptsCol = new Float32Array(MAX_POINTS * 3);
    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute("position", new THREE.BufferAttribute(ptsPos, 3));
    ptsGeo.setAttribute("color", new THREE.BufferAttribute(ptsCol, 3));
    ptsGeo.setDrawRange(0, 0);
    const cloud = new THREE.Points(ptsGeo, new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true }));
    scene.add(cloud);
    let nPts = 0;
    let head = 0;

    // ---------- flight trail ----------
    const TRAIL = 600;
    const trailPos = new Float32Array(TRAIL * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setDrawRange(0, 0);
    const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.8 }));
    scene.add(trail);
    let nTrail = 0;

    // ---------- state ----------
    let seg = 0, s = 0, x = ROUTE[0][0], y = ROUTE[0][1], heading = 0, lap = 0, frame = 0;
    const white = new THREE.Color("#f5f5f5");
    const tmp = new THREE.Color();

    const stepDrone = (dt: number) => {
      const [ax, ay] = ROUTE[seg];
      const [bx, by] = ROUTE[(seg + 1) % ROUTE.length];
      const len = Math.hypot(bx - ax, by - ay);
      s += SPEED * dt;
      if (s >= len) {
        s -= len;
        seg = (seg + 1) % ROUTE.length;
        if (seg === 0 && ++lap % 2 === 0) {
          nPts = 0; head = 0; nTrail = 0;
          ptsGeo.setDrawRange(0, 0);
        }
      }
      const [cx, cy] = ROUTE[seg];
      const [nx, ny] = ROUTE[(seg + 1) % ROUTE.length];
      const l = Math.hypot(nx - cx, ny - cy) || 1;
      x = cx + ((nx - cx) * Math.min(s, l)) / l;
      y = cy + ((ny - cy) * Math.min(s, l)) / l;
      const target = Math.atan2(ny - cy, nx - cx);
      let d = target - heading;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      heading += d * Math.min(1, dt * 5);
    };

    const scan = (addPoints: boolean) => {
      for (let k = 0; k < RAYS; k++) {
        const a = (k / RAYS) * Math.PI * 2 + frame * 0.013;
        const dx = Math.cos(a), dy = Math.sin(a);
        const d = cast(x, y, dx, dy);
        const i = k * 6;
        rayPos[i] = x; rayPos[i + 1] = ALT; rayPos[i + 2] = y;
        rayPos[i + 3] = x + dx * d; rayPos[i + 4] = ALT; rayPos[i + 5] = y + dy * d;
        if (addPoints && d < RANGE && k % 2 === frame % 2) {
          const j = head * 3;
          ptsPos[j] = x + dx * d + (Math.random() - 0.5) * 0.02;
          ptsPos[j + 1] = ALT + (Math.random() - 0.5) * 0.04;
          ptsPos[j + 2] = y + dy * d + (Math.random() - 0.5) * 0.02;
          ptsCol[j] = BLUE.r; ptsCol[j + 1] = BLUE.g; ptsCol[j + 2] = BLUE.b;
          head = (head + 1) % MAX_POINTS;
          nPts = Math.min(nPts + 1, MAX_POINTS);
        }
      }
      rayGeo.attributes.position.needsUpdate = true;
      // fade older points from blue to white
      for (let i = 0; i < nPts; i += 1) {
        const j = i * 3;
        tmp.setRGB(ptsCol[j], ptsCol[j + 1], ptsCol[j + 2]).lerp(white, 0.02);
        ptsCol[j] = tmp.r; ptsCol[j + 1] = tmp.g; ptsCol[j + 2] = tmp.b;
      }
      ptsGeo.setDrawRange(0, nPts);
      ptsGeo.attributes.position.needsUpdate = true;
      ptsGeo.attributes.color.needsUpdate = true;
    };

    const updateTrail = () => {
      if (nTrail < TRAIL) nTrail++;
      else trailPos.copyWithin(0, 3);
      const j = (nTrail - 1) * 3;
      trailPos[j] = x; trailPos[j + 1] = ALT; trailPos[j + 2] = y;
      trailGeo.setDrawRange(0, nTrail);
      trailGeo.attributes.position.needsUpdate = true;
    };

    // ---------- sizing and scroll-driven camera ----------
    const sideView = new THREE.Vector3(W / 2 - 8, 12.5, H / 2 + 15);
    camera.position.copy(sideView);
    const resize = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = r.width / Math.max(1, r.height);
      camera.fov = camera.aspect < 1 ? 55 : 40;
      camera.zoom = camera.aspect < 1 ? 0.7 : 1;
      // on wide screens push the maze to the right half, away from the text
      if (camera.aspect > 1.3) camera.setViewOffset(r.width, r.height, -r.width * 0.22, 0, r.width, r.height);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frame++;
      stepDrone(dt);
      drone.position.set(x, ALT, y);
      drone.rotation.y = -heading;
      drone.rotation.z = Math.sin(now / 900) * 0.03;
      props.forEach((p, i) => (p.rotation.z += (i % 2 ? 1 : -1) * 0.9));
      scan(true);
      updateTrail();

      // scroll progress through the hero: tilt the camera towards a top view
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * 0.8)));
      controls.maxPolarAngle = 1.25 - p * 1.1;
      controls.minPolarAngle = Math.min(0.15, controls.maxPolarAngle);
      controls.update();
      renderer.render(scene, camera);
    };

    if (reduce) {
      for (let i = 0; i < 600; i++) { frame++; stepDrone(0.03); if (i % 3 === 0) scan(true); }
      drone.position.set(x, ALT, y);
      controls.update();
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mount}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      role="img"
      aria-label="3D animation: a quadrotor flies through a maze, its LiDAR scan builds a point cloud map. Drag to rotate."
    />
  );
}
