import Link from 'next/link'
import { Post, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'
import { formatRelativeTime } from '@/lib/time'

type Props = {
  post: Post
}

export default function PostCard({ post }: Props) {
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category
  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden">
      <div className="flex">
        {/* 左：いいね数の縦レール（Redditっぽい） */}
        <div className="flex flex-col items-center justify-start gap-1 px-3 py-4 bg-gray-50 border-r border-gray-100 flex-shrink-0 w-14">
          <span className="text-lg leading-none">❤️</span>
          <span className="text-sm font-bold text-gray-700">{post.likes}</span>
        </div>

        {/* 右：本文（クリックで詳細へ） */}
        <Link href={`/posts/${post.id}`} className="flex gap-4 p-4 flex-1 min-w-0">
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
              {/* コメント数 */}
              <span className="flex items-center gap-1">
                <span>💬</span>
                <span>{post.comment_count ?? 0} 件のコメント</span>
              </span>

              {/* 投稿日時（◯分前） */}
              <span className="ml-auto">{formatRelativeTime(post.created_at)}</span>
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
    </div>
  )
}
