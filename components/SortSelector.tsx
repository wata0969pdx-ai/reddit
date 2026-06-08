'use client'

import { useRouter, useSearchParams } from 'next/navigation'

// 並べ替えの選択肢
const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'new', label: '新着順' },
  { value: 'popular', label: '人気順' },
  { value: 'comments', label: 'コメント数順' },
]

export default function SortSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') ?? 'new'

  function handleSortChange(sort: string) {
    const params = new URLSearchParams(searchParams.toString())

    // 新着順（初期状態）のときはURLに付けない
    if (sort === 'new') {
      params.delete('sort')
    } else {
      params.set('sort', sort)
    }

    router.push(params.toString() ? `/?${params.toString()}` : '/')
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs text-gray-400 flex-shrink-0">並べ替え:</span>
      <div className="flex gap-2">
        {SORT_OPTIONS.map((option) => {
          const isActive = option.value === currentSort
          return (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className="whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer border"
              style={
                isActive
                  ? { background: '#16a34a', color: 'white', borderColor: '#16a34a' }
                  : { background: 'white', color: '#374151', borderColor: '#d1d5db' }
              }
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
