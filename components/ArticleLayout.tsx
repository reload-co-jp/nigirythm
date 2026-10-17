"use client"

import styled from "@emotion/styled"
import { ReactNode } from "react"
import type { Source } from "@/lib/data"
import { color, font, fontSize, lineHeight, mq, space } from "@/styles/tokens"
import { ArticleCard, type ArticleSummary, formatDate } from "./ArticleCard"
import { CategoryLabel, LabelRow } from "./CategoryLabel"
import { type RelatedItem, RelatedWords } from "./RelatedWords"
import { SourceList } from "./SourceList"
import { Note, Prose, SectionTitle } from "./Typography"
import { Aside, Section, SideBox, TwoColumn } from "./ui"

const WordColumns = styled.div({
  display: "grid",
  gap: space.xl,
  [mq.md]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  h3: {
    fontFamily: font.serif,
    fontSize: fontSize.md,
    paddingBottom: space.sm,
    borderBottom: `1px solid ${color.ink}`,
  },
})

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
  related,
  next,
  children,
}: {
  title: string
  dek: string
  publishedAt: string
  updatedAt: string
  /** 記事で取り上げた言葉。note には意味の違いを添える */
  words: RelatedItem[]
  categories: { slug: string; name: string }[]
  sources: Source[]
  /** 取り上げた言葉の関連語（記事内の言葉を除く） */
  related: RelatedItem[]
  /** 共通の言葉・分類を持つ記事 */
  next: ArticleSummary[]
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
        <Section aria-labelledby="article-words">
          <SectionTitle id="article-words" className="visually-hidden">
            この記事の言葉
          </SectionTitle>
          <WordColumns>
            <section>
              <h3>この記事で取り上げた言葉</h3>
              <RelatedWords words={words} />
            </section>
            {related.length > 0 && (
              <section>
                <h3>関連する言葉</h3>
                <RelatedWords words={related} />
              </section>
            )}
          </WordColumns>
        </Section>
        {next.length > 0 && (
          <Section aria-labelledby="next">
            <SectionTitle id="next">次に読みたい記事</SectionTitle>
            <WordColumns>
              {next.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </WordColumns>
          </Section>
        )}
      </div>
      <Aside>
        <SideBox title="この記事の言葉">
          <RelatedWords words={words.map(({ note: _, ...w }) => w)} />
        </SideBox>
      </Aside>
    </TwoColumn>
  </article>
)
