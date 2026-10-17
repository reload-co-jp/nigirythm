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
import { CategoryLabel, LabelRow } from "./CategoryLabel"
import { Reading } from "./Typography"

const Item = styled.article({
  display: "grid",
  gap: space.sm,
  paddingBlock: space.lg,
  borderBottom: `1px solid ${color.rule}`,
  [mq.md]: {
    gridTemplateColumns: "12rem minmax(0, 1fr)",
    gap: space.lg,
  },
})

const Head = styled.div({
  display: "grid",
  gap: space.xs,
  alignContent: "start",
})

const Title = styled.h3({
  fontFamily: font.serif,
  fontSize: fontSize.xxl,
  lineHeight: lineHeight.tight,
  a: {
    textDecoration: "none",
    backgroundImage: `linear-gradient(${color.accent}, ${color.accent})`,
    backgroundSize: "0 2px",
    backgroundPosition: "0 100%",
    backgroundRepeat: "no-repeat",
    transition: `background-size ${transition}`,
  },
  "a:hover": { backgroundSize: "100% 2px" },
})

const Body = styled.div({ display: "grid", gap: space.sm })

const Summary = styled.p({
  fontSize: fontSize.sm,
  lineHeight: lineHeight.body,
  color: color.sub,
})

/** 意味の数だけ並ぶラベル。「ひとつの表記に複数の意味」を一覧でも見せる */
const Senses = styled.ol({
  display: "flex",
  flexWrap: "wrap",
  gap: `${space.xs} ${space.md}`,
  listStyle: "none",
  fontSize: fontSize.sm,
  counterReset: "sense",
  li: { counterIncrement: "sense" },
  "li::before": {
    content: "counter(sense) '. '",
    fontFamily: font.serif,
    color: color.accent,
  },
})

const Facts = styled.ul({
  display: "flex",
  flexWrap: "wrap",
  gap: `${space.xs} ${space.sm}`,
  listStyle: "none",
  fontSize: fontSize.xs,
  color: color.sub,
})

/** 成り立ちの区別。色に頼らず、文言と罫線の種類（実線／破線）で示す */
const Kind = styled.li<{ $distinct: boolean }>(({ $distinct }) => ({
  padding: "0 0.4em",
  border: `1px ${$distinct ? "dashed" : "solid"} ${color.sub}`,
}))

export const WordFacts = ({ word }: { word: WordSummary }) => (
  <Facts aria-label="この言葉の概要">
    <li>{word.senseLabels.length}つの意味</li>
    <Kind $distinct={word.distinctOrigins}>
      {word.distinctOrigins ? "由来が別の意味を含む" : "意味がつながる多義語"}
    </Kind>
    {word.articleCount > 0 && <li>読み物{word.articleCount}本</li>}
  </Facts>
)

export const WordCard = ({ word }: { word: WordSummary }) => (
  <Item>
    <Head>
      <Title>
        <Link href={`/words/${word.slug}/`}>{word.written_form}</Link>
      </Title>
      <Reading>{word.reading}</Reading>
      <WordFacts word={word} />
    </Head>
    <Body>
      <Senses aria-label="意味">
        {word.senseLabels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </Senses>
      <Summary>{word.summary}</Summary>
      <LabelRow>
        {word.categories.map((c) => (
          <li key={c.slug}>
            <CategoryLabel {...c} />
          </li>
        ))}
      </LabelRow>
    </Body>
  </Item>
)

const IndexGrid = styled.ul({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
  listStyle: "none",
  borderTop: `1px solid ${color.rule}`,
  borderLeft: `1px solid ${color.rule}`,
})

const IndexLink = styled(Link)({
  display: "grid",
  gap: space.xs,
  padding: space.md,
  height: "100%",
  borderRight: `1px solid ${color.rule}`,
  borderBottom: `1px solid ${color.rule}`,
  textDecoration: "none",
  transition: `background ${transition}`,
  strong: { fontFamily: font.serif, fontSize: fontSize.xl, lineHeight: 1.2 },
  "&:hover": { background: color.surface },
  "&:hover strong": { color: color.accent },
})

/** 見出し語だけを並べる索引型の一覧（トップページ用） */
export const WordIndex = ({ words }: { words: WordSummary[] }) => (
  <IndexGrid>
    {words.map((w) => (
      <li key={w.slug}>
        <IndexLink href={`/words/${w.slug}/`}>
          <strong>{w.written_form}</strong>
          <Reading>
            {w.reading}・{w.senseLabels.length}義
          </Reading>
        </IndexLink>
      </li>
    ))}
  </IndexGrid>
)
