"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import { color, font, fontSize, space, transition } from "@/styles/tokens"
import { Reading } from "./Typography"

type Item = { slug: string; written_form: string; reading: string }

const List = styled.ul({
  listStyle: "none",
  display: "grid",
})

const Row = styled(Link)({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: space.md,
  paddingBlock: space.sm,
  borderBottom: `1px solid ${color.rule}`,
  textDecoration: "none",
  transition: `color ${transition}, padding ${transition}`,
  strong: { fontFamily: font.serif, fontSize: fontSize.lg },
  "&:hover": { color: color.accent, paddingLeft: space.xs },
})

export const RelatedWords = ({ words }: { words: Item[] }) => (
  <List>
    {words.map((w) => (
      <li key={w.slug}>
        <Row href={`/words/${w.slug}/`}>
          <strong>{w.written_form}</strong>
          <Reading>{w.reading}</Reading>
        </Row>
      </li>
    ))}
  </List>
)
