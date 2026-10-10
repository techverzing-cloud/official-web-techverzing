import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Techverzing Technologies — Where Technology Meets Business Growth";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public/global/logo.png"),
    "base64",
  );
  const logoSrc = `data:image/png;base64,${logoData}`;

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
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #2a1b54 0%, #0d0d12 60%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- raw img required inside ImageResponse */}
        <img
          src={logoSrc}
          alt=""
          width={540}
          height={118}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 80,
              height: 1,
              background: "#7142e8",
            }}
          />
          <div style={{ fontSize: 30, color: "#a1a1aa", letterSpacing: 2 }}>
            Where Technology Meets Business Growth.
          </div>
          <div
            style={{
              width: 80,
              height: 1,
              background: "#7142e8",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: "#71717a",
            letterSpacing: 1,
          }}
        >
          Digital Marketing &amp; IT Solutions Agency
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}