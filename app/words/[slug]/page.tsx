import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd"
import { WordEntry } from "@/components/WordEntry"
import { Container } from "@/components/ui"
import {
  certaintyLabel,
  getArticles,
  getArticlesByIds,
  getCategories,
  getRelations,
  getSenses,
  getWord,
  getWords,
  getWordSources,
  relationTypeLabel,
  relationshipLabel,
  words,
} from "@/lib/data"
import { absoluteUrl, site } from "@/lib/site"
import {
  relatedNote,
  sameCategoryWords,
  toArticleSummary,
  toRelatedItem,
} from "@/lib/views"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export const generateStaticParams = () => words.map((w) => ({ slug: w.slug }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const word = getWord((await params).slug)
  if (!word) return {}
  const labels = getSenses(word.id).map((s) => s.label)
  // 仮名の見出し語は読みと同じになるため、英字・漢字の見出し語だけ読みを添える
  const kana = /^[\p{scx=Hiragana}\p{scx=Katakana}ー]+$/u.test(
    word.written_form
  )
  const head = kana
    ? word.written_form
    : `${word.written_form}（${word.reading}）`
  const title = `${head}の意味と由来｜${labels.slice(0, 2).join("・")}`
  const description = `「${word.written_form}」の${labels.length}つの意味（${labels.join("、")}）と由来を出典付きで解説。${word.summary}`
  return {
    title,
    description,
    alternates: { canonical: `/words/${word.slug}/` },
    openGraph: { type: "article", title, description },
  }
}

const Page = async ({ params }: Props) => {
  const word = getWord((await params).slug)
  if (!word) notFound()

  const sources = getWordSources(word.id)
  const number = new Map(sources.map((s, i) => [s.id, i + 1]))
  const senses = getSenses(word.id)
  const refs = (ids: string[]) =>
    ids.map((id) => ({ id, n: number.get(id) ?? 0 }))
  const articles = getArticles()
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
          refs: refs(s.source_ids),
          articles: articles
            .filter((a) => a.sense_ids.includes(s.id))
            .map(({ slug, title }) => ({ slug, title })),
        }))}
        sources={sources}
        relations={getRelations(word.id).map((r) => ({
          from: r.from,
          to: r.to,
          type: r.type,
          typeText: relationTypeLabel[r.type],
          description: r.description,
          certainty: r.certainty,
          certaintyText: certaintyLabel[r.certainty],
          refs: refs(r.source_ids),
        }))}
        related={getWords(word.related_word_ids).map((w) =>
          toRelatedItem(w, relatedNote(word, w))
        )}
        sameCategory={sameCategoryWords(word)}
        articles={getArticlesByIds(word.article_ids).map(toArticleSummary)}
      />
    </Container>
  )
}

export default Page
