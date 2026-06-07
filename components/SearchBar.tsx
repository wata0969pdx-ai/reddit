'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('search') ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())
    const trimmed = keyword.trim()

    if (trimmed) {
      params.set('search', trimmed)
    } else {
      params.delete('search')
    }

    router.push(params.toString() ? `/?${params.toString()}` : '/')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="タイトル・本文を検索..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-5 py-2 rounded-full text-sm font-semibold text-white"
        style={{ background: '#1a3c6e' }}
      >
        検索
      </button>
    </form>
  )
}
