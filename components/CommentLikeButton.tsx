'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'

type Props = {
  commentId: string
  initialLikes: number
}

export default function CommentLikeButton({ commentId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ページを開いたとき、このユーザーがすでにいいねしているか確認
  useEffect(() => {
    const likedComments = JSON.parse(localStorage.getItem('likedComments') ?? '[]') as string[]
    setHasLiked(likedComments.includes(commentId))
  }, [commentId])

  async function handleLike() {
    if (hasLiked || isLoading) return

    setIsLoading(true)

    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.rpc('increment_comment_likes', { comment_id: commentId })
      if (error) throw error

      setLikes((prev) => prev + 1)
      setHasLiked(true)

      const likedComments = JSON.parse(localStorage.getItem('likedComments') ?? '[]') as string[]
      likedComments.push(commentId)
      localStorage.setItem('likedComments', JSON.stringify(likedComments))
    } catch (err) {
      console.error('いいねに失敗しました:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked || isLoading}
      className="flex items-center gap-1 text-xs font-medium transition-colors"
      style={{ color: hasLiked ? '#ef4444' : '#9ca3af', cursor: hasLiked ? 'default' : 'pointer' }}
    >
      <span>{hasLiked ? '❤️' : '🤍'}</span>
      <span>{likes}</span>
      <span>いいね</span>
    </button>
  )
}
