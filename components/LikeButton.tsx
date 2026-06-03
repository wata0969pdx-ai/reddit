'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'

type Props = {
  postId: string
  initialLikes: number
}

export default function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ページを開いたとき、このユーザーがすでにいいねしているか確認
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') ?? '[]') as string[]
    setHasLiked(likedPosts.includes(postId))
  }, [postId])

  async function handleLike() {
    if (hasLiked || isLoading) return

    setIsLoading(true)

    try {
      const supabase = createSupabaseClient()
      // DBのいいね数を1増やす
      const { error } = await supabase.rpc('increment_likes', { post_id: postId })
      if (error) throw error

      // 画面のいいね数をすぐ更新（楽観的更新）
      setLikes((prev) => prev + 1)
      setHasLiked(true)

      // localStorageにいいね済みとして保存
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') ?? '[]') as string[]
      likedPosts.push(postId)
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
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
      className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all border"
      style={
        hasLiked
          ? { background: '#fef2f2', borderColor: '#fca5a5', color: '#ef4444', cursor: 'default' }
          : { background: 'white', borderColor: '#d1d5db', color: '#6b7280', cursor: 'pointer' }
      }
    >
      <span className="text-lg">{hasLiked ? '❤️' : '🤍'}</span>
      <span>{likes}</span>
      <span>{hasLiked ? 'いいね済み' : 'いいね'}</span>
    </button>
  )
}
