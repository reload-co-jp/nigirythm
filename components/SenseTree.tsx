"use client"

import styled from "@emotion/styled"
import { color, font, fontSize, mq, space } from "@/styles/tokens"

type Branch = {
  id: string
  label: string
  relation: string
  unrelated: boolean
}

const Figure = styled.figure({
  display: "grid",
  gap: space.md,
  [mq.md]: {
    gridTemplateColumns: "auto minmax(0, 1fr)",
    alignItems: "center",
    gap: 0,
  },
})

const Root = styled.div({
  fontFamily: font.serif,
  fontWeight: 700,
  fontSize: fontSize.xxl,
  padding: `${space.sm} ${space.md}`,
  border: `2px solid ${color.ink}`,
  justifySelf: "start",
  [mq.md]: { marginRight: space.xl },
})

const Branches = styled.ol({
  listStyle: "none",
  position: "relative",
  display: "grid",
  gap: space.sm,
  paddingLeft: space.xl,
  // 幹：最初と最後の枝のあいだに引く縦線
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "1.1em",
    bottom: "1.1em",
    borderLeft: `2px solid ${color.ink}`,
  },
  [mq.md]: {
    // 見出し語から幹へつなぐ横線
    "&::after": {
      content: '""',
      position: "absolute",
      left: `calc(-1 * ${space.xl})`,
      top: "50%",
      width: space.xl,
      borderTop: `2px solid ${color.ink}`,
    },
  },
})

const BranchItem = styled.li<{ $unrelated: boolean }>(({ $unrelated }) => ({
  position: "relative",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  gap: `0 ${space.sm}`,
  padding: `${space.xs} 0`,
  // 枝：由来が別の意味は破線で描き、歴史的なつながりがないことを示す
  "&::before": {
    content: '""',
    position: "absolute",
    left: `calc(-1 * ${space.xl})`,
    top: "1.1em",
    width: `calc(${space.xl} - ${space.sm})`,
    borderTop: `2px ${$unrelated ? "dashed" : "solid"} ${
      $unrelated ? color.faint : color.accent
    }`,
  },
  a: {
    fontFamily: font.serif,
    fontSize: fontSize.lg,
    fontWeight: 700,
    textDecoration: "none",
  },
  "a:hover": { color: color.accent },
}))

const Relation = styled.span({
  fontSize: fontSize.xs,
  color: color.faint,
})

const Caption = styled.figcaption({
  gridColumn: "1 / -1",
  marginTop: space.md,
  fontSize: fontSize.xs,
  color: color.faint,
})

/** ひとつの表記から意味が枝分かれする様子を描く図。各枝は詳細の見出しへリンクする */
export const SenseTree = ({
  root,
  branches,
}: {
  root: string
  branches: Branch[]
}) => (
  <Figure aria-label={`「${root}」の意味の分岐`}>
    <Root>{root}</Root>
    <Branches>
      {branches.map((b) => (
        <BranchItem key={b.id} $unrelated={b.unrelated}>
          <a href={`#${b.id}`}>{b.label}</a>
          <Relation>{b.relation}</Relation>
        </BranchItem>
      ))}
    </Branches>
    <Caption>
      実線：つながりのある意味／破線：由来が別の意味（偶然の一致）
    </Caption>
  </Figure>
)
