"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import type { Certainty, Source } from "@/lib/data"
import { color, font, fontSize, lineHeight, mq, space } from "@/styles/tokens"
import { ArticleCard, type ArticleSummary } from "./ArticleCard"
import { CategoryLabel, LabelRow, Tag } from "./CategoryLabel"
import { RelatedWords } from "./RelatedWords"
import { SenseTree } from "./SenseTree"
import { SourceList } from "./SourceList"
import { Kicker, Lede, Note, Reading, SectionTitle } from "./Typography"
import { Aside, MetaList, Section, SideBox, TwoColumn } from "./ui"

export type SenseView = {
  id: string
  label: string
  meaning: string
  field: string
  origin: string
  origin_language: string
  first_attestation: string
  popularization_history: string
  relation: string
  unrelated: boolean
  certainty: Certainty
  certaintyText: string
  /** 出典一覧での通し番号と id */
  refs: { id: string; n: number }[]
}

export type WordEntryProps = {
  writtenForm: string
  reading: string
  summary: string
  updatedAt: string
  categories: { slug: string; name: string }[]
  tags: string[]
  senses: SenseView[]
  sources: Source[]
  related: { slug: string; written_form: string; reading: string }[]
  articles: ArticleSummary[]
}

const Head = styled.header({
  display: "grid",
  gap: space.md,
  paddingBlock: `${space.xl} ${space.xl}`,
})

const Headword = styled.h1({
  fontFamily: font.serif,
  fontWeight: 700,
  fontSize: fontSize.hero,
  lineHeight: 1,
  letterSpacing: "0.02em",
})

const SenseBlock = styled.section({
  paddingBlock: space.xl,
  borderTop: `1px solid ${color.ink}`,
  display: "grid",
  gap: space.md,
  "&:target h3": { color: color.accent },
})

const SenseTitle = styled.h3({
  fontFamily: font.serif,
  fontSize: fontSize.xxl,
  lineHeight: lineHeight.tight,
  display: "flex",
  gap: space.md,
  alignItems: "baseline",
  span: { color: color.accent, fontSize: fontSize.lg },
})

const certaintyColor: Record<Certainty, string> = {
  confirmed: color.ink,
  probable: color.sub,
  disputed: color.accent,
  unknown: color.faint,
}

const Badge = styled.span<{ $certainty: Certainty }>(({ $certainty }) => ({
  display: "inline-block",
  fontSize: fontSize.xs,
  padding: "0 0.5em",
  border: `1px solid ${certaintyColor[$certainty]}`,
  color: certaintyColor[$certainty],
  borderStyle: $certainty === "unknown" ? "dashed" : "solid",
}))

const Fields = styled(MetaList)({
  [mq.md]: { gridTemplateColumns: "auto 1fr auto 1fr" },
})

const Detail = styled.dl({
  display: "grid",
  gap: space.md,
  maxWidth: "42rem",
  dt: {
    fontFamily: font.serif,
    fontWeight: 700,
    fontSize: fontSize.sm,
  },
  dd: {
    margin: `${space.xs} 0 0`,
    lineHeight: lineHeight.body,
  },
})

const Meaning = styled.p({
  fontSize: fontSize.lg,
  lineHeight: lineHeight.body,
  maxWidth: "42rem",
})

const Refs = styled.p({
  fontSize: fontSize.sm,
  color: color.faint,
  a: { color: color.accent, textDecoration: "none", marginRight: space.xs },
  "a:hover": { textDecoration: "underline" },
})

const Muted = styled.span({ color: color.faint })

const orUnknown = (text: string) =>
  text ? text : <Muted>未確認（調査中）</Muted>

export const WordEntry = (props: WordEntryProps) => (
  <>
    <Head>
      <Kicker>{props.senses.length} meanings</Kicker>
      <Headword>{props.writtenForm}</Headword>
      <Reading>{props.reading}</Reading>
      <Lede>{props.summary}</Lede>
      <LabelRow aria-label="分類">
        {props.categories.map((c) => (
          <li key={c.slug}>
            <CategoryLabel {...c} />
          </li>
        ))}
      </LabelRow>
    </Head>

    <Section aria-labelledby="tree">
      <SectionTitle id="tree" className="visually-hidden">
        意味の分岐
      </SectionTitle>
      <SenseTree
        root={props.writtenForm}
        branches={props.senses.map((s) => ({
          id: s.id,
          label: s.label,
          relation: s.relation,
          unrelated: s.unrelated,
        }))}
      />
    </Section>

    <TwoColumn>
      <div>
        <SectionTitle className="visually-hidden">意味と由来</SectionTitle>
        {props.senses.map((s, i) => (
          <SenseBlock key={s.id} id={s.id}>
            <SenseTitle>
              <span>{i + 1}</span>
              {s.label}
            </SenseTitle>
            <Fields>
              <dt>分野</dt>
              <dd>{s.field}</dd>
              <dt>関係</dt>
              <dd>{s.relation}</dd>
              <dt>語源の言語</dt>
              <dd>{orUnknown(s.origin_language)}</dd>
              <dt>根拠の確度</dt>
              <dd>
                <Badge $certainty={s.certainty}>{s.certaintyText}</Badge>
              </dd>
            </Fields>
            <Meaning>{s.meaning}</Meaning>
            <Detail>
              <div>
                <dt>由来・語源</dt>
                <dd>{orUnknown(s.origin)}</dd>
              </div>
              <div>
                <dt>初出・成立時期</dt>
                <dd>{orUnknown(s.first_attestation)}</dd>
              </div>
              {s.popularization_history && (
                <div>
                  <dt>普及の背景</dt>
                  <dd>{s.popularization_history}</dd>
                </div>
              )}
            </Detail>
            <Refs>
              根拠：
              {s.refs.map((r) => (
                <a key={r.id} href={`#src-${r.id}`}>
                  [{r.n}]
                </a>
              ))}
            </Refs>
          </SenseBlock>
        ))}

        <Section aria-labelledby="sources">
          <SectionTitle id="sources">出典</SectionTitle>
          <Note>
            各資料が何を裏付けるかを併記しています。誤りや、より確かな資料をご存じの方は
            <Link href="/contact/">お知らせください</Link>。
          </Note>
          <SourceList sources={props.sources} />
        </Section>
      </div>

      <Aside>
        {props.related.length > 0 && (
          <SideBox title="関連する言葉">
            <RelatedWords words={props.related} />
          </SideBox>
        )}
        {props.articles.length > 0 && (
          <SideBox title="この言葉の読み物">
            {props.articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </SideBox>
        )}
        {props.tags.length > 0 && (
          <SideBox title="タグ">
            <LabelRow>
              {props.tags.map((t) => (
                <li key={t}>
                  <Link href={`/words/?tag=${encodeURIComponent(t)}`}>
                    <Tag>{t}</Tag>
                  </Link>
                </li>
              ))}
            </LabelRow>
          </SideBox>
        )}
        <Note>最終更新：{props.updatedAt}</Note>
      </Aside>
    </TwoColumn>
  </>
)
