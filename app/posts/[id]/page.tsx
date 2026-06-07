import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { Post, Comment, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'

type Params = Promise<{ id: string }>

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 投稿の詳細を取得
async function fetchPost(id: string): Promise<Post | null> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// コメント一覧を取得
async function fetchComments(postId: string): Promise<Comment[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) return []
  return data ?? []
}

export default async function PostDetailPage({ params }: { params: Params }) {
  const { id } = await params

  // 投稿とコメントを並行して取得（速い！）
  const [post, comments] = await Promise.all([
    fetchPost(id),
    fetchComments(id),
  ])

  // 投稿が見つからない場合は404ページを表示
  if (!post) notFound()

  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category
  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="max-w-2xl mx-auto">
      {/* パンくずリスト */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href={`/?category=${post.category}`} className="hover:text-blue-600">
          {categoryLabel}
        </Link>
      </nav>

      {/* 投稿カード */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
        {/* カテゴリー */}
        <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-3 ${categoryColor}`}>
          {categoryLabel}
        </span>

        {/* タイトル */}
        <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
          {post.title}
        </h1>

        {/* 投稿日時 */}
        <p className="text-xs text-gray-400 mb-4">
          {formatDate(post.created_at)}
        </p>

        {/* 画像 */}
        {post.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt=""
            className="w-full max-h-[480px] object-contain rounded-lg border border-gray-200 mb-4 bg-gray-50"
          />
        )}

        {/* 本文 */}
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
          {post.body}
        </div>

        {/* いいねボタン */}
        <LikeButton postId={post.id} initialLikes={post.likes} />
      </div>

      {/* コメントセクション */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <CommentSection postId={post.id} comments={comments} />
      </div>
    </div>
  )
}
