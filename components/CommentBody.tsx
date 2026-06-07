'use client'

// コメント本文の中の「>>2」「＞＞2」のような記号を
// クリックできるリンクに変換して表示するコンポーネント

type Props = {
  text: string
}

// >>数字 または ＞＞数字 にマッチする正規表現（半角・全角どちらにも対応）
const ANCHOR_PATTERN = /(>{2}|＞{2})(\d+)/g

export default function CommentBody({ text }: Props) {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  ANCHOR_PATTERN.lastIndex = 0
  while ((match = ANCHOR_PATTERN.exec(text)) !== null) {
    const [fullMatch, , numberText] = match
    const matchStart = match.index

    // リンクの前にある普通のテキストを追加
    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart))
    }

    // リンク部分を追加（クリックで該当コメントへジャンプ）
    parts.push(
      <a
        key={`${matchStart}-${numberText}`}
        href={`#comment-${numberText}`}
        className="font-semibold underline"
        style={{ color: '#1a3c6e' }}
        onClick={(e) => {
          e.preventDefault()
          const target = document.getElementById(`comment-${numberText}`)
          if (!target) return

          target.scrollIntoView({ behavior: 'smooth', block: 'center' })

          // ジャンプ先を一瞬ハイライトして分かりやすくする
          target.classList.add('comment-highlight')
          setTimeout(() => target.classList.remove('comment-highlight'), 1500)
        }}
      >
        {fullMatch}
      </a>
    )

    lastIndex = matchStart + fullMatch.length
  }

  // 残りの普通のテキストを追加
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <p className="text-sm text-gray-700 whitespace-pre-wrap">{parts}</p>
}
