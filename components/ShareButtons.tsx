'use client'

import { useState } from 'react'

type Props = {
  title: string
  url: string
}

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title + ' | サカボード')

  const xShareUrl = `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-xs text-gray-400">シェア:</span>

      {/* X (Twitter) */}
      <a
        href={xShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-80"
        style={{ background: '#000000' }}
      >
        𝕏 ポスト
      </a>

      {/* LINE */}
      <a
        href={lineShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-80"
        style={{ background: '#06C755' }}
      >
        LINE
      </a>

      {/* URLコピー */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
        style={
          copied
            ? { background: '#f0fdf4', borderColor: '#86efac', color: '#16a34a' }
            : { background: 'white', borderColor: '#d1d5db', color: '#6b7280' }
        }
      >
        {copied ? '✓ コピー済み' : '🔗 URLコピー'}
      </button>
    </div>
  )
}
