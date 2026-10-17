"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import { ReactNode } from "react"
import type { Certainty } from "@/lib/data"
import {
  color,
  font,
  fontSize,
  mq,
  space,
  transition,
  width,
} from "@/styles/tokens"
import { Kicker, SectionTitle } from "./Typography"

export const Container = styled.div({
  width: "100%",
  maxWidth: `calc(${width.page} + ${width.gutter} * 2)`,
  marginInline: "auto",
  paddingInline: width.gutter,
  [mq.md]: { paddingInline: space.lg },
})

export const Section = styled.section({
  paddingBlock: space.xl,
  borderTop: `1px solid ${color.ink}`,
  [mq.md]: { paddingBlock: space.xxl },
})

export const PageHeader = styled.header({
  paddingBlock: `${space.xl} ${space.lg}`,
  display: "grid",
  gap: space.md,
  [mq.md]: { paddingBlock: `${space.xxl} ${space.xl}` },
})

const HeadRow = styled.div({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: space.md,
  marginBottom: space.lg,
  flexWrap: "wrap",
})

const MoreLink = styled(Link)({
  fontSize: fontSize.sm,
  textDecoration: "none",
  borderBottom: `1px solid ${color.ink}`,
  transition: `color ${transition}, border-color ${transition}`,
  "&:hover": { color: color.accent, borderColor: color.accent },
})

export const SectionHead = ({
  kicker,
  title,
  more,
  id,
}: {
  kicker: string
  title: string
  more?: { href: string; label: string }
  id?: string
}) => (
  <HeadRow>
    <div>
      <Kicker>{kicker}</Kicker>
      <SectionTitle id={id}>{title}</SectionTitle>
    </div>
    {more && <MoreLink href={more.href}>{more.label} →</MoreLink>}
  </HeadRow>
)

/** 2カラム（本文＋サイド）レイアウト。モバイルでは1カラム */
export const TwoColumn = styled.div({
  display: "grid",
  gap: space.xl,
  [mq.lg]: {
    gridTemplateColumns: "minmax(0, 1fr) 18rem",
    gap: space.xxl,
  },
})

export const Aside = styled.aside({
  display: "grid",
  gap: space.xl,
  alignContent: "start",
})

export const MetaList = styled.dl({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: `${space.xs} ${space.md}`,
  fontSize: fontSize.sm,
  dt: { color: color.faint },
  dd: { margin: 0 },
})

const BoxTitle = styled.h2({
  fontFamily: font.serif,
  fontSize: fontSize.md,
  paddingBottom: space.sm,
  marginBottom: space.md,
  borderBottom: `1px solid ${color.ink}`,
})

export const SideBox = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <section>
    <BoxTitle>{title}</BoxTitle>
    {children}
  </section>
)

export const Empty = styled.p({
  color: color.faint,
  fontSize: fontSize.sm,
  paddingBlock: space.lg,
})

const certaintyColor: Record<Certainty, string> = {
  confirmed: color.ink,
  probable: color.sub,
  disputed: color.accent,
  unknown: color.faint,
}

/** 根拠の確度。文言で示し、色と罫線（未確認は破線）は補助 */
export const Badge = styled.span<{ $certainty: Certainty }>(
  ({ $certainty }) => ({
    display: "inline-block",
    fontSize: fontSize.xs,
    padding: "0 0.5em",
    border: `1px solid ${certaintyColor[$certainty]}`,
    color: certaintyColor[$certainty],
    borderStyle: $certainty === "unknown" ? "dashed" : "solid",
  })
)
