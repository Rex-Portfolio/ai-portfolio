import { ImageResponse } from "next/og";

export const alt = "Rexmond Lim, AI & Business Transformation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated at build time; shown when the site link is shared.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background:
            "radial-gradient(ellipse 80% 70% at 20% 0%, rgba(79,110,247,0.28) 0%, #0d0d0f 65%)",
          backgroundColor: "#0d0d0f",
          color: "#e8e8e8",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.04em" }}>
          Rexmond Lim
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#4f6ef7",
          }}
        >
          AI & Business Transformation
        </div>
        <div style={{ marginTop: 36, fontSize: 34, color: "#9ca3af", maxWidth: 900 }}>
          Strategy and hands-on AI delivery that replaces manual workflows with
          measurable results.
        </div>
      </div>
    ),
    size,
  );
}
