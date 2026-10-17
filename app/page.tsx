import type { Metadata } from "next"
import {
  CategoryDirectory,
  Hero,
  LatestArticles,
  RelationChains,
  WordOfTheDay,
} from "@/components/Home"
import { JsonLd } from "@/components/JsonLd"
import { WordIndex } from "@/components/WordCard"
import { Container, Section, SectionHead } from "@/components/ui"
import {
  categories,
  getArticles,
  getWordOfTheDay,
  getWords,
  sortByReading,
  toWordSummary,
  words,
} from "@/lib/data"
import { site } from "@/lib/site"
import { toArticleSummary } from "@/lib/views"

// canonical はページごとに設定する（レイアウトに置くと 404 などにも継承されるため）
export const metadata: Metadata = { alternates: { canonical: "/" } }

const Page = () => {
  const today = toWordSummary(getWordOfTheDay())
  const chains = sortByReading(words)
    .filter((w) => w.related_word_ids.length > 0)
    .slice(0, 8)
    .map((w) => ({
      from: toWordSummary(w),
      to: getWords(w.related_word_ids).map(toWordSummary),
    }))

  return (
    <Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          alternateName: site.nameEn,
          url: `${site.url}/`,
          description: site.description,
          inLanguage: "ja",
          potentialAction: {
            "@type": "SearchAction",
            target: `${site.url}/words/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Hero />

      <Section aria-labelledby="today">
        <SectionHead id="today" kicker="Word of the day" title="今日の言葉" />
        <WordOfTheDay word={today} />
      </Section>

      <Section aria-labelledby="latest">
        <SectionHead
          id="latest"
          kicker="Latest stories"
          title="新着の読み物"
          more={{ href: "/articles/", label: "読み物をすべて見る" }}
        />
        <LatestArticles
          articles={getArticles().slice(0, 4).map(toArticleSummary)}
        />
      </Section>

      <Section aria-labelledby="index">
        <SectionHead
          id="index"
          kicker="Index"
          title="言葉から探す"
          more={{ href: "/words/", label: "言葉一覧で絞り込む" }}
        />
        <WordIndex words={sortByReading(words).map(toWordSummary)} />
      </Section>

      <Section aria-labelledby="categories">
        <SectionHead id="categories" kicker="Categories" title="分類から探す" />
        <CategoryDirectory
          categories={categories.map((c) => ({
            ...c,
            count: words.filter((w) => w.category_ids.includes(c.id)).length,
          }))}
        />
      </Section>

      <Section aria-labelledby="relations">
        <SectionHead
          id="relations"
          kicker="Connections"
          title="関連語をたどる"
        />
        <RelationChains chains={chains} />
      </Section>
    </Container>
  )
}

export default Page
