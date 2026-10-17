import type { Metadata } from "next"
import { StaticPage } from "@/components/StaticPage"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: `${site.name}へのお問い合わせ、誤りのご指摘について。`,
  alternates: { canonical: "/contact/" },
}

const Page = () => (
  <StaticPage
    kicker="Contact"
    title="お問い合わせ"
    lede="記述の誤りのご指摘、より確かな資料の情報、取り上げてほしい言葉などをお寄せください。"
    path="/contact/"
  >
    <h2>連絡先</h2>
    <p>
      <a href={site.contactUrl}>GitHub Issues</a>
      で受け付けています。誤りのご指摘の際は、該当ページのURLと、根拠となる資料（書名・URL・該当箇所）を添えていただけると、確認がスムーズです。
    </p>
    <h2>ご注意</h2>
    <p>
      Issues
      は公開されます。個人情報や、公開を望まない内容は書き込まないでください。いただいた内容をもとに記事を訂正した場合は、該当ページの更新日を改めます。
    </p>
  </StaticPage>
)

export default Page
