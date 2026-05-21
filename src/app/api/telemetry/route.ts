import { NextResponse } from "next/server";

export async function GET() {
  // Generate highly realistic, dynamic real-time telemetry simulating the ISRO IROC 2026 UAV landing protocol
  const time = Date.now();
  
  // Real coordinates: BIT Sindri ECE Department and IIT (ISM) Dhanbad Drone Lab
  const targetLat = 23.8125; 
  const targetLng = 86.4412;
  
  const phase = (time / 6000) % (Math.PI * 2);
  // Altimeter profile descending from 8.5m down to touchdown (0.08m including skid clearance)
  const altitudeVal = Math.max(0.08, 8.5 - Math.abs(Math.sin(phase) * 8.42));
  const isDocked = altitudeVal <= 0.15;
  const isCharging = isDocked;

  // Real IMU dynamics (minor engine vibrations and landing sway)
  const pitch = (isDocked ? 0.0 : Math.sin(time / 400) * 1.8).toFixed(1);
  const roll = (isDocked ? 0.0 : Math.cos(time / 500) * 1.2).toFixed(1);
  const yaw = ((isDocked ? 185.0 : 184.2 + Math.sin(time / 2000) * 0.8) % 360).toFixed(1);
  
  // Real 4S LiPo battery parameters (16.8V fully charged, 14.8V nominal, discharging down to 14.0V)
  const batteryPct = Math.max(26, 96 - ((time / 120000) % 70)).toFixed(0);
  const voltage = (isCharging ? 15.27 : 14.84 - (100 - parseFloat(batteryPct)) * 0.008).toFixed(2);
  const currentDraw = isCharging ? "-2.68A (CHARGING)" : "12.80A (DISCHARGING)";
  
  // ArUco optical alignment errors (measured in meters on the GCS solver)
  const alignmentX = (isDocked ? 0.000 : Math.sin(time / 600) * 0.08).toFixed(3);
  const alignmentY = (isDocked ? 0.000 : Math.cos(time / 700) * 0.05).toFixed(3);

  const telemetry = {
    timestamp: time,
    status: isDocked ? "DOCKED" : "DESCENDING_ALIGNMENT",
    uav: {
      model: "ISRO IROC Hexacopter v2",
      battery: `${batteryPct}%`,
      currentDraw,
      voltage: `${voltage}V`,
      coordinates: {
        lat: (targetLat + (isDocked ? 0.000000 : Math.sin(time / 6000) * 0.00008)).toFixed(6),
        lng: (targetLng + (isDocked ? 0.000000 : Math.cos(time / 6000) * 0.00008)).toFixed(6),
      },
      altitude: `${altitudeVal.toFixed(2)}m`,
      heading: `${yaw}°`,
      orientation: { pitch: `${pitch}°`, roll: `${roll}°` },
    },
    groundStation: {
      type: "Precision ArUco Charging Dock v2",
      magneticLock: isDocked ? "LOCKED" : "STANDBY",
      chargerOutput: isCharging ? "40.9W (2.68A @ 15.27V)" : "0.0W",
      alignmentError: {
        x: `${(parseFloat(alignmentX) * 1000).toFixed(1)}mm`,
        y: `${(parseFloat(alignmentY) * 1000).toFixed(1)}mm`,
      },
      thermalState: "32.4°C",
    }
  };

  return NextResponse.json(telemetry);
}
