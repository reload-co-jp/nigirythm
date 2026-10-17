import type { Metadata } from "next"
import Link from "next/link"
import { StaticPage } from "@/components/StaticPage"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "ニギリスムとは",
  description: `${site.name}のコンセプトと運営者について。`,
  alternates: { canonical: "/about/" },
}

const Page = () => (
  <StaticPage
    kicker="About"
    title="ニギリスムとは"
    lede={site.tagline}
    path="/about/"
  >
    <p>
      ニギリスム（nigirythm）は、「二義」と「リズム」を掛け合わせた造語です。同じ音、同じ表記なのに、異なる意味や由来を持つ言葉を集め、その背景にある文化・歴史・技術を読み物として楽しめるようにまとめています。
    </p>
    <h2>同音異義語辞典ではなく</h2>
    <p>
      意味を並べるだけなら、辞書で足ります。ニギリスムが関心を寄せるのは、その意味が「なぜ」「いつ」分かれたのかです。比喩から生まれた言葉、別々の語句の略語がたまたま同じ形になった言葉、語源に俗説がまとわりついた言葉。それぞれの経緯を、出典とともにたどります。
    </p>
    <h2>似ているだけの言葉と、つながっている言葉</h2>
    <p>
      音や表記が同じでも、歴史的なつながりがあるとは限りません。麻雀の「リーチ」と英語由来の「リーチ」のように、辞書が別々の由来を示している言葉は「偶然の一致」として区別し、意味の分岐図でも破線で描いています。
    </p>
    <h2>運営者</h2>
    <p>
      {site.operator}が運営しています。ソースコードとコンテンツは
      <a href={site.repositoryUrl}>GitHubリポジトリ</a>
      で管理しています。調査と記述の方針は
      <Link href="/editorial-policy/">編集方針</Link>
      をご覧ください。
    </p>
  </StaticPage>
)

export default Page
