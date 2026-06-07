'use client'

import { useState } from 'react'
import { Comment } from '@/types'
import CommentForm from '@/components/CommentForm'
import CommentLikeButton from '@/components/CommentLikeButton'
import CommentBody from '@/components/CommentBody'

type ReplyTarget = {
  id: string
  number: number
} | null

type Props = {
  postId: string
  comments: Comment[]
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

export default function CommentSection({ postId, comments }: Props) {
  const [replyTo, setReplyTo] = useState<ReplyTarget>(null)

  // コメントIDから「何番目のコメントか」を調べるための対応表
  const numberById = new Map(comments.map((c, index) => [c.id, index + 1]))

  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-4">
        コメント ({comments.length})
      </h2>

      {/* コメント投稿フォーム */}
      <div className="mb-6">
        <CommentForm postId={postId} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
      </div>

      {/* コメント一覧 */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          まだコメントがありません。最初のコメントをどうぞ！
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => {
            const number = index + 1
            const replyToNumber = comment.reply_to_id ? numberById.get(comment.reply_to_id) : undefined

            return (
              <div key={comment.id} id={`comment-${number}`} className="flex gap-3 rounded-lg transition-colors duration-300">
                {/* コメント番号 */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#1a3c6e' }}
                >
                  {number}
                </div>

                {/* コメント内容 */}
                <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3">
                  {/* 返信先の表示 */}
                  {replyToNumber && (
                    <p className="text-xs font-semibold text-blue-600 mb-1">
                      → #{replyToNumber} さんへの返信
                    </p>
                  )}

                  <CommentBody text={comment.body} />

                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-gray-400">{formatDate(comment.created_at)}</p>
                    <CommentLikeButton commentId={comment.id} initialLikes={comment.likes} />
                    <button
                      onClick={() => setReplyTo({ id: comment.id, number })}
                      className="text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      返信する
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
