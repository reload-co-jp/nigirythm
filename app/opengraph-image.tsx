import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const alt = "nigirythm"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// 日本語フォントを同梱しないため、OGP画像は欧文のワードマークのみで構成する
const OpengraphImage = () =>
  new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#faf8f3",
        color: "#1b1a17",
        padding: 80,
        borderBottom: "24px solid #c8410b",
      }}
    >
      <div style={{ display: "flex", fontSize: 40, letterSpacing: 6 }}>
        DOUBLE MEANINGS, ONE WORD
      </div>
      <div style={{ display: "flex", fontSize: 168, fontWeight: 700 }}>
        nigi
        <span style={{ color: "#1b1a17", textShadow: "10px 10px 0 #c8410b" }}>
          rythm
        </span>
      </div>
      <div style={{ display: "flex", fontSize: 44 }}>
        PR / Mac / Mouse / Cloud / Python
      </div>
    </div>,
    size
  )

export default OpengraphImage
