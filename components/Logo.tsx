"use client"

import styled from "@emotion/styled"
import { color, font } from "@/styles/tokens"

/**
 * シンボル：上の一本線（ひとつの表記）が、下で二本に分岐する（二つの意味）。
 * 「二」の字と分岐を重ねた形で、ファビコン（app/icon.svg）にも同じ図形を使う。
 */
export const LogoSymbol = ({
  size = 28,
  inverted,
}: {
  size?: number
  inverted?: boolean
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      width="32"
      height="32"
      rx="6"
      fill={inverted ? color.bg : color.ink}
    />
    <path
      d="M8 11h16"
      stroke={inverted ? color.ink : color.bg}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M8 21h6l4-4h6M14 21l4 4h6"
      fill="none"
      stroke={color.accent}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Mark = styled.span<{ $size: string; $inverted?: boolean }>(
  ({ $size, $inverted }) => ({
    fontSize: $size,
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5em",
    fontFamily: font.serif,
    fontWeight: 700,
    letterSpacing: "0.02em",
    lineHeight: 1,
    color: $inverted ? color.bg : color.ink,
  })
)

/** rythm は残響のように右下へずらした影を重ね、「反復・反響」を表す */
const Rythm = styled.span({
  position: "relative",
  textShadow: `0.07em 0.07em 0 ${color.accent}`,
})

export const Logo = ({
  fontSize = "1.5rem",
  inverted,
}: {
  fontSize?: string
  inverted?: boolean
}) => (
  <Mark $size={fontSize} $inverted={inverted}>
    <LogoSymbol
      size={Math.round(parseFloat(fontSize) * 16 * 1.15)}
      inverted={inverted}
    />
    <span>
      nigi
      <Rythm>rythm</Rythm>
    </span>
  </Mark>
)
