# Portfolio: Md Kaif Nezami

Personal site: **https://nezamimdkaif.github.io/portfolio/**

Robotics and UAV autonomy: ROS 2, LiDAR SLAM (Cartographer), Gazebo, Python.

## What is on the site

- **Theme:** black, white and electric blue; academic robotics layout.
- **3D space background (Three.js):** thousands of twinkling stars, ESO Milky Way panorama and real Hubble galaxy photos; scrolling flies the camera forward through space, mouse adds parallax, text stays readable.
- **Phones:** separate layout with a procedural 3D quadcopter (rolls, flips, light trails, downwash rings, tap to steer) and a light CSS sky instead of WebGL space, so phones run a single WebGL scene.
- **3D rover hero on desktop (Three.js / WebGL):** NASA's Perseverance Mars rover (NASA/JPL-Caltech, compressed 11.7 MB -> 2.3 MB with meshopt + WebP) on Martian ground; its camera mast follows the mouse, scrolling orbits the camera.
- **Experience and projects:** real-drone LiDAR SLAM, the open-source Drone SLAM Simulator, UAV flight-log analysis, ArUco precision landing.
- **Research finding:** a scroll-driven section on the loop-closure experiment (0.10 m vs 0.42 m mean error, 3 runs each).
- **Documentation:** internship report (56 pp), simulator manual (24 pp), slides, hardware guide, certificate.
- **Live GitHub feed:** latest repositories fetched from the GitHub API on page load.
- **News list** with dated updates.

## Stack

Next.js 14 (static export) · TypeScript · Three.js · Tailwind CSS · Framer Motion · deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000/portfolio
npm run build        # static site in out/
```

All text content is in `src/lib/data.ts`.

## Image credits

Perseverance 3D model: NASA/JPL-Caltech. Milky Way panorama: ESO/S. Brunier (CC BY 4.0). Galaxies: NASA, ESA and the Hubble Heritage Team (M51, M104, NGC 1300 public domain; M101 CC BY 4.0).
