"use client"

import styled from "@emotion/styled"
import { color, fontSize, space, transition } from "@/styles/tokens"

const Form = styled.form<{ $large?: boolean }>(({ $large }) => ({
  display: "flex",
  alignItems: "stretch",
  width: "100%",
  maxWidth: $large ? "36rem" : "18rem",
  border: `${$large ? 2 : 1}px solid ${color.ink}`,
  background: "#fff",
  fontSize: $large ? fontSize.lg : fontSize.sm,
  transition: `box-shadow ${transition}`,
  "&:focus-within": { boxShadow: `4px 4px 0 ${color.accent}` },
}))

const Input = styled.input({
  flex: 1,
  minWidth: 0,
  border: 0,
  background: "transparent",
  padding: `${space.sm} ${space.md}`,
  "&:focus": { outline: "none" },
  "&::placeholder": { color: color.faint },
})

const Button = styled.button({
  border: 0,
  borderLeft: `1px solid ${color.ink}`,
  background: color.ink,
  color: color.bg,
  padding: `0 ${space.md}`,
  cursor: "pointer",
  transition: `background ${transition}`,
  "&:hover": { background: color.accent },
})

/** 言葉一覧ページ（/words/?q=）へ送るだけのシンプルな検索フォーム */
export const SearchBox = ({
  large,
  defaultValue,
  id = "search",
}: {
  large?: boolean
  defaultValue?: string
  id?: string
}) => (
  <Form action="/words/" method="get" role="search" $large={large}>
    <label htmlFor={id} className="visually-hidden">
      言葉を検索
    </label>
    <Input
      id={id}
      type="search"
      name="q"
      placeholder={
        large ? "言葉を検索（例：PR、マウス、くらうど）" : "言葉を検索"
      }
      defaultValue={defaultValue}
      autoComplete="off"
    />
    <Button type="submit">検索</Button>
  </Form>
)
