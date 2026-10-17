import type { Metadata } from "next"
import Link from "next/link"
import { StaticPage } from "@/components/StaticPage"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${site.name}における個人情報の取り扱いについて。`,
  alternates: { canonical: "/privacy/" },
}

const Page = () => (
  <StaticPage kicker="Privacy" title="プライバシーポリシー" path="/privacy/">
    <h2>収集する情報</h2>
    <p>
      本サイトは静的なWebサイトとして配信しており、会員登録やコメントなど、利用者が個人情報を入力する機能はありません。現在、アクセス解析ツールや広告配信サービスは導入していません。
    </p>
    <h2>サーバーのログ</h2>
    <p>
      本サイトをホスティングする事業者が、配信のためにアクセス元IPアドレスやブラウザーの種類などを記録する場合があります。これらの取り扱いは、各事業者のプライバシーポリシーに従います。
    </p>
    <h2>外部サイトへのリンク</h2>
    <p>
      出典として外部のWebサイトへリンクしています。リンク先での情報の取り扱いについては、各サイトの方針をご確認ください。
    </p>
    <h2>お問い合わせの情報</h2>
    <p>
      お問い合わせの際にいただいた情報は、回答と記事の訂正のためにのみ利用します。詳しくは
      <Link href="/contact/">お問い合わせ</Link>をご覧ください。
    </p>
    <h2>改定</h2>
    <p>
      アクセス解析ツールの導入などにより取り扱いが変わる場合は、本ページを改定してお知らせします。
    </p>
  </StaticPage>
)

export default Page
