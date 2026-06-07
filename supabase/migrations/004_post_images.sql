-- ==================================
-- 機能追加：画像投稿機能
-- Supabaseの「SQL Editor」に貼り付けて実行してください
-- ==================================

-- 1. postsテーブルに「画像のURL」を保存する列を追加
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. 画像を保存する場所（バケット）を作成し、誰でも見られるようにする
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. 誰でも画像を見られる・アップロードできるようにするポリシー
CREATE POLICY "誰でも投稿画像を見れる"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

CREATE POLICY "誰でも投稿画像をアップロードできる"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'post-images');
