"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getAssetPath } from "@/utils";

/*
 * Photoreal Earth for the hero (textures: Solar System Scope, CC BY 4.0, from NASA data).
 * - Day side lit by the sun, city lights on the night side, a separate cloud layer,
 *   and a soft blue atmosphere rim.
 * - Follows the mouse: the globe tilts and turns smoothly towards the cursor.
 * - Scrolling past the hero spins it a little further.
 */

const earthVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFrag = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform vec3 uSun;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    float light = dot(normalize(vNormalW), normalize(uSun));
    float dayMix = smoothstep(-0.12, 0.18, light);
    vec3 day = texture2D(uDay, vUv).rgb * (0.25 + 0.95 * max(light, 0.0));
    vec3 night = texture2D(uNight, vUv).rgb * vec3(1.0, 0.85, 0.6) * 1.6;
    vec3 col = mix(night, day, dayMix);
    // warm band at the terminator (sunrise / sunset)
    float dusk = exp(-pow(light * 12.0, 2.0)) * 0.12;
    col += vec3(1.0, 0.45, 0.2) * dusk;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const cloudFrag = /* glsl */ `
  uniform sampler2D uClouds;
  uniform vec3 uSun;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    float c = texture2D(uClouds, vUv).r;
    float light = dot(normalize(vNormalW), normalize(uSun));
    float lit = smoothstep(-0.2, 0.4, light);
    gl_FragColor = vec4(vec3(0.95) * (0.08 + 0.92 * lit), c * 0.85 * (0.15 + 0.85 * lit));
  }
`;

const atmoVert = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vNormalW;
  void main() {
    vNormalV = normalize(normalMatrix * normal);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmoFrag = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vNormalV;
  varying vec3 vNormalW;
  void main() {
    float rim = pow(0.68 - dot(vNormalV, vec3(0.0, 0.0, 1.0)), 3.6);
    float lit = smoothstep(-0.4, 0.6, dot(vNormalW, normalize(uSun)));
    vec3 col = vec3(0.30, 0.58, 1.0) * rim * (0.25 + 1.1 * lit);
    gl_FragColor = vec4(col, rim);
  }
`;

export default function EarthHero({ className = "" }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const loader = new THREE.TextureLoader();
    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded === 3) setReady(true);
    };
    const tex = (p: string, srgb = true) => {
      const t = loader.load(getAssetPath(p), onLoad);
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return t;
    };
    const sun = new THREE.Vector3(-1.0, 0.35, 0.55).normalize();

    const tilt = new THREE.Group(); // mouse-driven orientation
    tilt.rotation.z = 0.41; // Earth's axial tilt, 23.4°
    scene.add(tilt);

    const earthMat = new THREE.ShaderMaterial({
      vertexShader: earthVert,
      fragmentShader: earthFrag,
      uniforms: { uDay: { value: tex("/space/earth_day.jpg") }, uNight: { value: tex("/space/earth_night.jpg") }, uSun: { value: sun } },
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), earthMat);
    tilt.add(earth);

    const cloudMat = new THREE.ShaderMaterial({
      vertexShader: earthVert,
      fragmentShader: cloudFrag,
      uniforms: { uClouds: { value: tex("/space/earth_clouds.jpg", false) }, uSun: { value: sun } },
      transparent: true,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.012, 128, 96), cloudMat);
    tilt.add(clouds);

    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 96, 64),
      new THREE.ShaderMaterial({
        vertexShader: atmoVert,
        fragmentShader: atmoFrag,
        uniforms: { uSun: { value: sun } },
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(atmo);

    const resize = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = r.width / Math.max(1, r.height);
      // wide screens: globe sits in the right half; phones: centred
      if (camera.aspect > 1.3) camera.setViewOffset(r.width, r.height, -r.width * 0.24, 0, r.width, r.height);
      else camera.clearViewOffset();
      camera.position.z = camera.aspect < 1 ? 7.2 : 6.2;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    let last = performance.now();
    let spin = 1.9; // start with Asia/India facing the viewer
    let rx = 0;
    let ry = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      if (!reduce) spin += dt * 0.045;
      // ease towards the mouse: up/down tilts, left/right turns
      rx += (mouse.y * 0.35 - rx) * Math.min(1, dt * 2.5);
      ry += (mouse.x * 0.6 - ry) * Math.min(1, dt * 2.5);

      tilt.rotation.x = rx;
      tilt.rotation.y = ry + scroll * 1.2;
      earth.rotation.y = spin;
      clouds.rotation.y = spin * 1.15 + 0.4;
      tilt.position.y = scroll * 0.35;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.ShaderMaterial | undefined;
        if (mat?.uniforms) Object.values(mat.uniforms).forEach((u) => (u.value as THREE.Texture)?.dispose?.());
        mat?.dispose?.();
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mount}
      aria-label="Photorealistic Earth with city lights, clouds and atmosphere; it turns towards the mouse."
      role="img"
      className={`transition-opacity duration-[1600ms] ${ready ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
