// アップロード前に画像を圧縮・リサイズするユーティリティ
//
// 目的：Supabase無料プランの転送量（egress）と保存容量を節約するため、
// ブラウザ上で画像を縮小し、軽量なWebP形式に変換してからアップロードする。
// 元が5MBの写真でも、長辺1280px・WebP化でおおむね数百KB以下になる。

// リサイズ後の長辺の最大ピクセル数（掲示板の表示には十分な大きさ）
const MAX_DIMENSION = 1280
// WebPの画質（0〜1）。0.8前後が容量と見た目のバランスが良い
const WEBP_QUALITY = 0.8

// 圧縮結果を表す型
export type CompressedImage = {
  file: File // アップロードするファイル（WebP）
  width: number
  height: number
}

// File を受け取り、リサイズ＋WebP変換した File を返す。
// 変換できない環境やエラー時は、元のファイルをそのまま返す（フォールバック）。
export async function compressImage(file: File): Promise<CompressedImage> {
  // ブラウザ以外（万一サーバーで呼ばれた場合）はそのまま返す
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { file, width: 0, height: 0 }
  }

  try {
    const bitmap = await loadBitmap(file)

    // 長辺がMAX_DIMENSIONを超える場合だけ縮小する（拡大はしない）
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return { file, width: bitmap.width, height: bitmap.height }
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await canvasToBlob(canvas, 'image/webp', WEBP_QUALITY)
    // WebP非対応などでblobが取れない、または圧縮で逆に大きくなった場合は元を使う
    if (!blob || blob.size >= file.size) {
      return { file, width: bitmap.width, height: bitmap.height }
    }

    const compressed = new File([blob], renameToWebp(file.name), {
      type: 'image/webp',
    })
    return { file: compressed, width, height }
  } catch {
    // 何かあっても投稿自体は止めない。元のファイルでアップロードを続行する
    return { file, width: 0, height: 0 }
  }
}

// File から描画可能なビットマップを読み込む。
// createImageBitmap が使えればそれを、なければ <img> 経由で読み込む。
async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    return await createImageBitmap(file)
  }
  const url = URL.createObjectURL(file)
  try {
    const img = document.createElement('img')
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
      img.src = url
    })
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

// canvas.toBlob を Promise で扱えるようにする
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

// 拡張子を .webp に置き換える（拡張子がなければ付け足す）
function renameToWebp(name: string): string {
  const base = name.replace(/\.[^./\\]+$/, '')
  return `${base || 'image'}.webp`
}
