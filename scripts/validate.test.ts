import { describe, expect, it } from "vitest"
import { kanaRowOf } from "@/lib/kana"
import { loadData, validate } from "./validate"

describe("content data", () => {
  it("has no integrity errors", () => {
    expect(validate(loadData()).errors).toEqual([])
  })

  it("detects a sense without sources and a dangling reference", () => {
    const data = loadData()
    data.senses = [
      { ...data.senses[0], source_ids: ["missing-source"] },
      ...data.senses.slice(1),
    ]
    data.senses.push({ ...data.senses[1], id: "orphan", source_ids: [] })
    const { errors } = validate(data)
    expect(
      errors.some((e) => e.includes('"missing-source" が存在しません'))
    ).toBe(true)
    expect(
      errors.some((e) => e.includes("senses/orphan: 出典が登録されていません"))
    ).toBe(true)
  })
})

describe("relations", () => {
  it("rejects relations without evidence or across words", () => {
    const data = loadData()
    data.relations.push(
      {
        ...data.relations[0],
        from: "bug-insect",
        to: "bug-defect",
        source_ids: [],
      },
      { ...data.relations[0], from: "bug-insect", to: "mouse-device" }
    )
    const { errors } = validate(data)
    expect(errors).toContain(
      "relations/bug-insect→bug-defect: 同じ意味の組の関係が重複しています"
    )
    expect(errors).toContain(
      "relations/bug-insect→bug-defect: 出典が登録されていません"
    )
    expect(errors).toContain(
      "relations/bug-insect→mouse-device: 別々の見出し語の意味を結んでいます"
    )
  })

  it("rejects word links to unpublished words", () => {
    const data = loadData()
    data.bodies["cloud-before-2006"] +=
      '<WordLink slug="meme">ミーム</WordLink>'
    expect(validate(data).errors).toContain(
      'articles/cloud-before-2006: 本文の <WordLink slug="meme"> が公開中の言葉にありません'
    )
  })
})

describe("kanaRowOf", () => {
  it("maps readings to gojūon rows", () => {
    expect(kanaRowOf("ぴーあーる")).toBe("は")
    expect(kanaRowOf("ういるす")).toBe("あ")
    expect(kanaRowOf("ぁ")).toBe("あ")
    expect(kanaRowOf("マック")).toBe("ま")
    expect(kanaRowOf("ゃ")).toBe("や")
    expect(kanaRowOf("abc")).toBeNull()
  })
})
