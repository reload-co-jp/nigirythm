export const kanaRows = [
  "あ",
  "か",
  "さ",
  "た",
  "な",
  "は",
  "ま",
  "や",
  "ら",
  "わ",
]

const rowChars = [
  "あいうえお",
  "かきくけこ",
  "さしすせそ",
  "たちつてと",
  "なにぬねの",
  "はひふへほ",
  "まみむめも",
  "やゆよ",
  "らりるれろ",
  "わをん",
]

const small: Record<string, string> = {
  ぁ: "あ",
  ぃ: "い",
  ぅ: "う",
  ぇ: "え",
  ぉ: "お",
  っ: "つ",
  ゃ: "や",
  ゅ: "ゆ",
  ょ: "よ",
  ゎ: "わ",
}

/** 読み（ひらがな・カタカナ）の頭文字が属する五十音の行を返す。該当しなければ null */
export const kanaRowOf = (reading: string): string | null => {
  const first = reading.normalize("NFD").charAt(0)
  const code = first.charCodeAt(0)
  // カタカナをひらがなに寄せる
  const hira =
    code >= 0x30a1 && code <= 0x30f6 ? String.fromCharCode(code - 0x60) : first
  const base = small[hira] ?? hira
  const index = rowChars.findIndex((row) => row.includes(base))
  return index === -1 ? null : kanaRows[index]
}
