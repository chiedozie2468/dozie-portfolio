import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Chiedozie Onyekwelu (Dozie) — Full-Stack Software Developer & Web Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F8F8F6",
          color: "#0D0D0D",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Dozie
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#525252",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Full-Stack Software Developer · Lagos, Nigeria
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 300,
              color: "#404040",
            }}
          >
            Welcome to my corner.
          </div>
          <div
            style={{
              fontSize: 112,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              color: "#0D0D0D",
            }}
          >
            chiedozie.
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: "#262626",
              maxWidth: "920px",
              lineHeight: 1.35,
            }}
          >
            I build digital experiences that turn ideas into useful products —
            React, Next.js, TypeScript, React Native &amp; Convex.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #DFDFDC",
            paddingTop: "24px",
            fontSize: 18,
            color: "#525252",
          }}
        >
          <span>Chiedozie Onyekwelu</span>
          <span>chiedozieonyekwelu989@gmail.com · +234 915 325 1972</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
