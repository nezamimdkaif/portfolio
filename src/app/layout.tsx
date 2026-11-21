import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Md Kaif Nezami | Robotics and UAV Autonomy",
  description:
    "Md Kaif Nezami builds autonomy software for drones and mobile robots that fly without GPS: ROS 2, LiDAR SLAM with Cartographer, Gazebo simulation and Python. B.Tech ECE, BIT Sindri.",
  authors: [{ name: "Md Kaif Nezami" }],
  keywords: ["Md Kaif Nezami", "ROS 2", "SLAM", "Cartographer", "UAV", "drone", "robotics", "Python", "Gazebo", "PX4", "ArduPilot"],
  openGraph: {
    title: "Md Kaif Nezami | Robotics and UAV Autonomy",
    description: "Autonomy software for robots that fly without GPS: ROS 2, LiDAR SLAM, Python.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
