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
  index(d.senses, "senses")
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

  for (const a of d.articles) {
    const at = `articles/${a.id}`
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
    `words ${published} published / ${data.words.length} total, senses ${data.senses.length}, sources ${data.sources.length}, articles ${data.articles.length}`
  )
  console.log(
    `${result.errors.length} error(s), ${result.warnings.length} warning(s)`
  )
  process.exitCode = result.errors.length > 0 ? 1 : 0
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main()
