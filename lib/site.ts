export const site = {
  name: "ニギリスム",
  nameEn: "nigirythm",
  tagline: "言葉の裏に、もうひとつの意味。",
  description:
    "同じ音・同じ表記なのに、異なる意味や由来を持つ言葉を集めた読み物の辞典。略語の衝突、比喩から生まれた言葉、語源の俗説まで、出典付きで掘り下げます。",
  // canonical・サイトマップ・OGPに使用。環境変数で上書きできる
  url: (
    process.env.NEXT_PUBLIC_SITE_URL || "https://nigirythm.reload.co.jp"
  ).replace(/\/$/, ""),
  operator: "ニギリスム編集部（reload-co-jp）",
  repositoryUrl: "https://github.com/reload-co-jp/nigirythm",
  contactUrl: "https://github.com/reload-co-jp/nigirythm/issues",
}

export const absoluteUrl = (path: string) => `${site.url}${path}`
