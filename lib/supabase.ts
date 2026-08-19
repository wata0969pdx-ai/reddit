import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Supabaseの新しい「Publishable key」と従来の「anon」キー、どちらの環境変数名でも動くようにする
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// サーバーコンポーネント・クライアントコンポーネント両方で使うSupabaseクライアントを作成
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey)
}
