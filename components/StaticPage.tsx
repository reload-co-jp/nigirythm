import { ReactNode } from "react"
import { Breadcrumbs } from "./Breadcrumbs"
import { JsonLd, breadcrumbJsonLd } from "./JsonLd"
import { DisplayTitle, Kicker, Lede, Prose } from "./Typography"
import { Container, PageHeader } from "./ui"

/** about・編集方針などの固定ページ共通の枠 */
export const StaticPage = ({
  kicker,
  title,
  lede,
  path,
  children,
}: {
  kicker: string
  title: string
  lede?: string
  path: string
  children: ReactNode
}) => {
  const crumbs = [{ name: title, path }]
  return (
    <Container>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHeader>
        <Kicker>{kicker}</Kicker>
        <DisplayTitle>{title}</DisplayTitle>
        {lede && <Lede>{lede}</Lede>}
      </PageHeader>
      <Prose>{children}</Prose>
    </Container>
  )
}
