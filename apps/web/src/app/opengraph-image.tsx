import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b5548",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>
          Asia Health Link &amp; Travel
        </div>
        <div style={{ fontSize: 32, marginTop: 28, color: "#e3f3ef" }}>
          Coordinated Treatment &amp; Visit in China
        </div>
      </div>
    ),
    { ...size },
  );
}
