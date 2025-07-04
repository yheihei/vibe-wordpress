type ArticleSummaryProps = {
  summary: string
  readingTime: number
  wordCount: number
}

export function ArticleSummary({
  summary,
  readingTime,
  wordCount,
}: ArticleSummaryProps) {
  return (
    <div
      className="bg-slate-700 border-2 border-dashed border-gray-600 p-4 mb-8"
      aria-label="記事の概要"
    >
      <h2 className="sr-only">記事の概要</h2>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-gray-400 inline">読了時間：</dt>
          <dd className="text-white inline">約{readingTime}分</dd>
        </div>
        <div>
          <dt className="text-gray-400 inline">文字数：</dt>
          <dd className="text-white inline">
            {wordCount.toLocaleString()}文字
          </dd>
        </div>
        <div>
          <dt className="text-gray-400">概要：</dt>
          <dd className="text-gray-300 mt-1">{summary}</dd>
        </div>
      </dl>
    </div>
  )
}
