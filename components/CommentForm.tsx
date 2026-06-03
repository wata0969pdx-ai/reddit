'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

type Props = {
  postId: string
}

export default function CommentForm({ postId }: Props) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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
        .insert({ post_id: postId, body: body.trim() })

      if (supabaseError) throw supabaseError

      setBody('')
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

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="コメントを書いてください..."
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
          {isSubmitting ? '送信中...' : 'コメントする'}
        </button>
      </div>
    </form>
  )
}
