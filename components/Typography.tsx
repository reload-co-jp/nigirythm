"use client"

import styled from "@emotion/styled"
import {
  color,
  font,
  fontSize,
  lineHeight,
  mq,
  space,
  width,
} from "@/styles/tokens"

/** 小見出し上のラベル（英字の欧文キッカー） */
export const Kicker = styled.p({
  fontFamily: font.serif,
  fontSize: fontSize.sm,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: color.accent,
  margin: 0,
})

export const DisplayTitle = styled.h1({
  fontFamily: font.serif,
  fontWeight: 700,
  fontSize: fontSize.display,
  lineHeight: lineHeight.tight,
  letterSpacing: "0.01em",
})

export const SectionTitle = styled.h2({
  fontFamily: font.serif,
  fontWeight: 700,
  fontSize: fontSize.xxl,
  lineHeight: lineHeight.tight,
})

export const SubTitle = styled.h3({
  fontFamily: font.serif,
  fontWeight: 700,
  fontSize: fontSize.xl,
  lineHeight: lineHeight.snug,
})

export const Lede = styled.p({
  fontSize: fontSize.lg,
  lineHeight: lineHeight.body,
  color: color.sub,
  maxWidth: width.text,
})

export const Note = styled.p({
  fontSize: fontSize.sm,
  color: color.faint,
  lineHeight: lineHeight.snug,
})

export const Reading = styled.span({
  fontSize: fontSize.sm,
  color: color.faint,
  letterSpacing: "0.08em",
})

/** 長文（記事本文・固定ページ）の組版 */
export const Prose = styled.div({
  maxWidth: width.text,
  fontSize: fontSize.md,
  lineHeight: lineHeight.body,
  [mq.md]: { fontSize: fontSize.lg },
  "& > * + *": { marginTop: "1.4em" },
  h2: {
    fontFamily: font.serif,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.snug,
    marginTop: "2.6em",
    paddingTop: space.md,
    borderTop: `1px solid ${color.ink}`,
  },
  h3: {
    fontFamily: font.serif,
    fontSize: fontSize.lg,
    marginTop: "2em",
  },
  "ul, ol": { paddingLeft: "1.4em" },
  li: { marginTop: space.xs },
  a: {
    color: color.accent,
    textUnderlineOffset: "0.2em",
  },
  "sup a": {
    textDecoration: "none",
    fontSize: "0.7em",
    padding: "0 0.1em",
  },
  blockquote: {
    borderLeft: `3px solid ${color.accent}`,
    paddingLeft: space.md,
    color: color.sub,
  },
  code: {
    fontFamily: font.mono,
    fontSize: "0.9em",
    background: color.surface,
    padding: "0.1em 0.3em",
  },
})
