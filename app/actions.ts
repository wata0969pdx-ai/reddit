'use server'

import { updateTag } from 'next/cache'

// 投稿一覧・人気投稿のキャッシュ（tag: 'posts'）を即座に無効化する。
// 新規投稿やコメントの直後にクライアントから呼び出すことで、
// 30秒の再検証を待たずにホーム画面へ即時反映させる。
//
// updateTag は read-your-own-writes 用のAPIで、次のリクエストは
// 古いキャッシュを返さず新しいデータを取得し終えるまで待つ（＝即時反映）。
// Server Action からのみ呼び出せる。
export async function revalidatePosts() {
  updateTag('posts')
}
