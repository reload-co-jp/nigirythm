import type { Metadata } from "next"
import Link from "next/link"
import { StaticPage } from "@/components/StaticPage"
import { candidateWords, certaintyLabel } from "@/lib/data"

export const metadata: Metadata = {
  title: "編集方針・出典方針",
  description:
    "ニギリスムの調査方針、出典の扱い、根拠の確度表示、訂正の方針について。",
  alternates: { canonical: "/editorial-policy/" },
}

const Page = () => (
  <StaticPage
    kicker="Editorial policy"
    title="編集方針・出典方針"
    lede="語源の正確性を、もっとも重要な品質基準としています。"
    path="/editorial-policy/"
  >
    <h2>調査の方針</h2>
    <ul>
      <li>公式資料、歴史的記録、専門辞書、学術論文などを優先します。</li>
      <li>可能な限り、一次資料や原典を確認します。</li>
      <li>由来（語源）と現在の意味を混同しません。</li>
      <li>
        「初出（確認できる最古の用例）」と「普及（広まった時期・きっかけ）」を区別して記載します。
      </li>
      <li>複数の説がある場合は、それぞれの説と根拠を記載します。</li>
      <li>
        確認できない語源は断定しません。未確認の項目は「未確認（調査中）」と表示します。
      </li>
      <li>音や表記が似ているだけで、歴史的な関係があるとは主張しません。</li>
      <li>推測や俗説は、確認された事実と区別して書きます。</li>
    </ul>

    <h2>出典の扱い</h2>
    <p>
      出典は、言葉全体ではなく「意味（用法）」や記事中の主張ごとに紐づけています。各出典には、資料名・著者・発行元・参照日に加えて、その資料が何を裏付けるのか（裏付け）と該当箇所を記載し、読者が原典を確認できるようにしています。
    </p>
    <p>
      AIを用いて候補語や資料を収集する場合も、出典が実在すること、そこに書かれている内容が記述を裏付けていることを確認してから公開します。本文を確認できていない資料は、その旨を注記します。
    </p>

    <h2>根拠の確度</h2>
    <p>各意味には、次の4段階で根拠の確度を表示しています。</p>
    <ul>
      <li>
        <strong>{certaintyLabel.confirmed}</strong>
        ：辞書・公式資料・一次資料などで確認できたもの
      </li>
      <li>
        <strong>{certaintyLabel.probable}</strong>
        ：当事者の回想や単一の資料に基づくなど、有力だが裏付けが限られるもの
      </li>
      <li>
        <strong>{certaintyLabel.disputed}</strong>
        ：初出や命名者について、資料によって説明が異なるもの
      </li>
      <li>
        <strong>{certaintyLabel.unknown}</strong>
        ：由来などを確認できていないもの
      </li>
    </ul>

    <h2>訂正の方針</h2>
    <p>
      誤りが判明した場合は速やかに訂正し、該当ページの更新日を改めます。誤りのご指摘や、より確かな資料の情報は
      <Link href="/contact/">お問い合わせ</Link>
      からお寄せください。
    </p>

    <h2>調査中の候補語</h2>
    <p>
      以下の言葉は、出典の確認が済んでいないため、まだ辞典として公開していません。確認できたものから順次公開します。
    </p>
    <p>{candidateWords.map((w) => w.written_form).join("、")}</p>
  </StaticPage>
)

export default Page
