import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd"
import { WordEntry } from "@/components/WordEntry"
import { Container } from "@/components/ui"
import {
  certaintyLabel,
  getArticlesByIds,
  getCategories,
  getSenses,
  getWord,
  getWords,
  getWordSources,
  relationshipLabel,
  words,
} from "@/lib/data"
import { absoluteUrl, site } from "@/lib/site"
import { toArticleSummary } from "@/lib/views"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export const generateStaticParams = () => words.map((w) => ({ slug: w.slug }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const word = getWord((await params).slug)
  if (!word) return {}
  const labels = getSenses(word.id).map((s) => s.label)
  const title = `${word.written_form}の意味と由来｜${labels.slice(0, 2).join("・")}`
  return {
    title,
    description: word.summary,
    alternates: { canonical: `/words/${word.slug}/` },
    openGraph: { type: "article", title, description: word.summary },
  }
}

const Page = async ({ params }: Props) => {
  const word = getWord((await params).slug)
  if (!word) notFound()

  const sources = getWordSources(word.id)
  const number = new Map(sources.map((s, i) => [s.id, i + 1]))
  const senses = getSenses(word.id)
  const path = `/words/${word.slug}/`
  const crumbs = [
    { name: "言葉", path: "/words/" },
    { name: word.written_form, path },
  ]

  return (
    <Container>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: `${word.written_form}（${word.reading}）`,
          url: absoluteUrl(path),
          description: word.summary,
          inLanguage: "ja",
          dateModified: word.updated_at,
          publisher: { "@type": "Organization", name: site.name },
          hasDefinedTerm: senses.map((s) => ({
            "@type": "DefinedTerm",
            name: `${word.written_form}（${s.label}）`,
            description: s.meaning,
            url: absoluteUrl(`${path}#${s.id}`),
          })),
          citation: sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.title,
            url: s.url,
          })),
        }}
      />
      <Breadcrumbs items={crumbs} />
      <WordEntry
        writtenForm={word.written_form}
        reading={word.reading}
        summary={word.summary}
        updatedAt={word.updated_at}
        categories={getCategories(word.category_ids).map(({ slug, name }) => ({
          slug,
          name,
        }))}
        tags={word.tags}
        senses={senses.map((s) => ({
          id: s.id,
          label: s.label,
          meaning: s.meaning,
          field: s.field,
          origin: s.origin,
          origin_language: s.origin_language,
          first_attestation: s.first_attestation,
          popularization_history: s.popularization_history,
          relation: relationshipLabel[s.relationship_type],
          unrelated: s.relationship_type === "unrelated",
          certainty: s.certainty,
          certaintyText: certaintyLabel[s.certainty],
          refs: s.source_ids.map((id) => ({ id, n: number.get(id) ?? 0 })),
        }))}
        sources={sources}
        related={getWords(word.related_word_ids).map(
          ({ slug, written_form, reading }) => ({ slug, written_form, reading })
        )}
        articles={getArticlesByIds(word.article_ids).map(toArticleSummary)}
      />
    </Container>
  )
}

export default Page
