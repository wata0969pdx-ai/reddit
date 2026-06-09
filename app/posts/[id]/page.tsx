import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { Post, Comment, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'
import ShareButtons from '@/components/ShareButtons'
import { formatRelativeTime } from '@/lib/time'

type Params = Promise<{ id: string }>

async function fetchPost(id: string): Promise<Post | null> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
  if (error) return null
  return data
}

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
  const [post, comments] = await Promise.all([fetchPost(id), fetchComments(id)])
  if (!post) notFound()

  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category
  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const postUrl = `${siteUrl}/posts/${post.id}`

  return (
    <div className="max-w-2xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href={`/?category=${post.category}`} className="hover:text-blue-600">{categoryLabel}</Link>
      </nav>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
        <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-3 ${categoryColor}`}>
          {categoryLabel}
        </span>
        <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{post.title}</h1>
        <p className="text-xs text-gray-400 mb-4">{formatRelativeTime(post.created_at)}</p>

        {post.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt=""
            className="w-full max-h-[480px] object-contain rounded-lg border border-gray-200 mb-4 bg-gray-50"
          />
        )}

        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
          {post.body}
        </div>

        <LikeButton postId={post.id} initialLikes={post.likes} />
        <ShareButtons title={post.title} url={postUrl} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <CommentSection postId={post.id} comments={comments} />
      </div>
    </div>
  )
}
