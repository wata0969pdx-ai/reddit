import Link from 'next/link'
import { Post, CATEGORIES } from '@/types'

type Props = {
  popularPosts: Post[]
}

export default function Sidebar({ popularPosts }: Props) {
  return (
    <aside className="hidden lg:block w-72 flex-shrink-0 space-y-4">
      {/* サイト紹介 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 text-white font-bold text-sm" style={{ background: '#1a3c6e' }}>
          ⚽ サカボードへようこそ
        </div>
        <div className="p-4 text-sm text-gray-600 space-y-3">
          <p className="leading-relaxed">
            日本代表・Jリーグ・海外サッカーを語り合う、サッカーファンのための掲示板です。
          </p>
          <Link
            href="/posts/new"
            className="block text-center font-semibold text-white rounded-full py-2 transition-colors"
            style={{ background: '#16a34a' }}
          >
            + 投稿する
          </Link>
        </div>
      </div>

      {/* 人気の投稿 */}
      {popularPosts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 font-bold text-gray-700 text-sm">
            🔥 人気の投稿
          </div>
          <ul className="divide-y divide-gray-100">
            {popularPosts.map((post, index) => (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`} className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <span className="text-lg font-bold text-gray-300 flex-shrink-0">{index + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-800 leading-snug line-clamp-2">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-1">❤️ {post.likes}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* カテゴリー */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 font-bold text-gray-700 text-sm">
          📂 カテゴリー
        </div>
        <ul className="p-2">
          {CATEGORIES.filter((cat) => cat.value !== 'all').map((cat) => (
            <li key={cat.value}>
              <Link
                href={`/?category=${cat.value}`}
                className="block px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ルール */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 font-bold text-gray-700 text-sm">
          📜 みんなのルール
        </div>
        <ol className="p-4 text-xs text-gray-500 space-y-2 list-decimal list-inside leading-relaxed">
          <li>誹謗中傷・暴言はやめましょう</li>
          <li>相手の意見を尊重しましょう</li>
          <li>サッカーを楽しみましょう ⚽</li>
        </ol>
      </div>
    </aside>
  )
}
