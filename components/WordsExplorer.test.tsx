import { describe, expect, it } from "vitest"
import { sortByReading, toWordSummary, words } from "@/lib/data"
import { matches, normalize } from "./WordsExplorer"

const all = sortByReading(words).map(toWordSummary)
const search = (q: string, extra = {}) =>
  all
    .filter((w) =>
      matches(w, { q, row: "", category: "", tag: "", kind: "", ...extra })
    )
    .map((w) => w.slug)

describe("word search", () => {
  it("normalizes kana, width, case and variant spellings", () => {
    expect(normalize("ウィルス")).toBe(normalize("ウイルス"))
    expect(normalize("ＭＡＣ")).toBe("mac")
    expect(normalize("M・A・C")).toBe("mac")
    expect(normalize("ブラウザー")).toBe(normalize("ブラウザ"))
  })

  it("matches written form, reading, aliases and sense labels", () => {
    expect(search("ウィルス")).toEqual(["virus"])
    expect(search("くらうど")).toContain("cloud")
    expect(search("マクド")).toEqual(["mac"])
    expect(search("macintosh")).toEqual(["mac"])
    expect(search("pull request")).toEqual(["pr"])
    expect(search("該当しない語句")).toEqual([])
  })

  it("filters by how the meanings are related", () => {
    const distinct = search("", { kind: "distinct" })
    expect(distinct).toEqual(expect.arrayContaining(["pr", "mac", "python"]))
    expect(distinct).not.toContain("mouse")
    expect(search("", { kind: "polysemy" })).toContain("mouse")
  })
})
