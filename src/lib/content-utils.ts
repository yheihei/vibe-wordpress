export function addHeadingIds(content: string): string {
  // サーバーサイドで動作するよう、正規表現を使用
  let headingIndex = 0
  const processedContent = content.replace(
    /<(h[2-4])([^>]*)>/gi,
    (match, tag, attributes) => {
      // 既にidがある場合はそのまま返す
      if (/id=["'][^"']+["']/.test(attributes)) {
        return match
      }
      // idを追加
      const id = `heading-${headingIndex}`
      headingIndex++
      return `<${tag}${attributes} id="${id}">`
    }
  )

  return processedContent
}

export function extractSummary(
  content: string,
  maxLength: number = 300
): string {
  // HTMLタグを除去
  const plainText = content.replace(/<[^>]*>/g, ' ')
  // 連続する空白を1つに
  const cleanText = plainText.replace(/\s+/g, ' ').trim()

  if (cleanText.length <= maxLength) {
    return cleanText
  }

  // 最後の完全な文で切る
  const truncated = cleanText.substring(0, maxLength)
  const lastPeriodIndex = truncated.lastIndexOf('。')

  if (lastPeriodIndex > maxLength * 0.8) {
    return truncated.substring(0, lastPeriodIndex + 1)
  }

  return truncated + '...'
}

export function calculateReadingTime(content: string): number {
  // HTMLタグを除去
  const plainText = content.replace(/<[^>]*>/g, ' ')
  // 連続する空白を1つに
  const cleanText = plainText.replace(/\s+/g, ' ').trim()

  // 日本語の平均読書速度は400-600文字/分
  const wordsPerMinute = 500
  const minutes = Math.ceil(cleanText.length / wordsPerMinute)

  return minutes
}

export function getWordCount(content: string): number {
  // HTMLタグを除去
  const plainText = content.replace(/<[^>]*>/g, ' ')
  // 連続する空白を1つに
  const cleanText = plainText.replace(/\s+/g, ' ').trim()

  return cleanText.length
}
