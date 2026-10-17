import type { ArticleSummary } from "@/components/ArticleCard"
import { type Article, getWords } from "./data"

/** サーバー側のデータを、クライアントコンポーネントへ渡す最小限の形に整える */
export const toArticleSummary = (a: Article): ArticleSummary => ({
  slug: a.slug,
  title: a.title,
  dek: a.dek,
  published_at: a.published_at,
  words: getWords(a.word_ids).map(({ slug, written_form }) => ({
    slug,
    written_form,
  })),
})
