"use client"

import styled from "@emotion/styled"
import { ReactNode } from "react"
import type { Source } from "@/lib/data"
import { color, font, fontSize, lineHeight, mq, space } from "@/styles/tokens"
import { ArticleCard, type ArticleSummary, formatDate } from "./ArticleCard"
import { CategoryLabel, LabelRow } from "./CategoryLabel"
import { RelatedWords } from "./RelatedWords"
import { SourceList } from "./SourceList"
import { Note, Prose, SectionTitle } from "./Typography"
import { Aside, Section, SideBox, TwoColumn } from "./ui"

const Head = styled.header({
  display: "grid",
  gap: space.lg,
  paddingBlock: `${space.xl} ${space.xl}`,
  maxWidth: "52rem",
  [mq.md]: { paddingBlock: `${space.xxl} ${space.xl}` },
})

const Targets = styled.p({
  fontFamily: font.serif,
  fontSize: fontSize.xl,
  color: color.accent,
  letterSpacing: "0.04em",
})

const Title = styled.h1({
  fontFamily: font.serif,
  fontWeight: 700,
  fontSize: fontSize.display,
  lineHeight: lineHeight.tight,
})

const Dek = styled.p({
  fontSize: fontSize.lg,
  lineHeight: lineHeight.body,
  color: color.sub,
  paddingLeft: space.md,
  borderLeft: `3px solid ${color.accent}`,
})

const Body = styled(Prose)({
  paddingTop: space.xl,
  borderTop: `2px solid ${color.ink}`,
  // 導入段落を少し大きく組み、雑誌記事の書き出しらしくする
  "& > p:first-of-type": {
    fontSize: fontSize.lg,
    [mq.md]: { fontSize: fontSize.xl },
  },
})

export const ArticleLayout = ({
  title,
  dek,
  publishedAt,
  updatedAt,
  words,
  categories,
  sources,
  others,
  children,
}: {
  title: string
  dek: string
  publishedAt: string
  updatedAt: string
  words: { slug: string; written_form: string; reading: string }[]
  categories: { slug: string; name: string }[]
  sources: Source[]
  others: ArticleSummary[]
  children: ReactNode
}) => (
  <article>
    <Head>
      <Targets>{words.map((w) => w.written_form).join(" / ")}</Targets>
      <Title>{title}</Title>
      <Dek>{dek}</Dek>
      <LabelRow aria-label="分類">
        {categories.map((c) => (
          <li key={c.slug}>
            <CategoryLabel {...c} />
          </li>
        ))}
      </LabelRow>
      <Note>
        公開 <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        {updatedAt !== publishedAt && (
          <>
            ／更新 <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
          </>
        )}
      </Note>
    </Head>
    <TwoColumn>
      <div>
        <Body>{children}</Body>
        <Section aria-labelledby="sources">
          <SectionTitle id="sources">出典</SectionTitle>
          <SourceList sources={sources} />
        </Section>
      </div>
      <Aside>
        <SideBox title="この記事の言葉">
          <RelatedWords words={words} />
        </SideBox>
        {others.length > 0 && (
          <SideBox title="ほかの読み物">
            {others.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </SideBox>
        )}
      </Aside>
    </TwoColumn>
  </article>
)
