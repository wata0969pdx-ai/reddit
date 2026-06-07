export type Post = {
  id: string
  title: string
  body: string
  category: string
  likes: number
  created_at: string
  comment_count?: number
}

export type Comment = {
  id: string
  post_id: string
  body: string
  likes: number
  created_at: string
}

export type Category = 'all' | 'japan' | 'jleague' | 'world' | 'transfer' | 'live' | 'chat'

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'japan', label: '日本代表' },
  { value: 'jleague', label: 'Jリーグ' },
  { value: 'world', label: '海外サッカー' },
  { value: 'transfer', label: '移籍情報' },
  { value: 'live', label: '試合実況' },
  { value: 'chat', label: '雑談' },
]

export const CATEGORY_LABELS: Record<string, string> = {
  japan: '日本代表',
  jleague: 'Jリーグ',
  world: '海外サッカー',
  transfer: '移籍情報',
  live: '試合実況',
  chat: '雑談',
}

export const CATEGORY_COLORS: Record<string, string> = {
  japan: 'bg-blue-100 text-blue-800',
  jleague: 'bg-red-100 text-red-800',
  world: 'bg-green-100 text-green-800',
  transfer: 'bg-yellow-100 text-yellow-800',
  live: 'bg-orange-100 text-orange-800',
  chat: 'bg-gray-100 text-gray-700',
}
