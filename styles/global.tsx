"use client"

import { Global } from "@emotion/react"
import { color, focusRing, font, lineHeight } from "./tokens"

// グローバルスタイルはリセット・フォント・基本色に限定する
export const GlobalStyle = () => (
  <Global
    styles={{
      "*, *::before, *::after": { boxSizing: "border-box" },
      "html, body, h1, h2, h3, h4, p, figure, blockquote, dl, dd, ol, ul": {
        margin: 0,
      },
      "ol, ul": { padding: 0 },
      html: {
        colorScheme: "light",
        WebkitTextSizeAdjust: "100%",
        scrollPaddingTop: "1rem",
      },
      body: {
        background: color.bg,
        color: color.ink,
        fontFamily: font.sans,
        lineHeight: lineHeight.snug,
        WebkitFontSmoothing: "antialiased",
        overflowWrap: "anywhere",
      },
      a: { color: "inherit" },
      "img, svg": { display: "block", maxWidth: "100%" },
      "button, input, select": { font: "inherit", color: "inherit" },
      ":focus-visible": focusRing,
      ".visually-hidden": {
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        whiteSpace: "nowrap",
      },
      "::selection": { background: color.accentSoft },
    }}
  />
)
