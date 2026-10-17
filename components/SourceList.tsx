"use client"

import styled from "@emotion/styled"
import { sourceTypeLabel, type Source } from "@/lib/data"
import { color, font, fontSize, lineHeight, space } from "@/styles/tokens"

const List = styled.ol({
  listStyle: "none",
  counterReset: "src",
  display: "grid",
  gap: space.md,
  fontSize: fontSize.sm,
  lineHeight: lineHeight.snug,
})

const Item = styled.li({
  counterIncrement: "src",
  display: "grid",
  gridTemplateColumns: "2.5rem minmax(0, 1fr)",
  paddingTop: space.md,
  borderTop: `1px solid ${color.rule}`,
  "&::before": {
    content: "'[' counter(src) ']'",
    fontFamily: font.serif,
    color: color.accent,
  },
  "&:target": { background: color.accentSoft },
})

const Title = styled.p({
  fontWeight: 700,
  a: { textUnderlineOffset: "0.2em" },
  "a:hover": { color: color.accent },
})

const Meta = styled.p({ color: color.faint, marginTop: space.xs })

const Supports = styled.p({ marginTop: space.xs, color: color.sub })

const Type = styled.span({
  display: "inline-block",
  fontSize: fontSize.xs,
  fontWeight: 400,
  border: `1px solid ${color.rule}`,
  padding: "0 0.4em",
  marginRight: space.sm,
  verticalAlign: "0.1em",
})

/** 出典一覧。各項目に何を裏付ける資料かを併記し、id で本文の注番号から参照できるようにする */
export const SourceList = ({ sources }: { sources: Source[] }) => (
  <List>
    {sources.map((s) => (
      <Item key={s.id} id={`src-${s.id}`}>
        <div>
          <Title>
            <Type>{sourceTypeLabel[s.source_type] ?? s.source_type}</Type>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title}
            </a>
          </Title>
          <Meta>
            {[
              s.author,
              s.publisher !== s.author && s.publisher,
              s.published_at && `${s.published_at}公開`,
              `${s.accessed_at}参照`,
            ]
              .filter(Boolean)
              .join("　")}
          </Meta>
          <Supports>
            裏付け：{s.supports}
            {s.relevant_section && `（該当箇所：${s.relevant_section}）`}
          </Supports>
          {s.notes && <Meta>注記：{s.notes}</Meta>}
        </div>
      </Item>
    ))}
  </List>
)
