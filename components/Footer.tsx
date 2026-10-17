"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import { site } from "@/lib/site"
import { color, fontSize, lineHeight, mq, space } from "@/styles/tokens"
import { Logo } from "./Logo"
import { Container } from "./ui"

const Wrap = styled.footer({
  marginTop: space.xxxl,
  background: color.ink,
  color: color.bg,
  paddingBlock: space.xl,
})

const Grid = styled(Container)({
  display: "grid",
  gap: space.xl,
  [mq.md]: { gridTemplateColumns: "1.4fr 1fr 1fr" },
})

const About = styled.div({
  display: "grid",
  gap: space.md,
  alignContent: "start",
  p: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.body,
    color: color.onInkSub,
    maxWidth: "28rem",
  },
})

const LinkList = styled.ul({
  listStyle: "none",
  display: "grid",
  gap: space.sm,
  fontSize: fontSize.sm,
  alignContent: "start",
  a: { textDecoration: "none", color: color.onInkSub },
  "a:hover": { color: color.bg, textDecoration: "underline" },
})

const Bottom = styled(Container)({
  marginTop: space.xl,
  paddingTop: space.md,
  borderTop: `1px solid ${color.onInkRule}`,
  fontSize: fontSize.xs,
  color: color.onInkFaint,
})

export const Footer = () => (
  <Wrap>
    <Grid>
      <About>
        <Logo fontSize="1.25rem" inverted />
        <p>{site.description}</p>
      </About>
      <nav aria-label="コンテンツ">
        <LinkList>
          <li>
            <Link href="/words/">言葉一覧</Link>
          </li>
          <li>
            <Link href="/articles/">読み物</Link>
          </li>
          <li>
            <Link href="/categories/">分類</Link>
          </li>
        </LinkList>
      </nav>
      <nav aria-label="サイト情報">
        <LinkList>
          <li>
            <Link href="/about/">サイト概要</Link>
          </li>
          <li>
            <Link href="/editorial-policy/">編集方針・出典方針</Link>
          </li>
          <li>
            <Link href="/privacy/">プライバシーポリシー</Link>
          </li>
          <li>
            <Link href="/contact/">お問い合わせ</Link>
          </li>
        </LinkList>
      </nav>
    </Grid>
    <Bottom>
      © {site.name}（{site.nameEn}）
    </Bottom>
  </Wrap>
)
