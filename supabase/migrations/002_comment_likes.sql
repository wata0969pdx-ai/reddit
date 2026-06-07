-- ==================================
-- 機能追加：コメントの「いいね」機能
-- Supabaseの「SQL Editor」に貼り付けて実行してください
-- ==================================

-- 1. commentsテーブルに「いいね数」を保存する列を追加
ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- 2. コメントのいいねを安全に増やすための関数
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS void AS $$
  UPDATE comments SET likes = likes + 1 WHERE id = comment_id;
$$ LANGUAGE sql SECURITY DEFINER;
