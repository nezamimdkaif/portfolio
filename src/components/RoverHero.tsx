"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { getAssetPath } from "@/utils";

/*
 * NASA's Perseverance Mars rover (3D model: NASA/JPL-Caltech) on a patch of Martian ground.
 * - The rover's remote-sensing mast head (Mastcam-Z + NavCams) tracks the mouse cursor.
 * - The rover body turns slightly with the mouse; scrolling orbits the camera around it.
 * Model compressed with meshopt + WebP (11.7 MB -> 2.3 MB).
 */

function groundTexture() {
  // procedural Martian soil: rust base, darker blotches, fine grain
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#7a3f24";
  g.fillRect(0, 0, 512, 512);
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 900; i++) {
    const x = r() * 512, y = r() * 512, rad = 4 + r() * 40;
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    const dark = r() < 0.5;
    grd.addColorStop(0, dark ? "rgba(60,28,16,0.35)" : "rgba(170,98,58,0.28)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = r() < 0.5 ? "rgba(40,18,10,0.35)" : "rgba(200,130,90,0.25)";
    g.fillRect(r() * 512, r() * 512, 1, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2.2, 2.2);
  return t;
}

function fadeAlpha() {
  // white centre -> black rim, so the ground melts into space
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 30, 128, 128, 128);
  grd.addColorStop(0, "#fff");
  grd.addColorStop(0.45, "#aaa");
  grd.addColorStop(1, "#000");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export default function RoverHero({ className = "" }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.45;

    // Martian sun: warm, low, from the front-left; cool rim from behind
    const sunLight = new THREE.DirectionalLight(0xffd9b0, 2.6);
    sunLight.position.set(-4, 5, 4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.left = -4;
    sunLight.shadow.camera.right = 4;
    sunLight.shadow.camera.top = 4;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    const rim = new THREE.DirectionalLight(0x6aa0ff, 1.6);
    rim.position.set(3, 2.5, -5);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xffe2c6, 0x2a140c, 0.35));

    // ground patch with a few rocks
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(4.2, 96),
      new THREE.MeshStandardMaterial({ map: groundTexture(), alphaMap: fadeAlpha(), transparent: true, roughness: 1, metalness: 0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x4e2817, roughness: 1 });
    let rs = 11;
    const rr = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 16; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.025 + rr() * 0.07, 1), rockMat);
      const a = rr() * Math.PI * 2;
      const d = 1.7 + rr() * 1.6;
      rock.position.set(Math.cos(a) * d, 0.02, Math.sin(a) * d);
      rock.rotation.set(rr() * 3, rr() * 3, rr() * 3);
      rock.scale.y = 0.6;
      rock.castShadow = rock.receiveShadow = true;
      scene.add(rock);
    }

    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 200);
    const look = new THREE.Vector3(0, 0.9, 0);

    const rover = new THREE.Group();
    scene.add(rover);
    let head: THREE.Object3D | null = null;
    let disposed = false;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(getAssetPath("/models/perseverance.glb"), (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());
      const k = 3 / Math.max(size.x, size.z); // ~3 m long, like the real rover
      model.scale.setScalar(k);
      model.position.set(-centre.x * k, -box.min.y * k, -centre.z * k);
      model.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.castShadow = true;
          m.receiveShadow = true;
        }
        if (o.name === "head") head = o;
      });
      rover.add(model);
      look.set(0, size.y * k * 0.45, 0);
      setReady(true);
    });

    const resize = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = r.width / Math.max(1, r.height);
      if (camera.aspect > 1.3) camera.setViewOffset(r.width, r.height, -r.width * 0.22, 0, r.width, r.height);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // mouse in normalised device coordinates
    const mouse = new THREE.Vector2(0.3, 0.1);
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const ray = new THREE.Raycaster();
    const target = new THREE.Vector3();
    const local = new THREE.Vector3();
    const headWorld = new THREE.Vector3();
    let yaw = 0, pitch = 0, bodyYaw = 0, orbit = 0;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // camera: slow idle drift + orbit with scroll
      const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      const idle = reduce ? 0 : Math.sin(now / 6000) * 0.12;
      orbit += (0.75 + idle + scroll * 1.4 - orbit) * Math.min(1, dt * 3);
      const dist = 7.2;
      camera.position.set(Math.sin(orbit) * dist, 2.0 + scroll * 1.6, Math.cos(orbit) * dist);
      camera.lookAt(look);

      // body turns a little with the mouse
      bodyYaw += (mouse.x * 0.35 - bodyYaw) * Math.min(1, dt * 2);
      rover.rotation.y = bodyYaw;

      // mast head looks at the point under the cursor, 4 m in front of the camera
      if (head && head.parent) {
        ray.setFromCamera(mouse, camera);
        target.copy(ray.ray.origin).addScaledVector(ray.ray.direction, 4.5);
        head.parent.updateWorldMatrix(true, false);
        local.copy(target);
        head.parent.worldToLocal(local);
        head.getWorldPosition(headWorld);
        const hp = head.position;
        const dx = local.x - hp.x, dy = local.y - hp.y, dz = local.z - hp.z;
        const wantYaw = THREE.MathUtils.clamp(Math.atan2(dx, dz), -2.6, 2.6);
        const wantPitch = THREE.MathUtils.clamp(Math.atan2(dy, Math.hypot(dx, dz)), -0.6, 0.6);
        yaw += (wantYaw - yaw) * Math.min(1, dt * 4);
        pitch += (wantPitch - pitch) * Math.min(1, dt * 4);
        head.rotation.set(-pitch, yaw, 0, "YXZ");
      }

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      pmrem.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[] | undefined;
        const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
        mats.forEach((x) => {
          x.map?.dispose();
          x.alphaMap?.dispose();
          x.dispose();
        });
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mount}
      role="img"
      aria-label="3D model of NASA's Perseverance Mars rover on Martian ground; its camera mast follows the mouse."
      className={`transition-opacity duration-[1400ms] ${ready ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
