import type { Metadata } from "next"
import { ArticleCard, ArticleGrid } from "@/components/ArticleCard"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd"
import { DisplayTitle, Kicker, Lede } from "@/components/Typography"
import { Container, PageHeader, Section, SectionHead } from "@/components/ui"
import { categories, getArticles } from "@/lib/data"
import { toArticleSummary } from "@/lib/views"

const crumbs = [{ name: "読み物", path: "/articles/" }]

export const metadata: Metadata = {
  title: "読み物",
  description:
    "言葉の意味が分かれた経緯や、語源の俗説、比喩の由来を出典とともに掘り下げる読み物の一覧。",
  alternates: { canonical: "/articles/" },
}

const Page = () => {
  const articles = getArticles()
  const themes = categories
    .map((c) => ({
      ...c,
      articles: articles.filter((a) => a.category_ids.includes(c.id)),
    }))
    .filter((c) => c.articles.length > 0)

  return (
    <Container>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHeader>
        <Kicker>Stories</Kicker>
        <DisplayTitle>読み物</DisplayTitle>
        <Lede>
          意味の羅列ではなく、言葉が分かれた背景や、由来をめぐる記録をたどります。
        </Lede>
      </PageHeader>

      <Section aria-labelledby="new">
        <SectionHead id="new" kicker="Newest first" title="新着順" />
        <ArticleGrid>
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={toArticleSummary(a)} />
          ))}
        </ArticleGrid>
      </Section>

      {themes.map((t) => (
        <Section key={t.slug} aria-labelledby={`theme-${t.slug}`}>
          <SectionHead
            id={`theme-${t.slug}`}
            kicker="Theme"
            title={t.name}
            more={{ href: `/categories/${t.slug}/`, label: "この分類の言葉" }}
          />
          <ArticleGrid>
            {t.articles.map((a) => (
              <ArticleCard key={a.slug} article={toArticleSummary(a)} />
            ))}
          </ArticleGrid>
        </Section>
      ))}
    </Container>
  )
}

export default Page
