import { ImageResponse } from "next/og";

export const alt = "REXMOND / SYSTEMS. Every business has a system. Not every system works.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated at build time; shown when the site link is shared.
export default function Image() {
  const lime = "#d4ff3a";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          backgroundColor: "#0b0c0a",
          backgroundImage:
            "linear-gradient(rgba(236,239,230,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(236,239,230,0.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          color: "#ecefe6",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 4 }}>
          <span style={{ color: lime }}>REXMOND / SYSTEMS</span>
          <span style={{ color: "#9aa08f" }}>BUSINESS / TECHNOLOGY / OPERATIONS</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          <span>EVERY BUSINESS HAS A SYSTEM.</span>
          <span style={{ color: lime }}>NOT EVERY SYSTEM WORKS.</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9aa08f" }}>
          Rexmond Lim · Diagnose. Design. Transform. Measure.
        </div>
      </div>
    ),
    size,
  );
}
