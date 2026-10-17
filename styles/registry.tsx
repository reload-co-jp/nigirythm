"use client"

import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { useServerInsertedHTML } from "next/navigation"
import { ReactNode, useState } from "react"

/**
 * App Router で Emotion のスタイルを SSR 時に <head> へ流し込むためのレジストリ。
 * レンダリング中に挿入されたスタイルを集め、useServerInsertedHTML で出力する。
 */
export const EmotionRegistry = ({ children }: { children: ReactNode }) => {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "n" })
    cache.compat = true
    const prevInsert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }
    const flush = () => {
      const prev = inserted
      inserted = []
      return prev
    }
    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) return null
    const styles = names
      .map((name) => cache.inserted[name])
      .filter((style) => typeof style === "string")
      .join("")
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
