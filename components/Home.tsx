"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import type { WordSummary } from "@/lib/data"
import {
  color,
  font,
  fontSize,
  lineHeight,
  mq,
  space,
  transition,
} from "@/styles/tokens"
import { ArticleCard, type ArticleSummary } from "./ArticleCard"
import { SearchBox } from "./SearchBox"
import { Lede, Reading } from "./Typography"

/* ---------- ヒーロー ---------- */

const HeroWrap = styled.section({
  display: "grid",
  gap: space.xl,
  paddingBlock: `${space.xxl} ${space.xl}`,
  [mq.lg]: {
    gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
    alignItems: "end",
    paddingBlock: `${space.xxxl} ${space.xxl}`,
  },
})

const Tagline = styled.h1({
  fontFamily: font.serif,
  fontWeight: 700,
  fontSize: fontSize.display,
  lineHeight: lineHeight.tight,
  // 「もうひとつの意味」を、ずれて重なるもう一行として見せる
  span: {
    display: "block",
    color: color.accent,
  },
})

const HeroText = styled.div({ display: "grid", gap: space.lg })

const Examples = styled.p({
  fontSize: fontSize.sm,
  color: color.faint,
  a: { marginLeft: space.sm, color: color.ink },
  "a:hover": { color: color.accent },
})

/** 「PR」を例に、ひとつの表記の裏に複数の正式名称が重なる様子を文字だけで示す */
const Specimen = styled.figure({
  position: "relative",
  borderTop: `2px solid ${color.ink}`,
  borderBottom: `1px solid ${color.ink}`,
  paddingBlock: space.lg,
  display: "grid",
  gap: space.sm,
})

const SpecimenWord = styled.p({
  fontFamily: font.serif,
  fontWeight: 700,
  fontSize: fontSize.hero,
  lineHeight: 0.9,
  position: "relative",
  isolation: "isolate",
  "&::after": {
    content: "attr(data-echo)",
    position: "absolute",
    left: "0.06em",
    top: "0.06em",
    color: "transparent",
    WebkitTextStroke: `1px ${color.accent}`,
    zIndex: -1,
  },
})

const SpecimenList = styled.ul({
  listStyle: "none",
  display: "grid",
  gap: space.xs,
  fontFamily: font.serif,
  fontSize: fontSize.md,
  li: { display: "flex", gap: space.sm, alignItems: "baseline" },
  "li span": {
    fontSize: fontSize.xs,
    color: color.faint,
    fontFamily: font.sans,
  },
  em: { fontStyle: "normal" },
  b: { color: color.accent },
})

export const Hero = () => (
  <HeroWrap>
    <HeroText>
      <Tagline>
        言葉の裏に、
        <span>もうひとつの意味。</span>
      </Tagline>
      <Lede>
        同じ音、同じ表記なのに、指しているものがまるで違う。ニギリスムは、そんな「二義」の言葉を集め、意味が分かれた経緯や由来を出典とともにたどる、読み物の辞典です。
      </Lede>
      <SearchBox large id="hero-search" />
      <Examples>
        例：
        <Link href="/words/pr/">PR</Link>
        <Link href="/words/mouse/">マウス</Link>
        <Link href="/words/cloud/">クラウド</Link>
        <Link href="/words/python/">パイソン</Link>
      </Examples>
    </HeroText>
    <Specimen aria-label="例：PRの複数の意味">
      <SpecimenWord data-echo="PR" aria-hidden="true">
        PR
      </SpecimenWord>
      <SpecimenList>
        <li>
          <span>広報</span>
          <em>
            <b>P</b>ublic <b>R</b>elations
          </em>
        </li>
        <li>
          <span>報道</span>
          <em>
            <b>P</b>ress <b>R</b>elease
          </em>
        </li>
        <li>
          <span>開発</span>
          <em>
            <b>P</b>ull <b>R</b>equest
          </em>
        </li>
      </SpecimenList>
    </Specimen>
  </HeroWrap>
)

/* ---------- 今日の言葉 ---------- */

const Today = styled.div({
  display: "grid",
  gap: space.lg,
  [mq.md]: {
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
    gap: space.xxl,
  },
})

const TodayWord = styled(Link)({
  display: "grid",
  gap: space.sm,
  alignContent: "start",
  textDecoration: "none",
  strong: {
    fontFamily: font.serif,
    fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
    lineHeight: 1,
    whiteSpace: "nowrap",
    transition: `color ${transition}`,
  },
  "&:hover strong": { color: color.accent },
})

const Meanings = styled.ol({
  listStyle: "none",
  counterReset: "m",
  display: "grid",
  borderTop: `1px solid ${color.ink}`,
  li: {
    counterIncrement: "m",
    display: "flex",
    gap: space.md,
    paddingBlock: space.sm,
    borderBottom: `1px solid ${color.rule}`,
    fontFamily: font.serif,
    fontSize: fontSize.lg,
  },
  "li::before": {
    content: "counter(m)",
    color: color.accent,
    minWidth: "1.5em",
  },
})

const TodayBody = styled.div({ display: "grid", gap: space.md })

export const WordOfTheDay = ({ word }: { word: WordSummary }) => (
  <Today>
    <TodayWord href={`/words/${word.slug}/`}>
      <strong>{word.written_form}</strong>
      <Reading>{word.reading}</Reading>
    </TodayWord>
    <TodayBody>
      <Meanings aria-label="意味">
        {word.senseLabels.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </Meanings>
      <Lede>{word.summary}</Lede>
      <Link href={`/words/${word.slug}/`}>由来と出典を読む →</Link>
    </TodayBody>
  </Today>
)

/* ---------- 新着記事 ---------- */

const Latest = styled.div({
  display: "grid",
  gap: space.xl,
  [mq.lg]: { gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)" },
})

const LatestSide = styled.div({
  display: "grid",
  gap: space.lg,
  alignContent: "start",
})

export const LatestArticles = ({
  articles,
}: {
  articles: ArticleSummary[]
}) => {
  const [first, ...rest] = articles
  return (
    <Latest>
      {first && <ArticleCard article={first} featured />}
      <LatestSide>
        {rest.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </LatestSide>
    </Latest>
  )
}

/* ---------- 分類から探す ---------- */

const CategoryGrid = styled.ul({
  listStyle: "none",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
  gap: `0 ${space.xl}`,
})

const CategoryLink = styled(Link)({
  display: "grid",
  gap: space.xs,
  paddingBlock: space.md,
  borderBottom: `1px solid ${color.rule}`,
  textDecoration: "none",
  height: "100%",
  strong: {
    fontFamily: font.serif,
    fontSize: fontSize.lg,
    display: "flex",
    justifyContent: "space-between",
    transition: `color ${transition}`,
  },
  "strong span": {
    fontSize: fontSize.sm,
    color: color.faint,
    fontFamily: font.sans,
  },
  p: { fontSize: fontSize.sm, color: color.sub, lineHeight: lineHeight.snug },
  "&:hover strong": { color: color.accent },
})

export const CategoryDirectory = ({
  categories,
}: {
  categories: {
    slug: string
    name: string
    description: string
    count: number
  }[]
}) => (
  <CategoryGrid>
    {categories.map((c) => (
      <li key={c.slug}>
        <CategoryLink href={`/categories/${c.slug}/`}>
          <strong>
            {c.name}
            <span>{c.count}語</span>
          </strong>
          <p>{c.description}</p>
        </CategoryLink>
      </li>
    ))}
  </CategoryGrid>
)

/* ---------- 関連語をたどる ---------- */

const Chains = styled.ul({
  listStyle: "none",
  display: "grid",
  gap: space.sm,
})

const Chain = styled.li({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  gap: space.sm,
  paddingBlock: space.sm,
  borderBottom: `1px solid ${color.rule}`,
  a: {
    fontFamily: font.serif,
    fontSize: fontSize.lg,
    textDecoration: "none",
  },
  "a:first-of-type": { fontWeight: 700 },
  "a:hover": { color: color.accent },
  '& > span[aria-hidden="true"]': { color: color.faint },
})

export const RelationChains = ({
  chains,
}: {
  chains: { from: WordSummary; to: WordSummary[] }[]
}) => (
  <Chains>
    {chains.map(({ from, to }) => (
      <Chain key={from.slug}>
        <Link href={`/words/${from.slug}/`}>{from.written_form}</Link>
        <span aria-hidden="true">―</span>
        {to.map((w, i) => (
          <span key={w.slug}>
            {i > 0 && "・"}
            <Link href={`/words/${w.slug}/`}>{w.written_form}</Link>
          </span>
        ))}
      </Chain>
    ))}
  </Chains>
)
