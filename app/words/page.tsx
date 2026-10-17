import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd"
import { DisplayTitle, Kicker, Lede } from "@/components/Typography"
import { WordsExplorer } from "@/components/WordsExplorer"
import { Container, PageHeader } from "@/components/ui"
import { categories, sortByReading, toWordSummary, words } from "@/lib/data"

const crumbs = [{ name: "言葉", path: "/words/" }]

export const metadata: Metadata = {
  title: "言葉一覧",
  description:
    "同じ表記で複数の意味を持つ言葉の一覧。表記・読み・別表記で検索し、分類や意味の成り立ち（多義語か、由来の異なる意味を含むか）で絞り込めます。",
  alternates: { canonical: "/words/" },
}

const Page = () => (
  <Container>
    <JsonLd data={breadcrumbJsonLd(crumbs)} />
    <Breadcrumbs items={crumbs} />
    <PageHeader>
      <Kicker>Words</Kicker>
      <DisplayTitle>言葉一覧</DisplayTitle>
      <Lede>
        出典を確認できた言葉を掲載しています。表記・読み・別表記・意味の名前から検索でき、分類や意味の成り立ちで絞り込めます。
      </Lede>
    </PageHeader>
    <WordsExplorer
      words={sortByReading(words).map(toWordSummary)}
      categories={categories.map(({ slug, name }) => ({ slug, name }))}
    />
  </Container>
)

export default Page
