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
