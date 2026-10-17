"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import { color, fontSize, space, transition } from "@/styles/tokens"

const Label = styled(Link)({
  display: "inline-block",
  fontSize: fontSize.xs,
  lineHeight: 1.6,
  padding: `0 ${space.sm}`,
  border: `1px solid ${color.ink}`,
  borderRadius: "999px",
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: `background ${transition}, color ${transition}`,
  "&:hover": { background: color.ink, color: color.bg },
})

export const CategoryLabel = ({
  slug,
  name,
}: {
  slug: string
  name: string
}) => <Label href={`/categories/${slug}/`}>{name}</Label>

export const LabelRow = styled.ul({
  display: "flex",
  flexWrap: "wrap",
  gap: space.xs,
  listStyle: "none",
})

export const Tag = styled.span({
  fontSize: fontSize.xs,
  color: color.faint,
  "&::before": { content: '"#"' },
})
