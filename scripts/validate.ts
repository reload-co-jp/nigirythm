/**
 * 辞典データと記事の整合性チェック。
 *   node scripts/validate.ts          参照切れ・出典未登録などを検査
 *   node scripts/validate.ts --links  上記に加えて出典URLのリンク切れを検査（ネットワーク必須）
 * エラーがあれば終了コード 1。
 */
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

type Row = Record<string, unknown> & { id: string }
export type Data = {
  words: Row[]
  senses: Row[]
  sources: Row[]
  categories: Row[]
  articles: Row[]
  relations: Row[]
  /** 記事 slug → MDX 本文（ファイルがなければ undefined） */
  bodies: Record<string, string | undefined>
}

const RELATIONSHIPS = [
  "origin",
  "extension",
  "metaphor",
  "abbreviation",
  "proper-noun",
  "jargon-transfer",
  "semantic-shift",
  "unrelated",
]
const RELATION_TYPES = [
  "semantic-shift",
  "metaphor",
  "jargon-transfer",
  "etymology",
  "coincidence",
]
const CERTAINTIES = ["confirmed", "probable", "disputed", "unknown"]
const STATUSES = ["published", "candidate", "draft"]
const SOURCE_TYPES = [
  "dictionary",
  "encyclopedia",
  "official",
  "paper",
  "book",
  "news",
  "article",
]

const ids = (v: unknown) => (Array.isArray(v) ? (v as string[]) : [])

export const loadData = (root = process.cwd()): Data => {
  const read = (name: string) =>
    JSON.parse(
      readFileSync(join(root, "data", `${name}.json`), "utf8")
    ) as Row[]
  const articles = read("articles")
  const bodies: Data["bodies"] = {}
  for (const a of articles) {
    const file = join(root, "content", "articles", `${a.slug}.mdx`)
    bodies[a.slug as string] = existsSync(file)
      ? readFileSync(file, "utf8")
      : undefined
  }
  return {
    words: read("words"),
    senses: read("senses"),
    sources: read("sources"),
    categories: read("categories"),
    articles,
    relations: read("relations"),
    bodies,
  }
}

export const validate = (d: Data) => {
  const errors: string[] = []
  const warnings: string[] = []

  const index = (rows: Row[], label: string) => {
    const map = new Map<string, Row>()
    for (const r of rows) {
      if (map.has(r.id)) errors.push(`${label}: id "${r.id}" が重複しています`)
      map.set(r.id, r)
    }
    return map
  }
  const words = index(d.words, "words")
  const senses = index(d.senses, "senses")
  const sources = index(d.sources, "sources")
  const categories = index(d.categories, "categories")
  const articles = index(d.articles, "articles")

  for (const [label, rows] of [
    ["words", d.words],
    ["articles", d.articles],
    ["categories", d.categories],
  ] as const) {
    const seen = new Set<string>()
    for (const r of rows) {
      const slug = r.slug as string
      if (!/^[a-z0-9-]+$/.test(slug ?? ""))
        errors.push(`${label}/${r.id}: slug "${slug}" が不正です`)
      if (seen.has(slug))
        errors.push(`${label}: slug "${slug}" が重複しています`)
      seen.add(slug)
    }
  }

  const usedSources = new Set<string>()
  const published = (id: string) => words.get(id)?.status === "published"

  for (const w of d.words) {
    const at = `words/${w.id}`
    if (!STATUSES.includes(w.status as string))
      errors.push(`${at}: status "${w.status}" が不正です`)
    for (const c of ids(w.category_ids))
      if (!categories.has(c)) errors.push(`${at}: 分類 "${c}" が存在しません`)
    if (w.status !== "published") continue

    const own = d.senses.filter((s) => s.word_id === w.id)
    if (own.length === 0)
      errors.push(`${at}: 公開語に意味（sense）が登録されていません`)
    else if (own.length < 2) warnings.push(`${at}: 意味が1つしかありません`)
    for (const r of ids(w.related_word_ids)) {
      if (!words.has(r)) errors.push(`${at}: 関連語 "${r}" が存在しません`)
      else if (!published(r)) errors.push(`${at}: 関連語 "${r}" が未公開です`)
    }
    for (const a of ids(w.article_ids)) {
      const article = articles.get(a)
      if (!article) errors.push(`${at}: 記事 "${a}" が存在しません`)
      else if (!ids(article.word_ids).includes(w.id))
        warnings.push(`${at}: 記事 "${a}" 側の word_ids にこの言葉がありません`)
    }
  }

  for (const s of d.senses) {
    const at = `senses/${s.id}`
    if (!words.has(s.word_id as string))
      errors.push(`${at}: 見出し語 "${s.word_id}" が存在しません`)
    if (!RELATIONSHIPS.includes(s.relationship_type as string))
      errors.push(
        `${at}: relationship_type "${s.relationship_type}" が不正です`
      )
    if (!CERTAINTIES.includes(s.certainty as string))
      errors.push(`${at}: certainty "${s.certainty}" が不正です`)
    for (const key of ["label", "meaning", "field", "origin"])
      if (!s[key]) errors.push(`${at}: ${key} が空です`)
    const refs = ids(s.source_ids)
    if (refs.length === 0) errors.push(`${at}: 出典が登録されていません`)
    for (const r of refs) {
      usedSources.add(r)
      if (!sources.has(r)) errors.push(`${at}: 出典 "${r}" が存在しません`)
    }
  }

  const pairs = new Set<string>()
  for (const r of d.relations) {
    const at = `relations/${r.from}→${r.to}`
    const from = senses.get(r.from as string)
    const to = senses.get(r.to as string)
    if (!from) errors.push(`${at}: 関係元の意味 "${r.from}" が存在しません`)
    if (!to) errors.push(`${at}: 関係先の意味 "${r.to}" が存在しません`)
    if (from && to && from.word_id !== to.word_id)
      errors.push(`${at}: 別々の見出し語の意味を結んでいます`)
    if (r.from === r.to) errors.push(`${at}: 同じ意味どうしを結んでいます`)
    const pair = [r.from, r.to].sort().join("|")
    if (pairs.has(pair))
      errors.push(`${at}: 同じ意味の組の関係が重複しています`)
    pairs.add(pair)
    if (!RELATION_TYPES.includes(r.type as string))
      errors.push(`${at}: type "${r.type}" が不正です`)
    if (!CERTAINTIES.includes(r.certainty as string))
      errors.push(`${at}: certainty "${r.certainty}" が不正です`)
    if (!r.description) errors.push(`${at}: description が空です`)
    // 根拠のない関係は線を引かない：出典は必須
    const refs = ids(r.source_ids)
    if (refs.length === 0) errors.push(`${at}: 出典が登録されていません`)
    for (const s of refs) {
      usedSources.add(s)
      if (!sources.has(s)) errors.push(`${at}: 出典 "${s}" が存在しません`)
    }
  }

  const wordSlugs = new Set(
    d.words.filter((w) => w.status === "published").map((w) => w.slug)
  )

  for (const a of d.articles) {
    const at = `articles/${a.id}`
    for (const s of ids(a.sense_ids)) {
      const sense = senses.get(s)
      if (!sense) errors.push(`${at}: 意味 "${s}" が存在しません`)
      else if (!ids(a.word_ids).includes(sense.word_id as string))
        errors.push(`${at}: 意味 "${s}" の見出し語が word_ids にありません`)
    }
    if (!STATUSES.includes(a.status as string))
      errors.push(`${at}: status "${a.status}" が不正です`)
    for (const w of ids(a.word_ids)) {
      if (!words.has(w)) errors.push(`${at}: 言葉 "${w}" が存在しません`)
      else if (a.status === "published" && !published(w))
        errors.push(`${at}: 言葉 "${w}" が未公開です`)
      else if (!ids(words.get(w)?.article_ids).includes(a.id))
        warnings.push(
          `${at}: 言葉 "${w}" 側の article_ids にこの記事がありません`
        )
    }
    for (const c of ids(a.category_ids))
      if (!categories.has(c)) errors.push(`${at}: 分類 "${c}" が存在しません`)
    const refs = ids(a.source_ids)
    for (const r of refs) {
      usedSources.add(r)
      if (!sources.has(r)) errors.push(`${at}: 出典 "${r}" が存在しません`)
    }
    const body = d.bodies[a.slug as string]
    if (body === undefined) {
      errors.push(`${at}: 本文 content/articles/${a.slug}.mdx がありません`)
      continue
    }
    const cited = [...body.matchAll(/<Ref id="([^"]+)"\s*\/>/g)].map(
      (m) => m[1]
    )
    if (a.status === "published" && cited.length === 0)
      errors.push(`${at}: 本文に出典の参照（<Ref />）がありません`)
    for (const c of cited)
      if (!refs.includes(c))
        errors.push(
          `${at}: 本文の <Ref id="${c}" /> が source_ids にありません`
        )
    for (const m of body.matchAll(/<WordLink slug="([^"]+)"/g))
      if (!wordSlugs.has(m[1]))
        errors.push(
          `${at}: 本文の <WordLink slug="${m[1]}"> が公開中の言葉にありません`
        )
    for (const r of refs)
      if (!cited.includes(r))
        warnings.push(`${at}: 出典 "${r}" が本文で参照されていません`)
  }

  for (const s of d.sources) {
    const at = `sources/${s.id}`
    for (const key of ["title", "url", "accessed_at", "supports"])
      if (!s[key]) errors.push(`${at}: ${key} が空です`)
    if (!SOURCE_TYPES.includes(s.source_type as string))
      errors.push(`${at}: source_type "${s.source_type}" が不正です`)
    try {
      new URL(s.url as string)
    } catch {
      errors.push(`${at}: URL "${s.url}" が不正です`)
    }
    if (!usedSources.has(s.id))
      warnings.push(`${at}: どこからも参照されていません`)
  }

  return { errors, warnings }
}

/** 出典URLに実際にアクセスして確認する。403/429 はボット拒否の可能性があるため警告に留める */
export const checkLinks = async (sources: Row[]) => {
  const errors: string[] = []
  const warnings: string[] = []
  const headers = {
    "User-Agent": "Mozilla/5.0 (compatible; nigirythm-linkcheck)",
  }
  await Promise.all(
    sources.map(async (s) => {
      const url = s.url as string
      try {
        const res = await fetch(url, {
          headers,
          redirect: "follow",
          signal: AbortSignal.timeout(20_000),
        })
        if (res.ok) return
        const msg = `sources/${s.id}: ${res.status} ${url}`
        if ([401, 403, 429].includes(res.status)) warnings.push(msg)
        else errors.push(msg)
      } catch (e) {
        errors.push(
          `sources/${s.id}: 接続できません ${url}（${(e as Error).message}）`
        )
      }
    })
  )
  return { errors, warnings }
}

const main = async () => {
  const data = loadData()
  const result = validate(data)
  if (process.argv.includes("--links")) {
    const links = await checkLinks(data.sources)
    result.errors.push(...links.errors)
    result.warnings.push(...links.warnings)
  }
  for (const w of result.warnings) console.warn(`warn  ${w}`)
  for (const e of result.errors) console.error(`error ${e}`)
  const published = data.words.filter((w) => w.status === "published").length
  console.log(
    `words ${published} published / ${data.words.length} total, senses ${data.senses.length}, relations ${data.relations.length}, sources ${data.sources.length}, articles ${data.articles.length}`
  )
  console.log(
    `${result.errors.length} error(s), ${result.warnings.length} warning(s)`
  )
  process.exitCode = result.errors.length > 0 ? 1 : 0
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main()
