"use client"

import styled from "@emotion/styled"
import { useId, useLayoutEffect, useRef, useState } from "react"
import type { Certainty, RelationType } from "@/lib/data"
import {
  color,
  font,
  fontSize,
  lineHeight,
  mq,
  space,
  transition,
} from "@/styles/tokens"
import { Badge } from "./ui"

export type GraphNode = { id: string; label: string; field: string }

export type GraphEdge = {
  from: string
  to: string
  type: RelationType
  typeText: string
  description: string
  certainty: Certainty
  certaintyText: string
  refs: { id: string; n: number }[]
}

/** 関係の種類ごとの線。色だけに頼らず、線種・矢印の有無・短いラベルで区別する */
const lineStyle: Record<
  RelationType,
  {
    stroke: string
    dash?: string
    width: number
    arrow: boolean
    short: string
  }
> = {
  "semantic-shift": { stroke: color.ink, width: 2, arrow: true, short: "変化" },
  metaphor: {
    stroke: color.accent,
    dash: "7 4",
    width: 2,
    arrow: true,
    short: "比喩",
  },
  "jargon-transfer": {
    stroke: color.ink,
    dash: "12 3 2 3",
    width: 2,
    arrow: true,
    short: "転用",
  },
  etymology: { stroke: color.sub, width: 1.5, arrow: false, short: "語源" },
  coincidence: {
    stroke: color.faint,
    dash: "1 5",
    width: 2,
    arrow: false,
    short: "偶然",
  },
}

const legendText = (type: RelationType, text: string) =>
  text.startsWith(lineStyle[type].short)
    ? text
    : `${text}（図中「${lineStyle[type].short}」）`

/** 弧を描く左側の余白（px） */
const GUTTER = 84

const Wrap = styled.div({
  display: "grid",
  gap: space.xl,
  [mq.lg]: { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" },
})

const Diagram = styled.div({
  position: "relative",
  paddingLeft: GUTTER,
  svg: {
    position: "absolute",
    left: 0,
    top: 0,
    width: GUTTER,
    height: "100%",
    overflow: "visible",
  },
  path: { transition: `opacity ${transition}` },
})

const Nodes = styled.ol({
  listStyle: "none",
  display: "grid",
  gap: space.md,
})

const NodeLink = styled.a<{ $active: boolean }>(({ $active }) => ({
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: `0 ${space.sm}`,
  padding: `${space.sm} ${space.md}`,
  border: `${$active ? 2 : 1}px solid ${color.ink}`,
  background: $active ? color.accentSoft : "#fff",
  textDecoration: "none",
  transition: `background ${transition}`,
  "&:hover": { background: color.accentSoft },
  strong: {
    fontFamily: font.serif,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.snug,
  },
  small: { gridColumn: 2, fontSize: fontSize.xs, color: color.faint },
}))

const Num = styled.span({
  fontFamily: font.serif,
  color: color.accent,
  fontSize: fontSize.lg,
  lineHeight: lineHeight.snug,
})

const Legend = styled.dl({
  display: "flex",
  flexWrap: "wrap",
  gap: `${space.xs} ${space.lg}`,
  marginTop: space.md,
  fontSize: fontSize.xs,
  color: color.sub,
  div: { display: "flex", alignItems: "center", gap: space.xs },
  dd: { margin: 0 },
})

const Hint = styled.p({
  marginTop: space.sm,
  fontSize: fontSize.xs,
  color: color.faint,
  lineHeight: lineHeight.snug,
})

const Relations = styled.ul({
  listStyle: "none",
  display: "grid",
  alignContent: "start",
  gap: space.md,
  fontSize: fontSize.sm,
  lineHeight: lineHeight.snug,
  li: { paddingTop: space.md, borderTop: `1px solid ${color.rule}` },
  p: { marginTop: space.xs, color: color.sub },
  "a[href^='#src-']": {
    color: color.accent,
    textDecoration: "none",
    marginLeft: space.xs,
  },
})

const Pair = styled.p({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  gap: `0 ${space.sm}`,
  strong: { fontFamily: font.serif },
})

/**
 * 意味の関係図。意味を縦に並べ、出典で裏付けられた関係だけを左側の弧で結ぶ。
 * ノードは HTML のリンクなので、文字の折り返し・キーボード操作・スクリーンリーダーにそのまま対応する。
 * 弧の位置はノードの実寸から求め、画面幅が変わるたびに描き直す。
 */
export const SenseGraph = ({
  root,
  nodes,
  edges,
}: {
  root: string
  nodes: GraphNode[]
  edges: GraphEdge[]
}) => {
  const box = useRef<HTMLDivElement>(null)
  const [ys, setYs] = useState<Record<string, number>>({})
  const [active, setActive] = useState<string | null>(null)
  const id = `g${useId().replace(/[^a-zA-Z0-9]/g, "")}`

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => {
      const next: Record<string, number> = {}
      el.querySelectorAll<HTMLElement>("[data-node]").forEach((li) => {
        next[li.dataset.node!] = li.offsetTop + li.offsetHeight / 2
      })
      setYs(next)
    }
    measure()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const index = new Map(nodes.map((n, i) => [n.id, i]))
  const label = new Map(nodes.map((n) => [n.id, n.label]))
  const types = [...new Set(edges.map((e) => e.type))]
  const linked = (e: GraphEdge) =>
    !active || e.from === active || e.to === active

  return (
    <Wrap>
      <div>
        <Diagram ref={box}>
          <svg aria-hidden="true">
            <defs>
              {types
                .filter((t) => lineStyle[t].arrow)
                .map((t) => (
                  <marker
                    key={t}
                    id={`${id}-${t}`}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto"
                  >
                    <path d="M0 0 L10 5 L0 10 z" fill={lineStyle[t].stroke} />
                  </marker>
                ))}
            </defs>
            {edges.map((e) => {
              const y1 = ys[e.from]
              const y2 = ys[e.to]
              if (y1 === undefined || y2 === undefined) return null
              const span = Math.abs(index.get(e.from)! - index.get(e.to)!)
              const r = Math.min(GUTTER - 8, 28 + 18 * (span - 1))
              const s = lineStyle[e.type]
              return (
                <g
                  key={`${e.from}-${e.to}`}
                  opacity={linked(e) ? 1 : 0.15}
                  style={{ transition: `opacity ${transition}` }}
                >
                  <path
                    d={`M ${GUTTER} ${y1} C ${GUTTER - r} ${y1}, ${GUTTER - r} ${y2}, ${GUTTER} ${y2}`}
                    fill="none"
                    stroke={s.stroke}
                    strokeWidth={s.width}
                    strokeDasharray={s.dash}
                    strokeLinecap={
                      e.type === "coincidence" ? "round" : undefined
                    }
                    markerEnd={s.arrow ? `url(#${id}-${e.type})` : undefined}
                  />
                  <text
                    x={GUTTER - r * 0.75}
                    y={(y1 + y2) / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="11"
                    fill={s.stroke}
                    stroke={color.bg}
                    strokeWidth="4"
                    paintOrder="stroke"
                  >
                    {s.short}
                  </text>
                </g>
              )
            })}
          </svg>
          <Nodes aria-label={`「${root}」の意味`}>
            {nodes.map((n, i) => (
              <li key={n.id} data-node={n.id}>
                <NodeLink
                  href={`#${n.id}`}
                  $active={active === n.id}
                  onMouseEnter={() => setActive(n.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(n.id)}
                  onBlur={() => setActive(null)}
                >
                  <Num>{i + 1}</Num>
                  <strong>{n.label}</strong>
                  <small>{n.field}</small>
                </NodeLink>
              </li>
            ))}
          </Nodes>
        </Diagram>
        <Legend aria-label="凡例">
          {types.map((t) => (
            <div key={t}>
              <dt>
                <svg width="40" height="10" aria-hidden="true">
                  <line
                    x1="0"
                    y1="5"
                    x2={lineStyle[t].arrow ? 33 : 40}
                    y2="5"
                    stroke={lineStyle[t].stroke}
                    strokeWidth={lineStyle[t].width}
                    strokeDasharray={lineStyle[t].dash}
                    strokeLinecap={t === "coincidence" ? "round" : undefined}
                  />
                  {lineStyle[t].arrow && (
                    <path d="M32 1 L40 5 L32 9 z" fill={lineStyle[t].stroke} />
                  )}
                </svg>
              </dt>
              <dd>
                {legendText(t, edges.find((e) => e.type === t)!.typeText)}
              </dd>
            </div>
          ))}
        </Legend>
        <Hint>
          矢印は意味が派生した向きを示します。線のない意味どうしは、関係を裏付ける資料をまだ確認できていないものです。意味を選ぶと、その説明へ移動します。
        </Hint>
      </div>

      <Relations aria-label="意味どうしの関係と根拠">
        {edges.map((e) => (
          <li key={`${e.from}-${e.to}`}>
            <Pair>
              <strong>
                {index.get(e.from)! + 1}. {label.get(e.from)}
              </strong>
              <span aria-hidden="true">
                {lineStyle[e.type].arrow ? "→" : "―"}
              </span>
              <strong>
                {index.get(e.to)! + 1}. {label.get(e.to)}
              </strong>
            </Pair>
            <Pair>
              <span>{e.typeText}</span>
              <Badge $certainty={e.certainty}>{e.certaintyText}</Badge>
            </Pair>
            <p>
              {e.description}
              <span>
                {"　"}根拠：
                {e.refs.map((r) => (
                  <a key={r.id} href={`#src-${r.id}`}>
                    [{r.n}]
                  </a>
                ))}
              </span>
            </p>
          </li>
        ))}
      </Relations>
    </Wrap>
  )
}
