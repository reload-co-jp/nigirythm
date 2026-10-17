import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleLayout } from "@/components/ArticleLayout"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd"
import { Container } from "@/components/ui"
import {
  getArticle,
  getArticles,
  getCategories,
  getSources,
  getWords,
} from "@/lib/data"
import { absoluteUrl, site } from "@/lib/site"
import { toArticleSummary } from "@/lib/views"

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

  return (
    <Container>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
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
        words={getWords(article.word_ids).map(
          ({ slug, written_form, reading }) => ({ slug, written_form, reading })
        )}
        categories={getCategories(article.category_ids).map(
          ({ slug, name }) => ({
            slug,
            name,
          })
        )}
        sources={sources}
        others={getArticles()
          .filter((a) => a.id !== article.id)
          .slice(0, 3)
          .map(toArticleSummary)}
      >
        <Body components={{ Ref }} />
      </ArticleLayout>
    </Container>
  )
}

export default Page
