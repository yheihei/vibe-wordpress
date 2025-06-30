import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mt-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mt-4 mb-8">
          お探しのページは移動または削除された可能性があります。
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            トップページへ戻る
          </Link>
          <Link
            href="/search"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            記事を検索
          </Link>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: '404 - ページが見つかりません | Vibe',
  description: 'お探しのページは見つかりませんでした。',
}
