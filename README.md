# Portfolio: Md Kaif Nezami

Personal site: **https://nezamimdkaif.github.io/portfolio/**

Robotics and UAV autonomy: ROS 2, LiDAR SLAM (Cartographer), Gazebo, Python.

## What is on the site

- **Theme:** black, white and electric blue; academic robotics layout.
- **3D space background (Three.js):** thousands of twinkling stars, spiral galaxies and nebulae; scrolling flies the camera forward through space, mouse adds parallax, text stays readable.
- **3D hero (Three.js / WebGL):** NASA's Ingenuity Mars Helicopter (3D model: NASA/JPL-Caltech) with counter-rotating rotors; scrolling takes it apart into an exploded view; drag to rotate.
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
