import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SenseGraph } from "./SenseGraph"

describe("SenseGraph", () => {
  it("links each node to its sense and lists relations with evidence", () => {
    render(
      <SenseGraph
        root="バグ"
        nodes={[
          { id: "bug-insect", label: "虫", field: "一般" },
          { id: "bug-defect", label: "不具合", field: "情報" },
        ]}
        edges={[
          {
            from: "bug-insect",
            to: "bug-defect",
            type: "metaphor",
            typeText: "比喩",
            description: "虫を不具合に当てた",
            certainty: "confirmed",
            certaintyText: "確認済み",
            refs: [{ id: "kb-bug", n: 1 }],
          },
        ]}
      />
    )
    expect(screen.getByRole("link", { name: /不具合/ })).toHaveAttribute(
      "href",
      "#bug-defect"
    )
    expect(screen.getByText("比喩", { selector: "dd" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "[1]" })).toHaveAttribute(
      "href",
      "#src-kb-bug"
    )
  })
})
