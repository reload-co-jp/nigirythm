import articlesJson from "@/data/articles.json"
import categoriesJson from "@/data/categories.json"
import relationsJson from "@/data/relations.json"
import sensesJson from "@/data/senses.json"
import sourcesJson from "@/data/sources.json"
import wordsJson from "@/data/words.json"

export type Status = "published" | "candidate" | "draft"

export type Word = {
  id: string
  slug: string
  status: Status
  written_form: string
  reading: string
  /** 別表記・原綴り・略称など、検索で引けるようにする表記 */
  aliases?: string[]
  summary: string
  category_ids: string[]
  tags: string[]
  related_word_ids: string[]
  article_ids: string[]
  created_at: string
  updated_at: string
}

export type RelationshipType =
  | "origin"
  | "extension"
  | "metaphor"
  | "abbreviation"
  | "proper-noun"
  | "jargon-transfer"
  | "semantic-shift"
  | "unrelated"

export type Certainty = "confirmed" | "probable" | "disputed" | "unknown"

export type Sense = {
  id: string
  word_id: string
  label: string
  meaning: string
  field: string
  origin: string
  origin_language: string
  first_attestation: string
  popularization_history: string
  relationship_type: RelationshipType
  certainty: Certainty
  source_ids: string[]
}

export type Source = {
  id: string
  title: string
  author: string
  publisher: string
  url: string
  published_at?: string
  accessed_at: string
  source_type: string
  relevant_section: string
  supports: string
  notes: string
  /** 当事者・原典による一次資料なら true。辞書・解説記事などの二次資料は false */
  primary?: boolean
}

export type Category = {
  id: string
  slug: string
  name: string
  description: string
}

export type Article = {
  id: string
  slug: string
  title: string
  dek: string
  word_ids: string[]
  /** 記事が成り立ちを掘り下げている意味 */
  sense_ids: string[]
  category_ids: string[]
  source_ids: string[]
  status: Status
  published_at: string
  updated_at: string
}

export type RelationType =
  | "semantic-shift"
  | "metaphor"
  | "jargon-transfer"
  | "etymology"
  | "coincidence"

/** 意味どうしの関係。出典で裏付けられるものだけを登録する */
export type Relation = {
  from: string
  to: string
  type: RelationType
  description: string
  source_ids: string[]
  certainty: Certainty
}

export const relationTypeLabel: Record<RelationType, string> = {
  "semantic-shift": "意味の変化・拡張",
  metaphor: "比喩",
  "jargon-transfer": "専門用語への転用",
  etymology: "共通の語源",
  coincidence: "偶然の一致（由来は別）",
}

export const relationshipLabel: Record<RelationshipType, string> = {
  origin: "原義",
  extension: "意味の拡張",
  metaphor: "比喩による転用",
  abbreviation: "別語の略",
  "proper-noun": "固有名詞",
  "jargon-transfer": "専門用語の転用",
  "semantic-shift": "意味の変化",
  unrelated: "由来が別（偶然の一致）",
}

export const certaintyLabel: Record<Certainty, string> = {
  confirmed: "確認済み",
  probable: "有力",
  disputed: "諸説あり",
  unknown: "未確認",
}

export const sourceTypeLabel: Record<string, string> = {
  dictionary: "辞書",
  encyclopedia: "百科事典",
  official: "公式資料",
  paper: "論文",
  book: "書籍",
  news: "報道",
  article: "記事",
}

const allWords = wordsJson as Word[]
const senses = sensesJson as Sense[]
const sources = sourcesJson as Source[]
const relations = relationsJson as Relation[]
const articles = (articlesJson as Article[]).filter(
  (a) => a.status === "published"
)
export const categories = categoriesJson as Category[]

export const words = allWords.filter((w) => w.status === "published")
export const candidateWords = allWords.filter((w) => w.status === "candidate")

const byId = <T extends { id: string }>(list: T[], ids: string[]) =>
  ids.flatMap((id) => list.filter((item) => item.id === id))

export const getWord = (slug: string) => words.find((w) => w.slug === slug)
export const getWords = (ids: string[]) => byId(words, ids)
export const getSenses = (wordId: string) =>
  senses.filter((s) => s.word_id === wordId)
export const getSources = (ids: string[]) => byId(sources, ids)
export const getRelations = (wordId: string) => {
  const own = new Set(getSenses(wordId).map((s) => s.id))
  return relations.filter((r) => own.has(r.from))
}

/** 別の語句の略や偶然の一致など、由来の異なる意味を含むか（意味ごとの relationship_type から判定） */
export const hasDistinctOrigins = (wordId: string) =>
  getSenses(wordId).some((s) =>
    ["unrelated", "abbreviation"].includes(s.relationship_type)
  )
export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug)
export const getCategories = (ids: string[]) => byId(categories, ids)

export const getArticles = () =>
  [...articles].sort((a, b) => b.published_at.localeCompare(a.published_at))
export const getArticle = (slug: string) =>
  articles.find((a) => a.slug === slug)
export const getArticlesByIds = (ids: string[]) => byId(articles, ids)

/** 意味ごと・関係ごとの出典を、重複を除いて出現順に並べる */
export const getWordSources = (wordId: string) =>
  getSources([
    ...new Set([
      ...getSenses(wordId).flatMap((s) => s.source_ids),
      ...getRelations(wordId).flatMap((r) => r.source_ids),
    ]),
  ])

export const sortByReading = (list: Word[]) =>
  [...list].sort((a, b) => a.reading.localeCompare(b.reading, "ja"))

/** ビルド日に応じて「今日の言葉」を選ぶ（静的生成のため再ビルドで切り替わる） */
export const getWordOfTheDay = (date = new Date()) => {
  const day = Math.floor(date.getTime() / 86_400_000)
  return sortByReading(words)[day % words.length]
}

export type WordSummary = Pick<
  Word,
  "slug" | "written_form" | "reading" | "summary" | "tags"
> & {
  aliases: string[]
  categories: Pick<Category, "slug" | "name">[]
  senseLabels: string[]
  distinctOrigins: boolean
  articleCount: number
}

export const toWordSummary = (w: Word): WordSummary => ({
  slug: w.slug,
  written_form: w.written_form,
  reading: w.reading,
  aliases: w.aliases ?? [],
  summary: w.summary,
  tags: w.tags,
  categories: getCategories(w.category_ids).map(({ slug, name }) => ({
    slug,
    name,
  })),
  senseLabels: getSenses(w.id).map((s) => s.label),
  distinctOrigins: hasDistinctOrigins(w.id),
  articleCount: getArticlesByIds(w.article_ids).length,
})
