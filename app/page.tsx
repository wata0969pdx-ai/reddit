import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { createSupabaseClient } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'
import SearchBar from '@/components/SearchBar'
import SortSelector from '@/components/SortSelector'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { Post } from '@/types'

type SearchParams = Promise<{ category?: string; search?: string; sort?: string }>

// ホーム画面の投稿一覧は同じ内容が短時間に何度も読まれるため、
// unstable_cache で結果を一定時間キャッシュしてDBへの問い合わせ回数を減らす。
// （引数の category / search / sort は自動でキャッシュキーに含まれる）
// 新しい投稿やコメントは最大 REVALIDATE_SECONDS 秒で一覧に反映される。
const REVALIDATE_SECONDS = 30

// 投稿一覧をSupabaseから取得する関数（キャッシュ対象）
const fetchPosts = unstable_cache(
  async (category?: string, search?: string, sort?: string): Promise<Post[]> => {
    const supabase = createSupabaseClient()

    let query = supabase.from('posts').select('*, comments(count)')

    // 並べ替え：人気順はいいね数、それ以外は新着順で取得する
    // （コメント数順は件数を取得したあとにJavaScript側で並べ替える）
    if (sort === 'popular') {
      query = query.order('likes', { ascending: false }).order('created_at', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // カテゴリーが指定されている場合は絞り込む
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // キーワードが指定されている場合はタイトル・本文から検索する
    if (search) {
      // フィルター構文を壊す記号を取り除く
      const keyword = search.replace(/[,()%]/g, '').trim()
      if (keyword) {
        query = query.or(`title.ilike.%${keyword}%,body.ilike.%${keyword}%`)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('投稿の取得に失敗しました:', error)
      return []
    }

    // comments(count) の結果を comment_count に変換
    const posts: Post[] = (data ?? []).map((post) => ({
      ...post,
      comment_count: (post.comments as { count: number }[])[0]?.count ?? 0,
      comments: undefined,
    }))

    // コメント数順はSupabaseでは並べ替えできないため、ここで並べ替える
    if (sort === 'comments') {
      posts.sort((a, b) => (b.comment_count ?? 0) - (a.comment_count ?? 0))
    }

    return posts
  },
  ['home-posts'],
  { revalidate: REVALIDATE_SECONDS, tags: ['posts'] }
)

// サイドバー用：いいねが多い人気の投稿を取得する（キャッシュ対象）
const fetchPopularPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('likes', { ascending: false })
      .limit(5)

    if (error) {
      console.error('人気の投稿の取得に失敗しました:', error)
      return []
    }

    return data ?? []
  },
  ['popular-posts'],
  { revalidate: REVALIDATE_SECONDS, tags: ['posts'] }
)

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { category, search, sort } = await searchParams

  // 投稿一覧とサイドバー用の人気投稿を並行して取得する
  const [posts, popularPosts] = await Promise.all([
    fetchPosts(category, search, sort),
    fetchPopularPosts(),
  ])

  return (
    <div className="flex gap-6 items-start">
      {/* 左：メインカラム */}
      <div className="flex-1 min-w-0">
        {/* ページタイトル */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-700">
            {search ? `「${search}」の検索結果` : category && category !== 'all' ? '絞り込み結果' : '最新の投稿'}
          </h1>
          <Link
            href="/posts/new"
            className="text-sm font-semibold px-4 py-2 rounded-full text-white"
            style={{ background: '#16a34a' }}
          >
            + 投稿する
          </Link>
        </div>

        {/* 検索ボックス */}
        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-full animate-pulse mb-4" />}>
          <SearchBar />
        </Suspense>

        {/* カテゴリーフィルター */}
        <Suspense fallback={<div className="h-10 bg-gray-100 rounded animate-pulse mb-4" />}>
          <CategoryFilter />
        </Suspense>

        {/* 並べ替え */}
        <Suspense fallback={<div className="h-8 bg-gray-100 rounded animate-pulse mb-4" />}>
          <SortSelector />
        </Suspense>

        {/* 投稿一覧 */}
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">⚽</p>
            {search ? (
              <>
                <p className="text-sm">「{search}」に一致する投稿が見つかりませんでした</p>
                <Link href="/" className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline">
                  検索条件をクリアする
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm">まだ投稿がありません</p>
                <p className="text-sm">最初の投稿をしてみましょう！</p>
                <Link
                  href="/posts/new"
                  className="inline-block mt-4 text-sm font-semibold px-6 py-2 rounded-full text-white"
                  style={{ background: '#1a3c6e' }}
                >
                  投稿する
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* 右：サイドバー */}
      <Sidebar popularPosts={popularPosts} />
    </div>
  )
}
