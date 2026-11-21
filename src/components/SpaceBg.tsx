"use client";

import dynamic from "next/dynamic";

const SpaceBackground = dynamic(() => import("./SpaceBackground"), { ssr: false });
export default SpaceBackground;
