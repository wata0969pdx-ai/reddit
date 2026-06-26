'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { compressImage } from '@/lib/image'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 返信先が変わったら入力欄にフォーカスする
  useEffect(() => {
    if (replyTo) {
      document.getElementById('comment-textarea')?.focus()
    }
  }, [replyTo])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('画像サイズは5MB以内にしてください')
      return
    }

    setError('')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    setImageFile(null)
    setImagePreview(null)
  }

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
      let imageUrl: string | null = null

      // 画像が選択されていればStorageにアップロード（投稿と同じ保存場所を使う）
      if (imageFile) {
        // アップロード前に縮小・WebP変換して転送量と保存容量を節約する
        const { file: uploadFile } = await compressImage(imageFile)
        const fileExt = uploadFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, uploadFile, { contentType: uploadFile.type })

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName)

        imageUrl = publicUrlData.publicUrl
      }

      const { error: supabaseError } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          body: body.trim(),
          reply_to_id: replyTo?.id ?? null,
          image_url: imageUrl,
        })

      if (supabaseError) throw supabaseError

      setBody('')
      handleRemoveImage()
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

      {/* 画像（任意） */}
      <div>
        {imagePreview ? (
          <div className="relative inline-block">
            <Image
              src={imagePreview}
              alt="プレビュー"
              width={160}
              height={160}
              unoptimized
              className="rounded-lg border border-gray-300 max-h-40 w-auto object-contain"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:text-white file:cursor-pointer file:bg-[#1a3c6e]"
          />
        )}
      </div>

      <p className="text-xs text-gray-400">
        ヒント：本文に <span className="font-mono font-semibold">{'>>'}番号</span> と書くと、そのコメントへのリンクになります（例：{'>>2'}）
      </p>

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
