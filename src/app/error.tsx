'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="bg-slate-800 text-white border-4 border-black p-6 shadow-[8px_8px_0_0_#1e293b] max-w-md text-center">
        <h2 className="font-press-start text-xl text-red-400 mb-4">
          ERROR OCCURRED!
        </h2>
        <p className="text-gray-300 mb-6">
          申し訳ございません。エラーが発生しました。
        </p>
        <button
          onClick={reset}
          className="font-press-start text-sm bg-green-500 text-black px-4 py-2 border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-none hover:bg-green-400 active:translate-x-1 active:translate-y-1 transition-all transform"
        >
          RETRY
        </button>
      </div>
    </div>
  )
}