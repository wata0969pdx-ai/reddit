-- ==================================
-- 機能追加：コメントへの画像添付機能
-- Supabaseの「SQL Editor」に貼り付けて実行してください
-- ==================================

-- commentsテーブルに「画像のURL」を保存する列を追加
-- 画像の保存場所(post-images)は投稿の画像機能で作成済みのものをそのまま使う
ALTER TABLE comments ADD COLUMN IF NOT EXISTS image_url TEXT;
