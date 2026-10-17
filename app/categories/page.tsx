import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { CategoryDirectory } from "@/components/Home"
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd"
import { DisplayTitle, Kicker, Lede } from "@/components/Typography"
import { Container, PageHeader } from "@/components/ui"
import { categories, words } from "@/lib/data"

const crumbs = [{ name: "分類", path: "/categories/" }]

export const metadata: Metadata = {
  title: "分類",
  description:
    "略語の衝突、比喩・メタファー、偶然の一致、意味の変化など、言葉が二つの意味を持つに至った経緯による分類。",
  alternates: { canonical: "/categories/" },
}

const Page = () => (
  <Container>
    <JsonLd data={breadcrumbJsonLd(crumbs)} />
    <Breadcrumbs items={crumbs} />
    <PageHeader>
      <Kicker>Categories</Kicker>
      <DisplayTitle>分類</DisplayTitle>
      <Lede>
        言葉が複数の意味を持つに至った経緯で分けています。ひとつの言葉が複数の分類に属することもあります。
      </Lede>
    </PageHeader>
    <CategoryDirectory
      categories={categories.map((c) => ({
        ...c,
        count: words.filter((w) => w.category_ids.includes(c.id)).length,
      }))}
    />
  </Container>
)

export default Page
