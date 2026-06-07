-- ==================================
-- 機能追加：コメントへの返信機能
-- Supabaseの「SQL Editor」に貼り付けて実行してください
-- ==================================

-- commentsテーブルに「どのコメントへの返信か」を記録する列を追加
ALTER TABLE comments ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES comments(id) ON DELETE SET NULL;
