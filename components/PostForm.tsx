'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { CATEGORIES } from '@/types'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

export default function PostForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('japan')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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

    // 入力チェック
    if (!title.trim()) {
      setError('タイトルを入力してください')
      return
    }
    if (!body.trim()) {
      setError('本文を入力してください')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createSupabaseClient()
      let imageUrl: string | null = null

      // 画像が選択されていればStorageにアップロード
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName)

        imageUrl = publicUrlData.publicUrl
      }

      const { data, error: supabaseError } = await supabase
        .from('posts')
        .insert({ title: title.trim(), body: body.trim(), category, image_url: imageUrl })
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // 作成した投稿の詳細ページへ移動
      router.push(`/posts/${data.id}`)
    } catch (err) {
      console.error(err)
      setError('投稿に失敗しました。もう一度お試しください。')
      setIsSubmitting(false)
    }
  }

  const postCategories = CATEGORIES.filter((c) => c.value !== 'all')

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* カテゴリー */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          カテゴリー <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {postCategories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* タイトル */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：久保選手の今シーズンを振り返る"
          maxLength={200}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/200</p>
      </div>

      {/* 本文 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          本文 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="自由に書いてください..."
          rows={8}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      {/* 画像（任意） */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          画像（任意）
        </label>

        {imagePreview ? (
          <div className="relative inline-block">
            <Image
              src={imagePreview}
              alt="プレビュー"
              width={240}
              height={240}
              unoptimized
              className="rounded-lg border border-gray-300 max-h-60 w-auto object-contain"
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
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer file:bg-[#1a3c6e]"
          />
        )}
        <p className="text-xs text-gray-400 mt-1">5MBまでの画像ファイルを選択できます</p>
      </div>

      {/* 送信ボタン */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-lg font-semibold text-sm text-white transition-colors disabled:opacity-60"
          style={{ background: isSubmitting ? '#9ca3af' : '#1a3c6e' }}
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg font-semibold text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
