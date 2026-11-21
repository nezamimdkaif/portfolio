// All site content lives here. Every claim matches the resume and real work.

export const profile = {
  name: "Md Kaif Nezami",
  role: "Robotics and UAV Autonomy",
  tagline: "I build autonomy software for robots that fly without GPS.",
  intro:
    "Third-year Electronics and Communication Engineering undergraduate at BIT Sindri (B.Tech, 2024–2028) and Project Intern at the Drone Electronics Laboratory, IIT (ISM) Dhanbad. I develop autonomy software for drones that must navigate without GPS, with a focus on LiDAR SLAM, sensor integration and simulation-to-hardware testing in Python and ROS 2.",
  location: "Dhanbad, Jharkhand, India",
  email: "mdkaif.ece24@bitsindri.ac.in",
  github: "https://github.com/nezamimdkaif",
  githubUser: "nezamimdkaif",
  linkedin: "https://www.linkedin.com/in/md-kaif-nezami-029507313",
  resume: "/docs/Md_Kaif_Nezami_Resume.pdf",
};

export const news: { date: string; text: string; href?: string }[] = [
  { date: "Nov 2026", text: "Built the first real 2D LiDAR map on the drone: Cartographer on a Raspberry Pi 4 with Pixhawk 6C IMU over MAVROS." },
  { date: "Nov 2026", text: "Open-sourced the Drone SLAM Simulator with a 24-page manual.", href: "https://github.com/nezamimdkaif/drone-slam-simulator" },
  { date: "Nov 2026", text: "Found that loop closure made SLAM worse in a repetitive maze: 0.10 m vs 0.42 m mean error over 3 runs each." },
  { date: "Sep 2026", text: "Internship extended by six months to work on the NIDAR 2.0 AirMouse indoor mapping mission." },
  { date: "Jul 2026", text: "Submitted a 56-page internship report on UAV flight-log analysis and vision-based landing.", href: "/docs/internship-report-uav-flight-logs-vision-landing.pdf" },
  { date: "May 2026", text: "Joined the Drone Electronics Laboratory, IIT (ISM) Dhanbad, as a summer project intern." },
  { date: "2026", text: "ISRO IRoC-U 2026 with Team AADISHAKTI: reached the elimination round; secured INR 1,00,000 sponsorship from SAIL." },
];

export type Experience = {
  role: string;
  org: string;
  period: string;
  note?: string;
  points: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    role: "Research Project Intern, NIDAR 2.0 AirMouse",
    org: "Drone Electronics Laboratory, IIT (ISM) Dhanbad",
    period: "Sep 2026 - Present",
    note: "Indoor GPS-denied search and mapping drone",
    points: [
      "Building the GPS-denied indoor mapping pipeline with ROS 2 and Google Cartographer 2D LiDAR SLAM.",
      "Integrated an RPLIDAR A2M12 and a Pixhawk 6C on a Raspberry Pi 4 (Ubuntu, ROS 2 Humble); streamed flight-controller IMU data at 50 Hz over MAVLink (MAVROS, UART 921600 baud).",
      "Fixed drone-to-laptop ROS 2 communication over WiFi, where DDS multicast discovery was blocked, with Fast DDS unicast peers; live scans in RViz at about 12 Hz.",
      "Built a Gazebo maze simulation with Python test tools that fly a fixed route and score SLAM against ground truth.",
      "Found that loop closure raised mean position error from 0.10 m to 0.42 m (3 runs each) in a repetitive maze; now testing ways to reject false matches.",
    ],
    tags: ["ROS 2", "Cartographer", "MAVROS", "Fast DDS", "Gazebo", "Python"],
  },
  {
    role: "Summer Project Intern",
    org: "Drone Electronics Laboratory, IIT (ISM) Dhanbad",
    period: "May 2026 - Jul 2026",
    note: "Guide: Prof. Ravi Kumar Gangwar | Project Leader: Dr. Mohd Aijaz Siddiqui. Extended by six months.",
    points: [
      "Analysed 19+ ArduPilot/PX4 flight logs from 2 multirotors with pymavlink, NumPy and Matplotlib; GPS/compass inconsistency was the most frequent anomaly (26 events across 7 logs); vibration peaked at 62.7 m/s² against a ~30 m/s² limit.",
      "Designed a GPS-independent precision landing system: nested OpenCV ArUco markers (0.2 - 15 m) on a Raspberry Pi 4, with Python ROS 2 nodes commanding a Cube Orange over MAVROS. Verified in simulation.",
      "Built a fixed-wing VTOL prototype from scratch in a 3-member team through 3D-printing design-print-test cycles.",
    ],
    tags: ["pymavlink", "OpenCV", "ArUco", "MAVROS", "PX4 SITL"],
  },
  {
    role: "ISRO IRoC-U 2026, reached the elimination round",
    org: "Team AADISHAKTI, BIT Sindri",
    period: "Dec 2025 - May 2026",
    points: [
      "Built the ground station; integrated a Raspberry Pi 5 with a Pixhawk 6C over UART MAVLink, with 5 V / 5 A power delivery and PX4 optical-flow setup for GPS-denied navigation.",
      "Validated navigation logic in Gazebo with PX4 SITL before field tests.",
      "Independently secured INR 1,00,000 sponsorship from Steel Authority of India Limited (SAIL) for the team.",
    ],
    tags: ["PX4", "Optical flow", "MAVLink", "Raspberry Pi 5"],
  },
];

export type Media =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; src: string; alt: string; caption?: string; poster?: string };

export type Project = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  points: string[];
  tags: string[];
  media: Media[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "real-slam",
    title: "LiDAR SLAM on the real drone",
    kicker: "Hardware · Nov 2026",
    summary:
      "First real 2D map from the drone's own sensors: a room and corridor mapped by carrying the drone by hand, with Cartographer running on the onboard Raspberry Pi 4.",
    points: [
      "RPLIDAR A2M12 on USB, Pixhawk 6C IMU over TELEM2 UART via MAVROS at 50 Hz.",
      "Cartographer 2D runs on the Pi; map and TF viewed live on a laptop in RViz.",
      "Solved WiFi DDS discovery with Fast DDS unicast peers between ROS 2 Humble and Jazzy.",
    ],
    tags: ["ROS 2 Humble", "Cartographer", "MAVROS", "RPLIDAR", "Raspberry Pi 4"],
    media: [
      { kind: "video", src: "/video/real-map-building.mp4", alt: "RViz view of the map being built on the real drone", caption: "Map building live in RViz (8x speed)" },
      { kind: "image", src: "/img/real-map-final.jpg", alt: "Final 2D occupancy map of a room and corridor", caption: "Final map: room and corridor" },
      { kind: "image", src: "/img/real-map-top.jpg", alt: "Final map seen from above", caption: "Final map from above" },
    ],
    links: [],
  },
  {
    id: "sim",
    title: "Drone SLAM Simulator",
    kicker: "Simulation · Open source",
    summary:
      "Gazebo maze, quad-X drone with 2D LiDAR, IMU and camera, live Cartographer SLAM, a web dashboard and phone joystick control. A practice setup for learning SLAM before moving to the real drone.",
    points: [
      "Seeded maze generator, so every experiment is repeatable.",
      "Python test pilot flies a fixed route and measures SLAM error against Gazebo ground truth.",
      "24-page manual with pipeline flowcharts, TF tree and troubleshooting.",
    ],
    tags: ["ROS 2 Jazzy", "Gazebo Harmonic", "Cartographer", "FastAPI", "RViz"],
    media: [
      { kind: "image", src: "/img/sim-cover_maze.jpg", alt: "Seed-42 maze in Gazebo", caption: "Seed-42 maze in Gazebo Harmonic" },
      { kind: "image", src: "/img/sim-rviz_midflight.jpg", alt: "RViz showing map, trajectory and ground truth", caption: "RViz: map, SLAM trajectory and ground truth" },
      { kind: "image", src: "/img/sim-dashboard_grid.jpg", alt: "Web dashboard with live map", caption: "Web dashboard with 1 m grid" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/nezamimdkaif/drone-slam-simulator" },
      { label: "Manual (PDF)", href: "/docs/drone-slam-simulator-manual.pdf" },
    ],
  },
  {
    id: "logs",
    title: "UAV flight-log analysis",
    kicker: "Data · Summer 2026",
    summary:
      "Explained crashes and erratic motors on lab multirotors by reading their DataFlash logs, then reconstructed and animated the flight paths.",
    points: [
      "19+ logs from 2 airframes, read with pymavlink, cross-checked in MAVExplorer and Mission Planner.",
      "GPS/compass inconsistency was the most frequent anomaly: 26 events across 7 logs.",
      "In one log vibration crossed the ~30 m/s² limit at 10 points, peaking at 62.7 m/s².",
    ],
    tags: ["Python", "pymavlink", "NumPy", "Matplotlib", "OpenCV"],
    media: [
      { kind: "video", src: "/video/flight-path-reconstruction.mp4", alt: "Animated flight path reconstructed from a log", caption: "Flight path reconstructed from a DataFlash log" },
    ],
    links: [{ label: "Report (PDF)", href: "/docs/internship-report-uav-flight-logs-vision-landing.pdf" }],
  },
  {
    id: "landing",
    title: "Vision-based precision landing",
    kicker: "Perception · Summer 2026",
    summary:
      "A landing system that does not need GPS: nested ArUco markers give the drone its pose, and ROS 2 nodes steer the descent through MAVROS.",
    points: [
      "Nested markers keep detection working from 0.2 m to 15 m.",
      "Two Python ROS 2 nodes on a Raspberry Pi 4 command a Cube Orange for closed-loop descent.",
      "Detection and correction verified in simulation; hardware set up on the landing pad.",
    ],
    tags: ["OpenCV", "ArUco", "ROS 2", "MAVROS", "Gazebo"],
    media: [
      { kind: "image", src: "/img/landing-drone-pad-1.jpg", alt: "Quadrotor on the ArUco landing pad", caption: "Test drone on the ArUco pad" },
      { kind: "video", src: "/video/aruco-landing-gazebo.mp4", alt: "Drone landing on an ArUco marker in Gazebo", caption: "ArUco landing in Gazebo" },
      { kind: "image", src: "/img/landing-node-sketch.jpg", alt: "Hand-drawn ROS node architecture", caption: "Node architecture, first sketch" },
    ],
    links: [{ label: "Slides (PDF)", href: "/docs/internship-presentation.pdf" }],
  },
];

export type Doc = {
  title: string;
  type: string;
  meta: string;
  date: string;
  inside: string[];
  href: string;
  source?: { label: string; href: string };
};

export const docs: Doc[] = [
  {
    title: "UAV Flight-Data Analysis and Vision-Based Autonomous Landing",
    type: "Internship report",
    meta: "56 pages · IIT (ISM) project MeitY/2022-2023/958/ECE",
    date: "Jul 2026",
    inside: [
      "Reading ArduPilot logs in Mission Planner and MAVExplorer",
      "Analysis of real flight logs and probable crash causes",
      "ArUco landing: architecture, pipeline, control strategy, Gazebo tests",
      "Expected real-world challenges and future work",
    ],
    href: "/docs/internship-report-uav-flight-logs-vision-landing.pdf",
  },
  {
    title: "Drone SLAM Simulator: User and Technical Manual",
    type: "Technical manual",
    meta: "24 pages · LaTeX, TikZ figures, real screenshots",
    date: "Nov 2026",
    inside: [
      "Full pipeline flowchart and TF tree",
      "How Cartographer builds the map, step by step",
      "Loop closure ON vs OFF experiment",
      "Troubleshooting table from real failures",
    ],
    href: "/docs/drone-slam-simulator-manual.pdf",
    source: { label: "Source on GitHub", href: "https://github.com/nezamimdkaif/drone-slam-simulator" },
  },
  {
    title: "Project Internship Presentation",
    type: "Slides",
    meta: "25 slides",
    date: "Jul 2026",
    inside: [
      "Objectives and work taken up",
      "Flight log collection and DataFlash message types",
      "Findings, challenges and learnings",
      "Autonomy pipeline and next steps",
    ],
    href: "/docs/internship-presentation.pdf",
  },
  {
    title: "Hardware, Safety and Flying Guide",
    type: "Engineering guide",
    meta: "Markdown · real drone",
    date: "Nov 2026",
    inside: [
      "Why the companion computer cannot affect the flight",
      "Wiring, power and flight-controller parameters",
      "Keeping GPS and compass clean, mounting",
      "Bench test before flying and limits of 2D SLAM",
    ],
    href: "https://github.com/nezamimdkaif/drone-slam-simulator/blob/main/docs/HARDWARE_AND_FLYING_GUIDE.md",
  },
  {
    title: "Overview of Global Navigation Satellite System",
    type: "Course certificate",
    meta: "IIRS (ISRO) online course · 8 hours",
    date: "Sep - Oct 2025",
    inside: ["GNSS fundamentals, attended through the BIT Sindri nodal centre"],
    href: "/docs/gnss-course-certificate.pdf",
  },
];

export const skills: { area: string; items: string[] }[] = [
  { area: "Programming", items: ["Python (primary)", "Bash", "C++ (basic)"] },
  { area: "Robotics software", items: ["ROS 2 Humble / Jazzy", "rclpy", "TF2", "RViz", "colcon", "Fast DDS"] },
  { area: "Perception and localization", items: ["Cartographer LiDAR SLAM", "OpenCV", "ArUco pose estimation", "LiDAR-IMU integration"] },
  { area: "Simulation and autopilots", items: ["Gazebo", "PX4 SITL", "ArduPilot SITL", "PX4", "ArduPilot", "MAVLink", "MAVROS"] },
  { area: "Hardware", items: ["Raspberry Pi 4 / 5", "Pixhawk 6C", "Cube Orange", "RPLIDAR A2M12", "Optical flow", "FDM 3D printing"] },
  { area: "Tools", items: ["Linux (Ubuntu)", "Git", "Docker", "LaTeX", "QGroundControl", "Mission Planner"] },
];

export const loopClosure = {
  runs: [
    { off: 0.078, on: 0.339 },
    { off: 0.039, on: 0.52 },
    { off: 0.168, on: 0.388 },
  ],
  avgOff: 0.1,
  avgOn: 0.42,
  worstOn: 1.75,
};

export const sections = [
  { id: "top", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "finding", label: "Finding" },
  { id: "work", label: "Experience" },
  { id: "docs", label: "Documentation" },
  { id: "contact", label: "Contact" },
];
