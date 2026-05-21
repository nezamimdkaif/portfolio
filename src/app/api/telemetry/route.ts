import { NextResponse } from "next/server";

export async function GET() {
  // Generate slightly randomized real-time drone telemetry simulating a 2050 autonomous docking landing procedure
  const time = Date.now();
  
  // Oscillate values around plausible target states
  const targetLat = 12.9716; // Simulated ISRO testing ground coordinate
  const targetLng = 77.5946;
  
  const phase = (time / 5000) % (Math.PI * 2);
  const distance = Math.max(0, 5.2 - Math.abs(Math.sin(phase) * 5.0)).toFixed(2);
  const isDocked = parseFloat(distance) < 0.05;
  const isCharging = isDocked;

  const pitch = (Math.sin(time / 800) * 2.5).toFixed(1);
  const roll = (Math.cos(time / 1000) * 1.5).toFixed(1);
  const yaw = ((time / 500) % 360).toFixed(1);
  
  const batteryPct = Math.max(12, 100 - ((time / 60000) % 15)).toFixed(0);
  const currentDraw = isCharging ? "-4.5A (CHARGING)" : "12.8A";
  
  const alignmentX = (Math.sin(time / 600) * 0.12).toFixed(3);
  const alignmentY = (Math.cos(time / 700) * 0.08).toFixed(3);

  const telemetry = {
    timestamp: time,
    status: isDocked ? "DOCKED" : "DESCENDING_ALIGNMENT",
    uav: {
      model: "MKN-ALPHA-2050",
      battery: `${batteryPct}%`,
      currentDraw,
      voltage: "16.4V",
      coordinates: {
        lat: (targetLat + Math.sin(time / 5000) * 0.0001).toFixed(6),
        lng: (targetLng + Math.cos(time / 5000) * 0.0001).toFixed(6),
      },
      altitude: isDocked ? "0.00m" : `${Math.max(0, parseFloat(distance) * 0.8).toFixed(2)}m`,
      heading: `${yaw}°`,
      orientation: { pitch: `${pitch}°`, roll: `${roll}°` },
    },
    groundStation: {
      type: "Oval Electromagnetic Induction Cradle v4",
      magneticLock: isDocked ? "LOCKED" : "STANDBY",
      chargerOutput: isCharging ? "150W (Fast Induction)" : "0W",
      alignmentError: {
        x: `${alignmentX}m`,
        y: `${alignmentY}m`,
      },
      thermalState: "34.2°C",
    }
  };

  return NextResponse.json(telemetry);
}
