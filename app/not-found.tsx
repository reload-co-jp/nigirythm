import Link from "next/link"
import { SearchBox } from "@/components/SearchBox"
import { DisplayTitle, Kicker, Lede } from "@/components/Typography"
import { Container, PageHeader } from "@/components/ui"

const NotFound = () => (
  <Container>
    <PageHeader>
      <Kicker>404</Kicker>
      <DisplayTitle>ページが見つかりません</DisplayTitle>
      <Lede>
        お探しの言葉は、まだ調査中かもしれません。検索するか、
        <Link href="/words/">言葉一覧</Link>
        からお探しください。
      </Lede>
      <SearchBox large id="notfound-search" />
    </PageHeader>
  </Container>
)

export default NotFound
