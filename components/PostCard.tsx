import Link from 'next/link'
import { Post, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'

type Props = {
  post: Post
}

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

export default function PostCard({ post }: Props) {
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category
  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.id}`} className="flex gap-4 p-4">
        <div className="flex-1 min-w-0">
          {/* カテゴリーバッジ */}
          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2 ${categoryColor}`}>
            {categoryLabel}
          </span>

          {/* タイトル */}
          <h2 className="text-base font-bold text-gray-900 mb-1 leading-snug hover:text-blue-700">
            {post.title}
          </h2>

          {/* 本文のプレビュー（最初の80文字） */}
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {post.body.length > 80 ? post.body.slice(0, 80) + '…' : post.body}
          </p>

          {/* 下部のメタ情報 */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {/* いいね数 */}
            <span className="flex items-center gap-1">
              <span>❤️</span>
              <span>{post.likes}</span>
            </span>

            {/* コメント数 */}
            <span className="flex items-center gap-1">
              <span>💬</span>
              <span>{post.comment_count ?? 0}</span>
            </span>

            {/* 投稿日時 */}
            <span className="ml-auto">{formatDate(post.created_at)}</span>
          </div>
        </div>

        {/* サムネイル画像 */}
        {post.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt=""
            className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-gray-200"
          />
        )}
      </Link>
    </div>
  )
}
