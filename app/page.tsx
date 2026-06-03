import { Suspense } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { Post } from '@/types'

type SearchParams = Promise<{ category?: string }>

// 投稿一覧をSupabaseから取得する関数
async function fetchPosts(category?: string): Promise<Post[]> {
  const supabase = createSupabaseClient()

  let query = supabase
    .from('posts')
    .select('*, comments(count)')
    .order('created_at', { ascending: false })

  // カテゴリーが指定されている場合は絞り込む
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('投稿の取得に失敗しました:', error)
    return []
  }

  // comments(count) の結果を comment_count に変換
  return (data ?? []).map((post) => ({
    ...post,
    comment_count: (post.comments as { count: number }[])[0]?.count ?? 0,
    comments: undefined,
  }))
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { category } = await searchParams
  const posts = await fetchPosts(category)

  return (
    <div>
      {/* ページタイトル */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-700">
          {category && category !== 'all' ? '絞り込み結果' : '最新の投稿'}
        </h1>
        <Link
          href="/posts/new"
          className="text-sm font-semibold px-4 py-2 rounded-full text-white"
          style={{ background: '#16a34a' }}
        >
          + 投稿する
        </Link>
      </div>

      {/* カテゴリーフィルター */}
      <Suspense fallback={<div className="h-10 bg-gray-100 rounded animate-pulse mb-4" />}>
        <CategoryFilter />
      </Suspense>

      {/* 投稿一覧 */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">⚽</p>
          <p className="text-sm">まだ投稿がありません</p>
          <p className="text-sm">最初の投稿をしてみましょう！</p>
          <Link
            href="/posts/new"
            className="inline-block mt-4 text-sm font-semibold px-6 py-2 rounded-full text-white"
            style={{ background: '#1a3c6e' }}
          >
            投稿する
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
