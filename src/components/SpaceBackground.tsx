"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getAssetPath } from "@/utils";

/*
 * Full-page WebGL space behind the content.
 * - Thousands of stars in depth that twinkle; the field wraps, so it never ends.
 * - Real imagery: ESO Milky Way panorama as the far sky, Hubble galaxy photos along the flight path.
 * - Scrolling flies the camera forward; fast scrolling stretches the stars a little.
 * - The mouse adds a small parallax. Everything stays dim so text stays readable.
 */

const DEPTH = 420; // length of the star tube (wraps)
const TRAVEL = 380; // how far the camera flies from top to bottom of the page
const STARS = 7000;

const starVert = /* glsl */ `
  uniform float uCamZ;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPixel;
  attribute float aSize;
  attribute float aSeed;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // wrap the star inside the window (uCamZ - DEPTH, uCamZ]
    p.z = uCamZ - mod(uCamZ - p.z, ${DEPTH.toFixed(1)});
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    float twinkle = 0.75 + 0.25 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 40.0);
    float fadeFar = smoothstep(${DEPTH.toFixed(1)}, ${(DEPTH * 0.55).toFixed(1)}, dist);
    float fadeNear = smoothstep(0.5, 6.0, dist);
    vAlpha = twinkle * fadeFar * fadeNear;
    vColor = aColor;
    gl_PointSize = aSize * uPixel * (120.0 / dist) * (1.0 + uSpeed * 0.6);
    gl_Position = projectionMatrix * mv;
  }
`;

const starFrag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.5, 0.0, d);
    float glow = exp(-d * d * 18.0);
    float a = (core * 0.6 + glow * 0.8) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

function softSprite(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// deterministic random, so the sky is the same on every visit
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function SpaceBackground() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = rng(20261121);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x050507, 1);
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1200);
    camera.position.set(0, 0, 10);

    // ---------- stars ----------
    const sPos = new Float32Array(STARS * 3);
    const sSize = new Float32Array(STARS);
    const sSeed = new Float32Array(STARS);
    const sCol = new Float32Array(STARS * 3);
    const palette = [new THREE.Color("#ffffff"), new THREE.Color("#cfe0ff"), new THREE.Color("#9ec1ff"), new THREE.Color("#ffe9c9")];
    for (let i = 0; i < STARS; i++) {
      // keep a clear corridor in the middle so stars do not sit on top of the text
      let x = 0, y = 0;
      do {
        x = (rand() - 0.5) * 160;
        y = (rand() - 0.5) * 100;
      } while (Math.abs(x) < 3 && Math.abs(y) < 2);
      sPos[i * 3] = x;
      sPos[i * 3 + 1] = y;
      sPos[i * 3 + 2] = 10 - rand() * DEPTH;
      const big = rand();
      sSize[i] = big > 0.985 ? 2.6 : big > 0.9 ? 1.6 : 0.9;
      sSeed[i] = rand();
      const c = palette[rand() < 0.7 ? 0 : rand() < 0.5 ? 1 : rand() < 0.6 ? 2 : 3];
      sCol[i * 3] = c.r;
      sCol[i * 3 + 1] = c.g;
      sCol[i * 3 + 2] = c.b;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    sGeo.setAttribute("aSize", new THREE.BufferAttribute(sSize, 1));
    sGeo.setAttribute("aSeed", new THREE.BufferAttribute(sSeed, 1));
    sGeo.setAttribute("aColor", new THREE.BufferAttribute(sCol, 3));
    const sMat = new THREE.ShaderMaterial({
      vertexShader: starVert,
      fragmentShader: starFrag,
      uniforms: { uCamZ: { value: 10 }, uTime: { value: 0 }, uSpeed: { value: 0 }, uPixel: { value: dpr } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(sGeo, sMat);
    stars.frustumCulled = false;
    scene.add(stars);

    // ---------- Milky Way panorama (ESO/S. Brunier, CC BY 4.0) as a far sky ----------
    const loader = new THREE.TextureLoader();
    const skyTex = loader.load(getAssetPath("/space/milkyway.jpg"));
    skyTex.colorSpace = THREE.SRGBColorSpace;
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(900, 64, 32),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, transparent: true, opacity: 0.55, depthWrite: false, fog: false })
    );
    sky.rotation.set(0.5, 2.4, -0.35); // band crosses the screen diagonally
    scene.add(sky);

    // ---------- real galaxy photos (Hubble: NASA/ESA) along the flight path ----------
    const galaxies: THREE.Mesh[] = [];
    const gDefs = [
      { src: "/space/m101.jpg", x: 30, y: 10, z: -60, w: 44, rot: 0.3, op: 0.95 },
      { src: "/space/m104.jpg", x: -36, y: -12, z: -135, w: 56, rot: -0.2, op: 0.9 },
      { src: "/space/m51.jpg", x: 34, y: -14, z: -210, w: 60, rot: 0.6, op: 0.95 },
      { src: "/space/ngc1300.jpg", x: -32, y: 14, z: -290, w: 72, rot: -0.4, op: 0.9 },
      { src: "/space/m101.jpg", x: 8, y: -4, z: -400, w: 90, rot: 1.2, op: 0.85 },
    ];
    for (const g of gDefs) {
      const t = loader.load(getAssetPath(g.src), (tx) => {
        const img = tx.image as HTMLImageElement;
        mesh.scale.set(g.w, (g.w * img.height) / img.width, 1);
      });
      t.colorSpace = THREE.SRGBColorSpace;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: g.op, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      mesh.position.set(g.x, g.y, g.z);
      mesh.rotation.z = g.rot;
      mesh.scale.set(g.w, g.w * 0.7, 1);
      galaxies.push(mesh);
      scene.add(mesh);
    }

    // ---------- faint nebula haze ----------
    const nebTex = [
      softSprite("rgba(59,130,246,0.16)", "rgba(59,130,246,0)"),
      softSprite("rgba(124,108,242,0.13)", "rgba(124,108,242,0)"),
      softSprite("rgba(236,72,153,0.07)", "rgba(236,72,153,0)"),
    ];
    for (let i = 0; i < 12; i++) {
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: nebTex[i % 3], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 })
      );
      const side = i % 2 ? 1 : -1;
      sp.position.set(side * (30 + rand() * 45), (rand() - 0.5) * 50, -30 - i * 34 - rand() * 15);
      sp.scale.setScalar(50 + rand() * 60);
      scene.add(sp);
    }

    // ---------- sizing ----------
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // ---------- input ----------
    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    let camZ = 10 - progress() * TRAVEL;
    let speed = 0;
    let raf = 0;
    let last = performance.now();
    let hidden = false;
    const onVis = () => (hidden = document.hidden);
    document.addEventListener("visibilitychange", onVis);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const target = 10 - progress() * TRAVEL;
      const prev = camZ;
      camZ += (target - camZ) * Math.min(1, dt * 3.2);
      // slow idle drift so the sky is alive even without scrolling
      if (!reduce) camZ -= dt * 0.6;
      const v = Math.abs(camZ - prev) / Math.max(dt, 1e-3);
      speed += (Math.min(1.5, v / 60) - speed) * Math.min(1, dt * 4);

      camera.position.z = camZ;
      camera.position.x += (mouse.x * 4 - camera.position.x) * Math.min(1, dt * 2);
      camera.position.y += (-mouse.y * 2.6 - camera.position.y) * Math.min(1, dt * 2);
      sky.position.copy(camera.position);
      sky.rotation.y = 2.4 + mouse.x * 0.04 + (10 - camZ) * 0.0006;
      camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, camZ - 50);

      sMat.uniforms.uCamZ.value = camZ;
      sMat.uniforms.uTime.value = reduce ? 0 : now / 1000;
      sMat.uniforms.uSpeed.value = speed;
      if (!reduce) for (let i = 0; i < galaxies.length; i++) galaxies[i].rotation.z += dt * (0.006 + i * 0.002);

      renderer.render(scene, camera);
    };

    if (reduce) {
      camera.position.z = camZ;
      sMat.uniforms.uCamZ.value = camZ;
      renderer.render(scene, camera);
      const onScroll = () => {
        camZ = 10 - progress() * TRAVEL;
        camera.position.z = camZ;
        sMat.uniforms.uCamZ.value = camZ;
        renderer.render(scene, camera);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        renderer.dispose();
        el.removeChild(renderer.domElement);
      };
    }

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | undefined;
        mat?.dispose?.();
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mount} aria-hidden className="pointer-events-none fixed inset-0 -z-20" />
      {/* readability layer: darkens the middle where the text sits, keeps the edges vivid */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,5,7,0.55) 0%, rgba(5,5,7,0.25) 60%, rgba(5,5,7,0) 100%)" }}
      />
    </>
  );
}
