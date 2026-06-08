import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'サカボード - サッカーファンのコミュニティ',
  description: '日本代表・Jリーグ・海外サッカーについて自由に投稿・コメントできるサッカーファンのコミュニティサイト',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen" style={{ background: '#f0f4f8' }}>
        {/* ヘッダー */}
        <header style={{ background: '#1a3c6e' }} className="text-white shadow-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* ロゴ */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              <span className="text-xl font-bold tracking-tight">サカボード</span>
            </Link>

            {/* 投稿ボタン */}
            <Link
              href="/posts/new"
              className="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              style={{ background: '#16a34a', color: 'white' }}
            >
              + 投稿する
            </Link>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>

        {/* フッター */}
        <footer className="text-center text-sm text-gray-400 py-8 mt-8">
          <p>© 2025 サカボード - サッカーファンのコミュニティ</p>
        </footer>
      </body>
    </html>
  )
}
