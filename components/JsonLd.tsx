import { absoluteUrl } from "@/lib/site"
import type { Crumb } from "./Breadcrumbs"

export const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    // JSON 内の "<" をエスケープし、</script> による閉じタグ注入を防ぐ
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
)

export const breadcrumbJsonLd = (items: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "ホーム", path: "/" }, ...items].map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})
