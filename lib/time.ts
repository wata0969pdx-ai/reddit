// 「3分前」「2時間前」のような相対時間の文字列を作る
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)

  if (diffSec < 60) return 'たった今'

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}分前`

  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}時間前`

  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay}日前`

  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 5) return `${diffWeek}週間前`

  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth}ヶ月前`

  const diffYear = Math.floor(diffDay / 365)
  return `${diffYear}年前`
}
