import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { ArticleLayout } from "@/components/ArticleLayout"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd"
import { Container } from "@/components/ui"
import {
  getArticle,
  getArticles,
  getCategories,
  getSources,
  getWord,
  getWords,
} from "@/lib/data"
import { absoluteUrl, site } from "@/lib/site"
import {
  nextArticles,
  senseNote,
  toArticleSummary,
  toRelatedItem,
} from "@/lib/views"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export const generateStaticParams = () =>
  getArticles().map((a) => ({ slug: a.slug }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const article = getArticle((await params).slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.dek,
    alternates: { canonical: `/articles/${article.slug}/` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
  }
}

const Page = async ({ params }: Props) => {
  const article = getArticle((await params).slug)
  if (!article) notFound()

  const { default: Body } = await import(
    `@/content/articles/${article.slug}.mdx`
  )
  const sources = getSources(article.source_ids)
  const path = `/articles/${article.slug}/`
  const crumbs = [
    { name: "読み物", path: "/articles/" },
    { name: article.title, path },
  ]

  // 本文中の <Ref id="..." /> を、記事末尾の出典一覧の通し番号へのリンクにする
  const Ref = ({ id }: { id: string }) => {
    const n = article.source_ids.indexOf(id) + 1
    return (
      <sup>
        <a href={`#src-${id}`} aria-label={`出典${n}`}>
          [{n}]
        </a>
      </sup>
    )
  }

  // 本文中の <WordLink slug="..."> を辞典ページへのリンクにする（slug は pnpm validate で検査）
  const WordLink = ({
    slug,
    children,
  }: {
    slug: string
    children: ReactNode
  }) =>
    getWord(slug) ? <Link href={`/words/${slug}/`}>{children}</Link> : children

  const featured = getWords(article.word_ids)
  const related = getWords([
    ...new Set(featured.flatMap((w) => w.related_word_ids)),
  ])
    .filter((w) => !article.word_ids.includes(w.id))
    .map((w) => {
      const from = featured.find((f) => f.related_word_ids.includes(w.id))!
      return toRelatedItem(
        w,
        `「${from.written_form}」の関連語。意味：${senseNote(w)}`
      )
    })

  return (
    <Container>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          mainEntityOfPage: absoluteUrl(path),
          headline: article.title,
          description: article.dek,
          url: absoluteUrl(path),
          datePublished: article.published_at,
          dateModified: article.updated_at,
          inLanguage: "ja",
          author: { "@type": "Organization", name: site.operator },
          publisher: { "@type": "Organization", name: site.name },
          about: getWords(article.word_ids).map((w) => ({
            "@type": "DefinedTermSet",
            name: w.written_form,
            url: absoluteUrl(`/words/${w.slug}/`),
          })),
          citation: sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.title,
            url: s.url,
          })),
        }}
      />
      <Breadcrumbs items={crumbs} />
      <ArticleLayout
        title={article.title}
        dek={article.dek}
        publishedAt={article.published_at}
        updatedAt={article.updated_at}
        words={featured.map((w) => toRelatedItem(w, senseNote(w)))}
        categories={getCategories(article.category_ids).map(
          ({ slug, name }) => ({
            slug,
            name,
          })
        )}
        sources={sources}
        related={related}
        next={nextArticles(article).map(toArticleSummary)}
      >
        <Body components={{ Ref, WordLink }} />
      </ArticleLayout>
    </Container>
  )
}

export default Page
