"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * Phone hero: a procedurally built racing-style quadcopter (no model download).
 * - Swoops in, hovers in a figure-8, banks towards your finger.
 * - Every few seconds it does a barrel roll or a flip and leaves a light trail.
 * - Downwash rings pulse under it; LEDs blink (blue front, red rear).
 * - Scrolling makes it climb away.
 * Lightweight: ~3k triangles, one renderer, no shadows, pauses off-screen.
 */

const BLUE = new THREE.Color("#3b82f6");
const RED = new THREE.Color("#ff3b4a");

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function buildDrone(glow: THREE.Texture) {
  const drone = new THREE.Group();
  const carbon = new THREE.MeshPhysicalMaterial({ color: 0x15181e, roughness: 0.38, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.18 });
  const shell = new THREE.MeshPhysicalMaterial({ color: 0x2a3140, roughness: 0.22, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.06 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xa7afbd, roughness: 0.25, metalness: 0.95 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0b0d10, roughness: 0.6 });
  const accent = new THREE.MeshBasicMaterial({ color: BLUE });

  // body: carbon base + white canopy + blue accent strips
  const base = new THREE.Mesh(new RoundedBoxGeometry(1.15, 0.16, 0.62, 4, 0.07), carbon);
  drone.add(base);
  const canopy = new THREE.Mesh(new RoundedBoxGeometry(0.82, 0.2, 0.46, 5, 0.1), shell);
  canopy.position.set(-0.04, 0.16, 0);
  drone.add(canopy);
  for (const z of [-0.235, 0.235]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.014), accent);
    strip.position.set(0.0, 0.16, z);
    drone.add(strip);
    const low = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.018, 0.012), accent);
    low.position.set(0.0, -0.02, z * 1.33);
    drone.add(low);
  }
  // glowing "eye" bar at the front
  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.3), accent);
  eye.position.set(0.39, 0.17, 0);
  drone.add(eye);
  // battery pack on top
  const bat = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.12, 0.26, 3, 0.04), carbon);
  bat.position.set(-0.08, 0.31, 0);
  drone.add(bat);

  // camera gimbal at the nose
  const gimbal = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), dark);
  gimbal.position.set(0.58, -0.06, 0);
  drone.add(gimbal);
  const lens = new THREE.Mesh(
    new THREE.CircleGeometry(0.055, 24),
    new THREE.MeshPhysicalMaterial({ color: 0x1a3a7a, roughness: 0.05, metalness: 0.2, clearcoat: 1, emissive: 0x0a1d44 })
  );
  lens.position.set(0.689, -0.06, 0);
  lens.rotation.y = Math.PI / 2;
  drone.add(lens);

  // arms, motors, props, LEDs
  const props: THREE.Group[] = [];
  const leds: { mat: THREE.MeshBasicMaterial; sprite: THREE.Sprite; color: THREE.Color; phase: number }[] = [];
  const rearLeds: THREE.Object3D[] = [];
  const armGeo = new THREE.BoxGeometry(0.95, 0.05, 0.09);
  const blade = new THREE.BoxGeometry(0.62, 0.012, 0.07);
  const disc = new THREE.CircleGeometry(0.36, 40);
  const discMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false });
  const angles = [Math.PI / 4, -Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4];
  angles.forEach((a, i) => {
    const front = Math.cos(a) > 0;
    const arm = new THREE.Mesh(armGeo, carbon);
    arm.position.set(Math.cos(a) * 0.55, 0.02, Math.sin(a) * 0.55);
    arm.rotation.y = -a;
    drone.add(arm);

    const mx = Math.cos(a) * 1.02, mz = Math.sin(a) * 1.02;
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.14, 24), metal);
    motor.position.set(mx, 0.09, mz);
    drone.add(motor);
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.05, 16), dark);
    bell.position.set(mx, 0.185, mz);
    drone.add(bell);

    const prop = new THREE.Group();
    prop.position.set(mx, 0.215, mz);
    const b1 = new THREE.Mesh(blade, dark);
    b1.rotation.x = 0.12;
    const b2 = b1.clone();
    b2.rotation.y = Math.PI;
    b2.rotation.x = -0.12;
    prop.add(b1, b2);
    const d = new THREE.Mesh(disc, discMat);
    d.rotation.x = -Math.PI / 2;
    prop.add(d);
    prop.userData.dir = i % 2 ? 1 : -1;
    props.push(prop);
    drone.add(prop);

    const color = front ? BLUE : RED;
    const mat = new THREE.MeshBasicMaterial({ color });
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), mat);
    led.position.set(mx, -0.01, mz);
    drone.add(led);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, blending: THREE.NormalBlending, depthWrite: false }));
    sprite.scale.setScalar(0.45);
    sprite.position.copy(led.position);
    drone.add(sprite);
    leds.push({ mat, sprite, color, phase: i * 0.7 });
    if (!front) rearLeds.push(led);

    // landing leg under each motor
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.22, 8), carbon);
    leg.position.set(mx * 0.82, -0.14, mz * 0.82);
    drone.add(leg);
  });

  return { drone, props, leds, rearLeds };
}

export default function DroneHero({ className = "", background = false }: { className?: string; background?: boolean }) {
  const mount = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.7;
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(3, 6, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3b82f6, 2.5);
    rim.position.set(-4, 1, -4);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.9, 6.2);
    camera.lookAt(0, 0, 0);

    const glow = glowTexture();
    const { drone, props, leds, rearLeds } = buildDrone(glow);
    const rig = new THREE.Group(); // position + banking
    const spin = new THREE.Group(); // tricks (rolls / flips)
    rig.add(spin);
    spin.add(drone);
    drone.rotation.y = -0.5; // three-quarter view
    scene.add(rig);

    // soft blue glow under the craft
    const under = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: BLUE, transparent: true, opacity: 0.35, blending: THREE.NormalBlending, depthWrite: false }));
    under.scale.set(3.2, 1.0, 1);
    scene.add(under);

    // downwash rings
    const ringGeo = new THREE.RingGeometry(0.42, 0.46, 48);
    const rings: { m: THREE.Mesh; t: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.NormalBlending, depthWrite: false }));
      m.rotation.x = -Math.PI / 2;
      scene.add(m);
      rings.push({ m, t: i / 4 });
    }

    // light-trail particles emitted from the rear LEDs
    const TRAIL = 260;
    const tPos = new Float32Array(TRAIL * 3);
    const tCol = new Float32Array(TRAIL * 3);
    const tAge = new Float32Array(TRAIL).fill(9);
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
    tGeo.setAttribute("color", new THREE.BufferAttribute(tCol, 3));
    const trail = new THREE.Points(
      tGeo,
      new THREE.PointsMaterial({ size: 0.16, map: glow, vertexColors: true, transparent: true, blending: THREE.NormalBlending, depthWrite: false, sizeAttenuation: true })
    );
    trail.frustumCulled = false;
    scene.add(trail);
    let tHead = 0;
    const tmpV = new THREE.Vector3();
    const tmpC = new THREE.Color();

    const resize = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = r.width / Math.max(1, r.height);
      camera.position.z = background ? (camera.aspect < 0.8 ? 8.2 : 7.0) : camera.aspect < 0.8 ? 6.0 : 5.0;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // finger / mouse target
    const target = { x: 0, y: 0, active: 0 };
    const onPoint = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
      target.active = 2.5; // seconds of "follow"
    };
    // background mode: a tap anywhere on the page steers it; otherwise only taps on the canvas
    const tapTarget: HTMLElement | Window = background ? window : el;
    tapTarget.addEventListener("pointerdown", onPoint as EventListener, { passive: true });
    if (!background) el.addEventListener("pointermove", onPoint, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    let last = performance.now();
    let t = 0;
    let trickT = -1;
    let trickKind = 0;
    let nextTrick = 2.2;
    const pos = new THREE.Vector3(3.2, 2.4, -2); // starts off-screen: swoops in
    const vel = new THREE.Vector3();
    let bank = 0, pitch = 0;
    setReady(true);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;

      // where the drone wants to be: figure-8 hover, or your finger, and climb away on scroll
      const scroll = Math.min(1, window.scrollY / Math.max(1, el.getBoundingClientRect().height + 200));
      const hover = background
        ? new THREE.Vector3(
            Math.sin(t * 0.45) * 0.9 + Math.sin(window.scrollY * 0.0016) * 0.7,
            1.15 + Math.sin(t * 1.1) * 0.18,
            Math.cos(t * 0.45) * 0.6
          )
        : new THREE.Vector3(Math.sin(t * 0.7) * 0.55, Math.sin(t * 1.4) * 0.2 - 0.05, Math.cos(t * 0.7) * 0.35);
      if (target.active > 0) {
        target.active -= dt;
        hover.set(target.x * (background ? 1.8 : 1.3), target.y * (background ? 2.2 : 0.9) + (background ? 0.6 : 0), 0.3);
      }
      if (!background) {
        hover.y += scroll * 3.2;
        hover.z -= scroll * 3;
      }

      const prev = pos.clone();
      pos.lerp(hover, Math.min(1, dt * (target.active > 0 ? 2.6 : 1.4)));
      vel.copy(pos).sub(prev).divideScalar(Math.max(dt, 1e-3));
      rig.position.copy(pos);

      // bank into the turn, pitch into the motion
      bank += (THREE.MathUtils.clamp(-vel.x * 0.35, -0.6, 0.6) - bank) * Math.min(1, dt * 5);
      pitch += (THREE.MathUtils.clamp(-vel.z * 0.25 + vel.y * 0.05, -0.4, 0.4) - pitch) * Math.min(1, dt * 5);
      rig.rotation.set(pitch, 0, bank);

      // tricks: barrel roll or front flip, with a little hop
      if (!reduce) {
        nextTrick -= dt;
        if (trickT < 0 && nextTrick <= 0 && (background || scroll < 0.3)) {
          trickT = 0;
          trickKind = (trickKind + 1) % 2;
        }
        if (trickT >= 0) {
          trickT += dt / 0.95;
          const e = trickT >= 1 ? 1 : 1 - Math.pow(1 - trickT, 3);
          if (trickKind === 0) spin.rotation.set(e * Math.PI * 2, 0, 0); // roll around the nose axis
          else spin.rotation.set(0, 0, -e * Math.PI * 2); // flip forward
          spin.position.y = Math.sin(Math.min(1, trickT) * Math.PI) * 0.45;
          if (trickT >= 1) {
            trickT = -1;
            spin.rotation.set(0, 0, 0);
            spin.position.y = 0;
            nextTrick = 4 + Math.random() * 2.5;
          }
        }
      }

      // props, LEDs
      for (const p of props) p.rotation.y += p.userData.dir * dt * 55;
      for (const l of leds) {
        const blink = 0.55 + 0.45 * Math.max(0, Math.sin(t * 6 + l.phase));
        l.sprite.material.opacity = blink;
        l.mat.color.copy(l.color).multiplyScalar(0.6 + blink * 0.6);
      }

      // trail: emit from rear LEDs, faster when doing tricks
      const emit = trickT >= 0 ? 3 : vel.length() > 0.6 ? 2 : 1;
      for (let k = 0; k < emit; k++) {
        for (const led of rearLeds) {
          led.getWorldPosition(tmpV);
          const j = tHead * 3;
          tPos[j] = tmpV.x; tPos[j + 1] = tmpV.y; tPos[j + 2] = tmpV.z;
          tAge[tHead] = 0;
          tHead = (tHead + 1) % TRAIL;
        }
      }
      for (let i = 0; i < TRAIL; i++) {
        tAge[i] += dt;
        const f = Math.max(0, 1 - tAge[i] / 0.7);
        tmpC.copy(trickT >= 0 ? BLUE : RED).lerp(BLUE, 1 - f).multiplyScalar(f);
        tCol[i * 3] = tmpC.r; tCol[i * 3 + 1] = tmpC.g; tCol[i * 3 + 2] = tmpC.b;
      }
      tGeo.attributes.position.needsUpdate = true;
      tGeo.attributes.color.needsUpdate = true;

      // downwash rings expand and fade below the craft
      for (const r of rings) {
        r.t = (r.t + dt * 0.7) % 1;
        r.m.position.set(pos.x, pos.y - 0.35 - r.t * 0.9, pos.z);
        r.m.scale.setScalar(0.8 + r.t * 2.2);
        (r.m.material as THREE.MeshBasicMaterial).opacity = (1 - r.t) * 0.35 * (background ? 0.6 : 1 - scroll);
      }
      under.position.set(pos.x, pos.y - 0.9, pos.z);
      under.material.opacity = 0.3 * (background ? 0.6 : 1 - scroll);

      if (background) {
        camera.lookAt(pos.x * 0.15, 0.35, 0);
        // full strength over the hero, then a faint presence behind the content
        const k = window.scrollY / Math.max(1, window.innerHeight);
        el.style.opacity = String(Math.max(0.14, Math.min(1, 1 - (k - 0.25) * 1.6)));
      }
      else camera.lookAt(pos.x * 0.35, pos.y + 0.3, 0);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      tapTarget.removeEventListener("pointerdown", onPoint as EventListener);
      el.removeEventListener("pointermove", onPoint);
      pmrem.dispose();
      glow.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | undefined;
        mat?.dispose?.();
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [background]);

  return (
    <div
      ref={mount}
      role="img"
      aria-label="3D quadcopter that hovers, does rolls and flips with light trails; tap to steer it."
      className={`${background ? "" : "touch-pan-y"} transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
