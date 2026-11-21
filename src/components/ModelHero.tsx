"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { getAssetPath } from "@/utils";

/*
 * NASA's Ingenuity Mars Helicopter (3D model: NASA/JPL-Caltech), rendered with
 * three.js. The two coaxial rotors counter-rotate, the craft hovers, and
 * scrolling through the hero pulls it apart into an exploded view.
 * Model hierarchy: "bus" is the root; its local +X is the mast (up).
 */

// how far (in bus-local units, along the mast) each upper part moves when exploded
const MAST_LIFT: Record<string, number> = {
  parts_02: 0.35,
  rotors_02: 0.75,
  parts_01: 1.15,
  rotors_01: 1.6,
  solar_panel: 2.2,
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function ModelHero({ className = "" }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3b82f6, 2.2);
    rim.position.set(-4, 2, -5);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = !reduce;
    controls.autoRotateSpeed = 0.6;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.9;

    // soft blue glow on the "ground" under the craft
    const glowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d")!;
      const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grd.addColorStop(0, "rgba(59,130,246,0.3)");
      grd.addColorStop(1, "rgba(59,130,246,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2;
    scene.add(glow);

    const pivot = new THREE.Group();
    scene.add(pivot);
    const parts: { obj: THREE.Object3D; base: THREE.Vector3; dir: THREE.Vector3 }[] = [];
    const rotors: { obj: THREE.Object3D; sign: number }[] = [];
    let size = 1;
    let disposed = false;

    new GLTFLoader().load(getAssetPath("/models/ingenuity.glb"), (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      // centre and normalise the model
      const box = new THREE.Box3().setFromObject(model);
      const c = box.getCenter(new THREE.Vector3());
      size = box.getSize(new THREE.Vector3()).length();
      model.position.sub(c);
      pivot.add(model);

      model.traverse((o) => {
        const name = o.name;
        if (name === "rotors_01") rotors.push({ obj: o, sign: 1 });
        if (name === "rotors_02") rotors.push({ obj: o, sign: -1 });
        if (name in MAST_LIFT) {
          parts.push({ obj: o, base: o.position.clone(), dir: new THREE.Vector3(MAST_LIFT[name], 0, 0) });
        } else if (name.startsWith("leg_")) {
          const d = new THREE.Vector3(-0.9, o.position.y, o.position.z).normalize().multiplyScalar(1.1);
          parts.push({ obj: o, base: o.position.clone(), dir: d });
        } else if (name === "cams") {
          parts.push({ obj: o, base: o.position.clone(), dir: new THREE.Vector3(-0.6, 0, 0) });
        }
      });

      glow.scale.setScalar(size * 0.6);
      glow.position.y = -size * 0.42;
      controls.target.set(0, size * 0.05, 0);
      camera.position.set(size * 1.45, size * 0.5, size * 1.75);
      resize();
      setLoaded(true);
    });

    function resize() {
      const r = el!.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = r.width / Math.max(1, r.height);
      // on wide screens keep the craft in the right half, away from the text
      if (camera.aspect > 1.3) camera.setViewOffset(r.width, r.height, -r.width * 0.2, 0, r.width, r.height);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    let last = performance.now();
    let explode = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // scroll through the hero -> exploded view
      // progress through the (sticky) hero wrapper; on phones, through the model box
      const host = (el.closest("[data-explode]") as HTMLElement) ?? el;
      const rect = host.getBoundingClientRect();
      const span = rect.height > window.innerHeight * 1.2 ? rect.height - window.innerHeight : rect.height * 0.8;
      const p = Math.min(1, Math.max(0, (rect.height > window.innerHeight * 1.2 ? -rect.top : window.innerHeight * 0.6 - rect.top) / Math.max(1, span)));
      const target = smooth(0.1, 0.8, p);
      explode += (target - explode) * Math.min(1, dt * 6);
      for (const part of parts) part.obj.position.copy(part.base).addScaledVector(part.dir, explode);

      // counter-rotating coaxial rotors (slow down as the craft comes apart)
      const spin = (reduce ? 0 : 22) * (1 - explode * 0.85) * dt;
      for (const r of rotors) r.obj.rotateX(spin * r.sign);

      // gentle hover
      pivot.position.y = reduce ? 0 : Math.sin(now / 1100) * size * 0.015;
      pivot.rotation.z = reduce ? 0 : Math.sin(now / 1700) * 0.02;

      controls.update();
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mount}
      className={`cursor-grab transition-opacity duration-1000 active:cursor-grabbing ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      role="img"
      aria-label="3D model of NASA's Ingenuity Mars Helicopter with counter-rotating rotors; scrolling separates it into an exploded view. Drag to rotate."
    />
  );
}
