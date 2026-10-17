import type { Metadata } from "next"
import { Shippori_Mincho } from "next/font/google"
import { ReactNode } from "react"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { site } from "@/lib/site"
import { GlobalStyle } from "@/styles/global"
import { EmotionRegistry } from "@/styles/registry"

const serif = Shippori_Mincho({
  weight: ["500", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}（${site.nameEn}）｜${site.tagline}`,
    template: `%s｜${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "ja_JP",
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ja" className={serif.variable}>
    <body>
      <EmotionRegistry>
        <GlobalStyle />
        <Header />
        <main>{children}</main>
        <Footer />
      </EmotionRegistry>
    </body>
  </html>
)

export default RootLayout
