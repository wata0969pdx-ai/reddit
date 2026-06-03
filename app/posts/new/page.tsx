import Link from 'next/link'
import PostForm from '@/components/PostForm'

export default function NewPostPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* パンくずリスト */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">›</span>
        <span>投稿する</span>
      </nav>

      {/* フォームカード */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">新しい投稿を作成</h1>
        <PostForm />
      </div>
    </div>
  )
}
