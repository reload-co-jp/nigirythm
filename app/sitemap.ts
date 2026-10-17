import type { MetadataRoute } from "next"
import { categories, getArticles, words } from "@/lib/data"
import { absoluteUrl } from "@/lib/site"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => [
  ...[
    "/",
    "/words/",
    "/articles/",
    "/categories/",
    "/about/",
    "/editorial-policy/",
  ].map((path) => ({ url: absoluteUrl(path) })),
  ...words.map((w) => ({
    url: absoluteUrl(`/words/${w.slug}/`),
    lastModified: w.updated_at,
  })),
  ...getArticles().map((a) => ({
    url: absoluteUrl(`/articles/${a.slug}/`),
    lastModified: a.updated_at,
  })),
  ...categories.map((c) => ({ url: absoluteUrl(`/categories/${c.slug}/`) })),
]

export default sitemap
