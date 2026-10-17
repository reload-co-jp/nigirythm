"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import { color, fontSize, space } from "@/styles/tokens"

export type Crumb = { name: string; path: string }

const Nav = styled.nav({
  paddingTop: space.md,
  fontSize: fontSize.xs,
  color: color.faint,
  ol: { display: "flex", flexWrap: "wrap", listStyle: "none" },
  "li + li::before": { content: '"／"', paddingInline: space.xs },
  a: { textDecoration: "none" },
  "a:hover": { color: color.accent, textDecoration: "underline" },
})

/** 先頭に「ホーム」を補う。構造化データは JsonLd 側で出力する */
export const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <Nav aria-label="パンくずリスト">
    <ol>
      {[{ name: "ホーム", path: "/" }, ...items].map((item, i, all) => (
        <li key={item.path}>
          {i === all.length - 1 ? (
            <span aria-current="page">{item.name}</span>
          ) : (
            <Link href={item.path}>{item.name}</Link>
          )}
        </li>
      ))}
    </ol>
  </Nav>
)
