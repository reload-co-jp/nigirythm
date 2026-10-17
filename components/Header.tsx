"use client"

import styled from "@emotion/styled"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { color, fontSize, mq, space, transition } from "@/styles/tokens"
import { Logo } from "./Logo"
import { SearchBox } from "./SearchBox"
import { Container } from "./ui"

const Bar = styled.header({
  borderBottom: `1px solid ${color.ink}`,
  background: color.bg,
})

const Inner = styled(Container)({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: `${space.sm} ${space.lg}`,
  paddingBlock: space.md,
  [mq.md]: { gridTemplateColumns: "auto 1fr auto" },
})

const Home = styled(Link)({ textDecoration: "none" })

const Nav = styled.nav({
  gridColumn: "1 / -1",
  gridRow: 2,
  overflowX: "auto",
  [mq.md]: { gridColumn: "auto", gridRow: "auto" },
  ul: {
    display: "flex",
    gap: space.lg,
    listStyle: "none",
    whiteSpace: "nowrap",
  },
})

const NavLink = styled(Link)({
  fontSize: fontSize.sm,
  textDecoration: "none",
  paddingBlock: space.xs,
  borderBottom: "2px solid transparent",
  transition: `border-color ${transition}, color ${transition}`,
  "&:hover": { color: color.accent },
  '&[aria-current="page"]': { borderColor: color.accent },
})

const SearchSlot = styled.div({
  display: "none",
  [mq.md]: { display: "block" },
})

const SearchLink = styled(Link)({
  fontSize: fontSize.sm,
  [mq.md]: { display: "none" },
})

const items = [
  { href: "/words/", label: "言葉" },
  { href: "/articles/", label: "読み物" },
  { href: "/categories/", label: "分類" },
  { href: "/about/", label: "ニギリスムとは" },
]

export const Header = () => {
  const pathname = usePathname()
  return (
    <Bar>
      <Inner>
        <Home href="/" aria-label="ニギリスム ホーム">
          <Logo fontSize="1.4rem" />
        </Home>
        <Nav aria-label="メイン">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  aria-current={
                    pathname?.startsWith(item.href) ? "page" : undefined
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </Nav>
        <SearchSlot>
          <SearchBox id="header-search" />
        </SearchSlot>
        <SearchLink href="/words/">検索</SearchLink>
      </Inner>
    </Bar>
  )
}
