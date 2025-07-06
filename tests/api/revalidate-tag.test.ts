import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/revalidate-tag/route'

// revalidateTagのモック
vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}))

describe('/api/revalidate-tag', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env = { ...OLD_ENV }
    process.env.REVALIDATE_SECRET = 'test-secret'
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('認証トークンがない場合は401を返す', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/revalidate-tag',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          postId: 1,
          slug: 'test-post',
          type: 'post',
        }),
      }
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('認証トークンが間違っている場合は401を返す', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/revalidate-tag',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-secret-token': 'wrong-secret',
        },
        body: JSON.stringify({
          postId: 1,
          slug: 'test-post',
          type: 'post',
        }),
      }
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('正しいリクエストの場合はrevalidateTagを呼び出して成功を返す', async () => {
    const { revalidateTag } = await import('next/cache')
    const request = new NextRequest(
      'http://localhost:3000/api/revalidate-tag',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-secret-token': 'test-secret',
        },
        body: JSON.stringify({
          postId: 1,
          slug: 'test-post',
          type: 'post',
        }),
      }
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.revalidated).toBe(true)
    expect(data.postId).toBe(1)
    expect(data.slug).toBe('test-post')
    expect(data.type).toBe('post')
    expect(data.timestamp).toBeDefined()
    expect(revalidateTag).toHaveBeenCalledWith('post-test-post')
    expect(revalidateTag).toHaveBeenCalledWith('posts-list')
  })

  it('固定ページの場合はpage-タグを使用する', async () => {
    const { revalidateTag } = await import('next/cache')
    const request = new NextRequest(
      'http://localhost:3000/api/revalidate-tag',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-secret-token': 'test-secret',
        },
        body: JSON.stringify({
          postId: 2,
          slug: 'about',
          type: 'page',
        }),
      }
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.revalidated).toBe(true)
    expect(data.type).toBe('page')
    expect(revalidateTag).toHaveBeenCalledWith('page-about')
    expect(revalidateTag).not.toHaveBeenCalledWith('posts-list')
  })

  it('バリデーションエラーの場合は400を返す', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/revalidate-tag',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-secret-token': 'test-secret',
        },
        body: JSON.stringify({
          postId: 'not-a-number', // 数値であるべき
          slug: '', // 空文字列
          type: 'invalid', // post または page のみ許可
        }),
      }
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation error')
    expect(data.details).toBeDefined()
    expect(data.details.length).toBeGreaterThan(0)
  })

  it('不正なJSONの場合は400を返す', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/revalidate-tag',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-secret-token': 'test-secret',
        },
        body: 'invalid json',
      }
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid JSON in request body')
  })

  it('typeが指定されていない場合はデフォルトでpostを使用する', async () => {
    const { revalidateTag } = await import('next/cache')
    const request = new NextRequest(
      'http://localhost:3000/api/revalidate-tag',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-secret-token': 'test-secret',
        },
        body: JSON.stringify({
          postId: 3,
          slug: 'default-type-test',
          // type を省略
        }),
      }
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.type).toBe('post')
    expect(revalidateTag).toHaveBeenCalledWith('post-default-type-test')
  })
})
