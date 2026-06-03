'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIES } from '@/types'

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') ?? 'all'

  function handleCategoryChange(category: string) {
    if (category === 'all') {
      router.push('/')
    } else {
      router.push(`/?category=${category}`)
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = cat.value === currentCategory
        return (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className="whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-pointer border"
            style={
              isActive
                ? { background: '#1a3c6e', color: 'white', borderColor: '#1a3c6e' }
                : { background: 'white', color: '#374151', borderColor: '#d1d5db' }
            }
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
