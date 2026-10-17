"use client"

import styled from "@emotion/styled"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import type { WordSummary } from "@/lib/data"
import { kanaRowOf, kanaRows } from "@/lib/kana"
import { color, font, fontSize, mq, space, transition } from "@/styles/tokens"
import { WordCard } from "./WordCard"
import { Note } from "./Typography"
import { CategoryLabel, LabelRow } from "./CategoryLabel"

const PAGE_SIZE = 10

type Filters = {
  q: string
  row: string
  category: string
  tag: string
  kind: string
}
const emptyFilters: Filters = {
  q: "",
  row: "",
  category: "",
  tag: "",
  kind: "",
}

const kinds = [
  { value: "polysemy", label: "意味がつながる多義語" },
  { value: "distinct", label: "由来が別の意味を含む" },
]

const toHiragana = (s: string) =>
  s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))

const smallKana: Record<string, string> = {
  ぁ: "あ",
  ぃ: "い",
  ぅ: "う",
  ぇ: "え",
  ぉ: "お",
  ゃ: "や",
  ゅ: "ゆ",
  ょ: "よ",
  ゎ: "わ",
}

/**
 * 表記ゆれを吸収する正規化：全角半角・大小文字・カタカナ／ひらがな、
 * 小書きの仮名（ウィ／ウイ）、長音・中黒（ブラウザ／ブラウザー、M・A・C／MAC）
 */
export const normalize = (s: string) =>
  toHiragana(s.normalize("NFKC").toLowerCase())
    .replace(/[ぁぃぅぇぉゃゅょゎ]/g, (c) => smallKana[c])
    .replace(/[ー・-]/g, "")

/** 表記・読み・別表記・概要・意味ラベル・タグを対象にした部分一致検索 */
export const matches = (word: WordSummary, f: Filters) => {
  if (f.row && kanaRowOf(word.reading) !== f.row) return false
  if (f.category && !word.categories.some((c) => c.slug === f.category))
    return false
  if (f.tag && !word.tags.includes(f.tag)) return false
  if (f.kind && (f.kind === "distinct") !== word.distinctOrigins) return false
  const q = normalize(f.q.trim())
  if (!q) return true
  const haystack = normalize(
    [
      word.written_form,
      word.reading,
      ...word.aliases,
      word.summary,
      ...word.senseLabels,
      ...word.tags,
    ].join(" ")
  )
  return q
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

const Controls = styled.div({
  display: "grid",
  gap: space.md,
  paddingBlock: space.lg,
  borderTop: `2px solid ${color.ink}`,
  borderBottom: `1px solid ${color.ink}`,
  [mq.md]: { gridTemplateColumns: "minmax(0, 1fr) 13rem 13rem" },
})

const Field = styled.label({
  display: "grid",
  gap: space.xs,
  fontSize: fontSize.xs,
  color: color.faint,
  "input, select": {
    fontSize: fontSize.md,
    color: color.ink,
    padding: `${space.sm} ${space.md}`,
    border: `1px solid ${color.ink}`,
    background: "#fff",
    borderRadius: 0,
    minWidth: 0,
  },
})

const Rows = styled.div({
  gridColumn: "1 / -1",
  display: "flex",
  flexWrap: "wrap",
  gap: space.xs,
})

const RowButton = styled.button({
  minWidth: "2.5rem",
  padding: `${space.xs} ${space.sm}`,
  fontFamily: font.serif,
  background: "transparent",
  border: `1px solid ${color.rule}`,
  cursor: "pointer",
  transition: `background ${transition}, color ${transition}`,
  "&:hover": { borderColor: color.ink },
  '&[aria-pressed="true"]': {
    background: color.ink,
    color: color.bg,
    borderColor: color.ink,
  },
  "&:disabled": {
    color: color.rule,
    cursor: "default",
    borderColor: color.rule,
  },
})

const Status = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: space.md,
  paddingTop: space.md,
  flexWrap: "wrap",
})

const Clear = styled.button({
  fontSize: fontSize.sm,
  background: "none",
  border: 0,
  textDecoration: "underline",
  cursor: "pointer",
  padding: 0,
})

const NoResult = styled.div({
  display: "grid",
  gap: space.sm,
  justifyItems: "start",
  paddingBlock: space.lg,
  fontSize: fontSize.sm,
  color: color.sub,
})

const Pager = styled.nav({
  display: "flex",
  justifyContent: "center",
  gap: space.xs,
  paddingTop: space.xl,
})

/** URL のクエリ（?q= / ?tag= / ?category=）を初期値として読み込む。静的書き出しのため Suspense 内で使う */
const QueryReader = ({ onRead }: { onRead: (f: Partial<Filters>) => void }) => {
  const params = useSearchParams()
  useEffect(() => {
    onRead({
      q: params.get("q") ?? "",
      tag: params.get("tag") ?? "",
      category: params.get("category") ?? "",
      row: params.get("row") ?? "",
      kind: params.get("kind") ?? "",
    })
  }, [params, onRead])
  return null
}

export const WordsExplorer = ({
  words,
  categories,
}: {
  words: WordSummary[]
  categories: { slug: string; name: string }[]
}) => {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [page, setPage] = useState(1)

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch }
    setFilters(next)
    setPage(1)
    // 共有できるように現在の条件を URL に反映する（履歴は増やさない）
    const qs = new URLSearchParams(
      Object.entries(next).filter(([, v]) => v)
    ).toString()
    window.history.replaceState(
      null,
      "",
      qs ? `?${qs}` : window.location.pathname
    )
  }

  const onRead = useCallback(
    (f: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...f })),
    []
  )

  const result = useMemo(
    () => words.filter((w) => matches(w, filters)),
    [words, filters]
  )
  const usedRows = useMemo(
    () => new Set(words.map((w) => kanaRowOf(w.reading))),
    [words]
  )
  const pageCount = Math.max(1, Math.ceil(result.length / PAGE_SIZE))
  const visible = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const active = Object.values(filters).some(Boolean)

  return (
    <>
      <Suspense fallback={null}>
        <QueryReader onRead={onRead} />
      </Suspense>
      <Controls role="search">
        <Field>
          キーワード（表記・読み・別表記・意味）
          <input
            type="search"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Escape" && filters.q) update({ q: "" })
            }}
            placeholder="例：略語、ネズミ、くらうど、Macintosh"
            aria-describedby="search-hint"
          />
          <span id="search-hint" className="visually-hidden">
            入力すると結果が絞り込まれます。Escキーで入力を消去します。
          </span>
        </Field>
        <Field>
          分類
          <select
            value={filters.category}
            onChange={(e) => update({ category: e.target.value })}
          >
            <option value="">すべての分類</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          意味の成り立ち
          <select
            value={filters.kind}
            onChange={(e) => update({ kind: e.target.value })}
          >
            <option value="">すべて</option>
            {kinds.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </Field>
        <Rows role="group" aria-label="読みの頭文字で絞り込む">
          <RowButton
            type="button"
            aria-pressed={filters.row === ""}
            onClick={() => update({ row: "" })}
          >
            すべて
          </RowButton>
          {kanaRows.map((row) => (
            <RowButton
              key={row}
              type="button"
              aria-pressed={filters.row === row}
              disabled={!usedRows.has(row)}
              onClick={() => update({ row })}
            >
              {row}
            </RowButton>
          ))}
        </Rows>
      </Controls>

      <Status>
        <Note role="status">
          {result.length}語{filters.tag && `（タグ「${filters.tag}」）`}
        </Note>
        {active && (
          <Clear type="button" onClick={() => update(emptyFilters)}>
            条件をクリア
          </Clear>
        )}
      </Status>

      {visible.length === 0 ? (
        <NoResult>
          <p>
            該当する言葉が見つかりませんでした。表記や読み（ひらがな）を変えてお試しください。
          </p>
          {active && (
            <Clear type="button" onClick={() => update(emptyFilters)}>
              条件をクリアして全件を表示
            </Clear>
          )}
          <p>分類から探す：</p>
          <LabelRow>
            {categories.map((c) => (
              <li key={c.slug}>
                <CategoryLabel {...c} />
              </li>
            ))}
          </LabelRow>
          <p>
            <Link href="/categories/">分類の一覧</Link>／
            <Link href="/words/">すべての言葉</Link>
          </p>
        </NoResult>
      ) : (
        visible.map((w) => <WordCard key={w.slug} word={w} />)
      )}

      {pageCount > 1 && (
        <Pager aria-label="ページ">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <RowButton
              key={n}
              type="button"
              aria-pressed={n === page}
              aria-label={`${n}ページ目`}
              onClick={() => {
                setPage(n)
                window.scrollTo({ top: 0 })
              }}
            >
              {n}
            </RowButton>
          ))}
        </Pager>
      )}
    </>
  )
}
