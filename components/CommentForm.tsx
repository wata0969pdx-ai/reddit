'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

type ReplyTarget = {
  id: string
  number: number
} | null

type Props = {
  postId: string
  replyTo?: ReplyTarget
  onCancelReply?: () => void
}

export default function CommentForm({ postId, replyTo = null, onCancelReply }: Props) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 返信先が変わったら入力欄にフォーカスする
  useEffect(() => {
    if (replyTo) {
      document.getElementById('comment-textarea')?.focus()
    }
  }, [replyTo])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!body.trim()) {
      setError('コメントを入力してください')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createSupabaseClient()
      const { error: supabaseError } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          body: body.trim(),
          reply_to_id: replyTo?.id ?? null,
        })

      if (supabaseError) throw supabaseError

      setBody('')
      onCancelReply?.()
      // サーバーコンポーネントのデータを再取得して画面を更新
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('コメントの送信に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 返信先の表示 */}
      {replyTo && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm">
          <span>#{replyTo.number} さんに返信中</span>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-blue-400 hover:text-blue-600 font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}

      <textarea
        id="comment-textarea"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={replyTo ? `#${replyTo.number} さんへの返信を書く...` : 'コメントを書いてください...'}
        rows={4}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !body.trim()}
          className="px-6 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60"
          style={{ background: isSubmitting || !body.trim() ? '#9ca3af' : '#1a3c6e' }}
        >
          {isSubmitting ? '送信中...' : replyTo ? '返信する' : 'コメントする'}
        </button>
      </div>
    </form>
  )
}
