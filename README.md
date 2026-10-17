# ニギリスム（nigirythm）

> 言葉の裏に、もうひとつの意味。

同じ音・同じ表記なのに異なる意味や由来を持つ言葉を集め、その背景を出典付きで掘り下げる読み物の辞典です。

## 技術構成

- Next.js 16（App Router / `output: "export"` による静的書き出し）
- React 19 / TypeScript
- Emotion（`@emotion/react` / `@emotion/styled`）— Tailwind CSS は使用しない
- MDX（`@next/mdx`）による記事本文、JSON による辞典データ
- Vitest / ESLint / Prettier
- GitHub Actions で GitHub Pages へデプロイ（`.github/workflows/deploy.yml`）

## 開発

Node.js 24 と pnpm を使います。

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## ビルドと検証

```bash
pnpm build            # 静的サイトを out/ に書き出す
pnpm typecheck        # 型チェック
pnpm lint             # ESLint
pnpm test             # Vitest（データ整合性チェックを含む）
pnpm validate         # 辞典データ・記事の整合性チェック
pnpm validate:links   # 上記＋出典URLのリンク切れチェック（ネットワーク必須）
```

`pnpm validate` は次を検出し、エラーがあれば終了コード 1 を返します。

- id / slug の重複、存在しない分類・関連語・記事・出典への参照
- 出典が1件も紐づいていない意味（sense）、意味が登録されていない公開語
- 公開記事から未公開の言葉への参照、MDX 本文ファイルの欠落
- 本文の `<Ref id="..." />` と記事の `source_ids` の不一致
- 出典の必須項目（資料名・URL・参照日・裏付け）の欠落

`--links` では各出典URLへ実際にアクセスし、404 などをエラー、403/429（ボット拒否の可能性）を警告として報告します。

ビルド結果をローカルで確認するには、`out/` を静的サーバーで配信します（例：`python3 -m http.server 4321 -d out`）。

## ディレクトリ構成

```
app/                 ページ（App Router）、sitemap.ts、robots.ts、OGP画像、ファビコン
components/          表示コンポーネント（Emotion。"use client"）
content/articles/    記事本文（MDX）
data/                辞典データ（JSON）
  words.json         見出し語（Word）
  senses.json        意味・用法（Sense）
  sources.json       出典（Source）
  categories.json    分類
  articles.json      記事のメタデータ（Article）
lib/                 データ取得・整形、サイト設定
scripts/validate.ts  データ検証スクリプト（＋テスト）
styles/              デザイントークン、グローバルスタイル、Emotion の SSR レジストリ
```

データ（`data/`・`content/`）と表示（`components/`）は分離しています。ページ（Server Component）がデータを読み、整形した値だけを表示コンポーネントへ渡します。

### Emotion と Server Components

Emotion は React Context を使うため、スタイルを定義するコンポーネントはすべて `"use client"` です。`styles/registry.tsx` が `useServerInsertedHTML` でレンダリング中のスタイルを `<style>` として HTML に出力するため、静的書き出し後も初期表示でスタイルが欠落しません。色・余白・文字サイズ・ブレークポイントは `styles/tokens.ts` に集約しています。

## コンテンツの追加

### 言葉を追加する

1. `data/sources.json` に出典を追加する。`supports`（何を裏付けるか）と `relevant_section`（該当箇所）を必ず書く。`source_type` は `dictionary` / `encyclopedia` / `official` / `paper` / `book` / `news` / `article` のいずれか。
2. `data/words.json` に見出し語を追加する。調査中は `"status": "candidate"`（公開されず、編集方針ページの「調査中の候補語」に表示される）。出典を確認できたら `"published"` にする。
3. `data/senses.json` に意味を1件ずつ追加する。由来が異なる意味は別の sense にする。
   - `relationship_type`：`origin` / `extension` / `metaphor` / `abbreviation` / `proper-noun` / `jargon-transfer` / `semantic-shift` / `unrelated`
   - `certainty`：`confirmed`（確認済み）/ `probable`（有力）/ `disputed`（諸説あり）/ `unknown`（未確認）
   - 確認できない `first_attestation` などは空文字にする（画面には「未確認（調査中）」と表示される）。
4. `pnpm validate` でエラーがないことを確認する。

### 記事を追加する

1. `data/articles.json` にメタデータを追加する（下書きは `"status": "draft"`。公開ページは生成されない）。
2. `content/articles/<slug>.mdx` に本文を書く。主張ごとに `<Ref id="出典id" />` を置くと、記事末尾の出典一覧への注番号になる。

```mdx
導入段落。読者の身近な場面から入る。

## 背景

辞典によれば〜とされる<Ref id="kb-example" />。

## 調査

資料Aは〜と記し<Ref id="source-a" />、資料Bは〜としている<Ref id="source-b" />。

## 考察

確認できた事実と、推測・未確認の点を分けて書く。
```

3. 対象の言葉の `article_ids` と、記事の `word_ids` の両方に互いを登録する（片方だけだと `pnpm validate` が警告する）。

## デプロイ

`main` ブランチへの push で GitHub Actions が `pnpm build` を実行し、`out/` を GitHub Pages に公開します。

- 本番URLを環境変数 `NEXT_PUBLIC_SITE_URL`（例：`https://example.com`）で指定してください。canonical・サイトマップ・OGP・構造化データの絶対URLに使われます。未指定時は `http://localhost:3000` になります。GitHub Actions ではリポジトリの Variables などに設定し、ビルドステップの `env` に渡します。
- `owner.github.io/<repo>/` のようなサブパスで公開する場合は、`next.config.js` に `basePath` を設定してください。
- Vercel など他の静的ホスティングでも、`pnpm build` の出力 `out/` をそのまま配信できます。

## 編集方針

出典の扱いと確度表示の基準はサイト内の `/editorial-policy/` を参照してください。AI で候補語や資料を集めた場合も、出典の実在性と記述との対応を確認してから `published` にします。
