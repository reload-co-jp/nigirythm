import type { ArticleSummary } from "@/components/ArticleCard"
import type { RelatedItem } from "@/components/RelatedWords"
import {
  type Article,
  type Word,
  getArticles,
  getArticlesByIds,
  getCategories,
  getSenses,
  getWords,
  sortByReading,
  words,
} from "./data"

/** サーバー側のデータを、クライアントコンポーネントへ渡す最小限の形に整える */
export const toArticleSummary = (a: Article): ArticleSummary => ({
  slug: a.slug,
  title: a.title,
  dek: a.dek,
  published_at: a.published_at,
  updated_at: a.updated_at,
  words: getWords(a.word_ids).map(({ slug, written_form }) => ({
    slug,
    written_form,
  })),
})

export const toRelatedItem = (w: Word, note?: string): RelatedItem => ({
  slug: w.slug,
  written_form: w.written_form,
  reading: w.reading,
  note,
})

/** 意味の違いを一言で：意味ラベルを並べる */
export const senseNote = (w: Word) =>
  getSenses(w.id)
    .map((s) => s.label)
    .join("／")

const sharedCategoryNames = (a: Word, b: Word) =>
  getCategories(a.category_ids.filter((c) => b.category_ids.includes(c))).map(
    (c) => c.name
  )

/** 関連語に添える理由。データから確かめられるもの（共通の記事・分類）だけを書く */
export const relatedNote = (a: Word, b: Word) => {
  const article = getArticlesByIds(a.article_ids).find((x) =>
    x.word_ids.includes(b.id)
  )
  if (article) return `読み物「${article.title}」で一緒に取り上げた言葉`
  const names = sharedCategoryNames(a, b)
  return names.length > 0 ? `同じ分類：${names.join("・")}` : undefined
}

/** 分類が重なる言葉を、重なりの多い順に。編集部が選んだ関連語は除く */
export const sameCategoryWords = (w: Word, limit = 5) => {
  const exclude = new Set([w.id, ...w.related_word_ids])
  return sortByReading(words)
    .map((o) => ({ o, names: sharedCategoryNames(w, o) }))
    .filter(({ o, names }) => !exclude.has(o.id) && names.length > 0)
    .sort((a, b) => b.names.length - a.names.length)
    .slice(0, limit)
    .map(({ o, names }) => toRelatedItem(o, `同じ分類：${names.join("・")}`))
}

/** 共通の言葉・分類が多い記事から順に。関連のない記事は出さない */
export const nextArticles = (article: Article, limit = 3) =>
  getArticles()
    .filter((a) => a.id !== article.id)
    .map((a) => ({
      a,
      score:
        2 * a.word_ids.filter((id) => article.word_ids.includes(id)).length +
        a.category_ids.filter((id) => article.category_ids.includes(id)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map(({ a }) => a)
