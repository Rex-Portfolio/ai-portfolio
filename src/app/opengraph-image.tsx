import { ImageResponse } from "next/og";

export const alt =
  "REXMOND / SYSTEMS. Not every system works. Credit underwriting cut from half a day to 2 minutes.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0b0c0a";
const INK = "#ecefe6";
const MUTED = "#9aa08f";
const DIM = "#6b7163";
const LIME = "#d4ff3a";
const SIGNAL = "#ff5b4a";
const LINE = "rgba(236,239,230,0.12)";

const TEXT =
  "REXMOND / SYSTEMS BUSINESS · CHANGE · AI EVERY BUSINESS HAS A SYSTEM. NOT EVERY SYSTEM WORKS. CREDIT UNDERWRITING Half a day → 2 mins Rexmond Lim Diagnose · Redesign · Adopt · Automate";

/** Space Grotesk subset from Google Fonts (the site's display font); falls back to the default font. */
async function loadFont(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@${weight}&text=${encodeURIComponent(TEXT)}`)
    ).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

// Generated at build time; shown when the site link is shared. Built to read at
// thumbnail size: one big claim, one real proof point.
export default async function Image() {
  const [medium, bold] = await Promise.all([loadFont(500), loadFont(700)]);
  const fonts = [
    ...(medium ? [{ name: "Space Grotesk", data: medium, weight: 500 as const, style: "normal" as const }] : []),
    ...(bold ? [{ name: "Space Grotesk", data: bold, weight: 700 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px 60px",
          backgroundColor: BG,
          backgroundImage: `radial-gradient(ellipse 70% 80% at 0% 0%, rgba(212,255,58,0.16) 0%, transparent 60%), linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 72px 72px, 72px 72px",
          color: INK,
          fontFamily: fonts.length ? "Space Grotesk" : undefined,
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                border: `3px solid ${LIME}`,
              }}
            >
              <div style={{ width: 12, height: 12, backgroundColor: LIME }} />
            </div>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: LIME }}>REXMOND / SYSTEMS</span>
          </div>
          <span style={{ fontSize: 22, letterSpacing: 4, color: MUTED }}>BUSINESS · CHANGE · AI</span>
        </div>

        {/* Claim */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1, color: INK }}>
            EVERY BUSINESS HAS A SYSTEM.
          </span>
          <span
            style={{
              marginTop: 6,
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: -4,
              color: LIME,
            }}
          >
            NOT EVERY SYSTEM WORKS.
          </span>
        </div>

        {/* Proof */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "22px 30px",
              border: `2px solid ${LINE}`,
              borderRadius: 10,
              backgroundColor: "rgba(18,20,16,0.9)",
            }}
          >
            <span style={{ fontSize: 20, letterSpacing: 4, color: MUTED }}>CREDIT UNDERWRITING</span>
            <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 8 }}>
              <span style={{ fontSize: 46, fontWeight: 700, color: SIGNAL, textDecoration: "line-through" }}>
                Half a day
              </span>
              <span style={{ fontSize: 46, color: DIM }}>→</span>
              <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2, color: LIME }}>2 mins</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Rexmond Lim</span>
            <span style={{ fontSize: 20, letterSpacing: 1, color: MUTED, marginTop: 6 }}>
              Diagnose · Redesign · Adopt · Automate
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
