"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import {
  color,
  font,
  fontSize,
  lineHeight,
  space,
  transition,
} from "@/styles/tokens"
import { Note } from "./Typography"

export type ArticleSummary = {
  slug: string
  title: string
  dek: string
  published_at: string
  words: { slug: string; written_form: string }[]
}

const Item = styled.article<{ $featured?: boolean }>(({ $featured }) => ({
  display: "grid",
  gap: space.sm,
  alignContent: "start",
  paddingTop: space.md,
  borderTop: `${$featured ? 3 : 1}px solid ${color.ink}`,
  h3: {
    fontFamily: font.serif,
    fontSize: $featured ? fontSize.display : fontSize.xl,
    lineHeight: lineHeight.tight,
  },
}))

const TitleLink = styled(Link)({
  textDecoration: "none",
  transition: `color ${transition}`,
  "&:hover": { color: color.accent },
})

const Dek = styled.p({
  fontSize: fontSize.sm,
  lineHeight: lineHeight.body,
  color: color.sub,
})

/** 記事が扱う言葉を、見出しの上に「対象語」として大きめの文字で並べる */
const Targets = styled.p({
  fontFamily: font.serif,
  fontSize: fontSize.sm,
  color: color.accent,
  letterSpacing: "0.05em",
})

export const formatDate = (iso: string) => iso.replaceAll("-", ".")

export const ArticleCard = ({
  article,
  featured,
}: {
  article: ArticleSummary
  featured?: boolean
}) => (
  <Item $featured={featured}>
    <Targets>{article.words.map((w) => w.written_form).join(" / ")}</Targets>
    <h3>
      <TitleLink href={`/articles/${article.slug}/`}>{article.title}</TitleLink>
    </h3>
    <Dek>{article.dek}</Dek>
    <Note>
      <time dateTime={article.published_at}>
        {formatDate(article.published_at)}
      </time>
    </Note>
  </Item>
)

export const ArticleGrid = styled.div({
  display: "grid",
  gap: space.xl,
  gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
})
