export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="font-press-start text-2xl text-green-400 mb-4">
          <span>Loading</span>
          <span className="animate-pulse">...</span>
        </div>
        <div className="text-gray-400">データを読み込み中</div>
      </div>
    </div>
  )
}