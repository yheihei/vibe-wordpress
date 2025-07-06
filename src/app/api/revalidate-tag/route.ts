import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

// リクエストボディのスキーマ定義
const RevalidateRequestSchema = z.object({
  postId: z.number(),
  slug: z.string().min(1),
  type: z.enum(['post', 'page']).default('post'),
})

type RevalidateRequest = z.infer<typeof RevalidateRequestSchema>

export async function POST(request: NextRequest) {
  // 認証トークンの検証
  const authToken = request.headers.get('x-secret-token')

  if (!authToken || authToken !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // リクエストボディの解析と検証
    const body = await request.json()
    const validatedData = RevalidateRequestSchema.parse(body)
    const { postId, slug, type } = validatedData

    // タグでキャッシュを無効化
    await revalidateTag(`${type}-${slug}`)

    // 投稿の場合は、関連するリストページも再生成
    if (type === 'post') {
      await revalidateTag('posts-list')
      // カテゴリーやタグリストも再生成するかは実装次第
      // await revalidateTag('category-list')
      // await revalidateTag('tag-list')
    }

    return NextResponse.json({
      revalidated: true,
      postId,
      slug,
      type,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)

    // Zodバリデーションエラーの場合
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    // JSONパースエラーの場合
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        {
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      )
    }

    // その他のエラー
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
