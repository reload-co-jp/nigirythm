export const color = {
  bg: "#faf8f3",
  surface: "#f2eee5",
  ink: "#1b1a17",
  sub: "#57534a",
  faint: "#6e685c",
  rule: "#dcd6c8",
  accent: "#c8410b",
  accentInk: "#ffffff",
  accentSoft: "#fbe7dc",
  // 濃い背景（フッター）上の文字・罫線
  onInkSub: "#d6d1c4",
  onInkFaint: "#a8a294",
  onInkRule: "#4a4741",
}

export const font = {
  serif:
    "var(--font-serif), 'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', serif",
  sans: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', system-ui, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
}

export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.375rem",
  xxl: "clamp(1.5rem, 3vw, 2rem)",
  display: "clamp(2.25rem, 6vw, 4rem)",
  hero: "clamp(3.5rem, 13vw, 9rem)",
}

export const lineHeight = {
  tight: 1.15,
  snug: 1.5,
  body: 1.95,
}

export const space = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2.5rem",
  xxl: "4rem",
  xxxl: "6rem",
}

export const width = {
  page: "72rem",
  text: "40rem",
  gutter: "1rem",
}

export const bp = { md: 720, lg: 1024 }

export const mq = {
  md: `@media (min-width: ${bp.md}px)`,
  lg: `@media (min-width: ${bp.lg}px)`,
}

export const transition = "160ms ease"

export const focusRing = {
  outline: `2px solid ${color.accent}`,
  outlineOffset: "2px",
}
