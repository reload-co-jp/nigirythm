"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import { color, font, fontSize, space, transition } from "@/styles/tokens"
import { Reading } from "./Typography"

export type RelatedItem = {
  slug: string
  written_form: string
  reading: string
  /** 関連する理由や意味の違いを短く添える */
  note?: string
}

const List = styled.ul({
  listStyle: "none",
  display: "grid",
})

const Row = styled(Link)({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: `0 ${space.md}`,
  paddingBlock: space.sm,
  borderBottom: `1px solid ${color.rule}`,
  textDecoration: "none",
  transition: `color ${transition}, padding ${transition}`,
  strong: { fontFamily: font.serif, fontSize: fontSize.lg },
  "&:hover": { color: color.accent, paddingLeft: space.xs },
  small: {
    flexBasis: "100%",
    fontSize: fontSize.xs,
    color: color.faint,
    lineHeight: 1.6,
  },
})

export const RelatedWords = ({ words }: { words: RelatedItem[] }) => (
  <List>
    {words.map((w) => (
      <li key={w.slug}>
        <Row href={`/words/${w.slug}/`}>
          <strong>{w.written_form}</strong>
          <Reading>{w.reading}</Reading>
          {w.note && <small>{w.note}</small>}
        </Row>
      </li>
    ))}
  </List>
)
