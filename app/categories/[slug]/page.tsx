import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleCard, ArticleGrid } from "@/components/ArticleCard"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd"
import { DisplayTitle, Kicker, Lede } from "@/components/Typography"
import { WordCard } from "@/components/WordCard"
import {
  Container,
  Empty,
  PageHeader,
  Section,
  SectionHead,
} from "@/components/ui"
import {
  categories,
  getArticles,
  getCategory,
  sortByReading,
  toWordSummary,
  words,
} from "@/lib/data"
import { toArticleSummary } from "@/lib/views"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export const generateStaticParams = () =>
  categories.map((c) => ({ slug: c.slug }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const category = getCategory((await params).slug)
  if (!category) return {}
  return {
    title: `${category.name}の言葉`,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}/` },
  }
}

const Page = async ({ params }: Props) => {
  const category = getCategory((await params).slug)
  if (!category) notFound()

  const list = sortByReading(
    words.filter((w) => w.category_ids.includes(category.id))
  )
  const articles = getArticles().filter((a) =>
    a.category_ids.includes(category.id)
  )
  const crumbs = [
    { name: "分類", path: "/categories/" },
    { name: category.name, path: `/categories/${category.slug}/` },
  ]

  return (
    <Container>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHeader>
        <Kicker>Category</Kicker>
        <DisplayTitle>{category.name}</DisplayTitle>
        <Lede>{category.description}</Lede>
      </PageHeader>

      <Section aria-labelledby="words">
        <SectionHead
          id="words"
          kicker="Words"
          title={`言葉（${list.length}語）`}
        />
        {list.length === 0 ? (
          <Empty>この分類の言葉は調査中です。</Empty>
        ) : (
          list.map((w) => <WordCard key={w.slug} word={toWordSummary(w)} />)
        )}
      </Section>

      {articles.length > 0 && (
        <Section aria-labelledby="articles">
          <SectionHead id="articles" kicker="Stories" title="読み物" />
          <ArticleGrid>
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={toArticleSummary(a)} />
            ))}
          </ArticleGrid>
        </Section>
      )}
    </Container>
  )
}

export default Page
