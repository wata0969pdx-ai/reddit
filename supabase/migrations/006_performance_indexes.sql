-- ==================================
-- パフォーマンス改善：インデックス追加
-- Supabaseの「SQL Editor」に貼り付けて実行してください
--
-- 投稿・コメントが増えても一覧表示や検索が遅くならないように、
-- よく使う絞り込み・並べ替え・検索に対応するインデックスを追加します。
-- データ量が少ないうちは効果は見えませんが、増えてからでは遅いので先に入れておきます。
-- ==================================

-- 1. 新着順の一覧表示用（デフォルトの並べ替え）
CREATE INDEX IF NOT EXISTS idx_posts_created_at
  ON posts (created_at DESC);

-- 2. カテゴリーで絞り込み＋新着順に並べる用
CREATE INDEX IF NOT EXISTS idx_posts_category_created_at
  ON posts (category, created_at DESC);

-- 3. 人気順（いいね数）の並べ替え・サイドバーの人気投稿用
CREATE INDEX IF NOT EXISTS idx_posts_likes
  ON posts (likes DESC, created_at DESC);

-- 4. 投稿に紐づくコメントの取得・件数カウント用
CREATE INDEX IF NOT EXISTS idx_comments_post_id
  ON comments (post_id, created_at);

-- 5. 返信先コメントの参照用
CREATE INDEX IF NOT EXISTS idx_comments_reply_to_id
  ON comments (reply_to_id);

-- 6. タイトル・本文のキーワード検索（ilike '%語%'）を高速化する
--    pg_trgm 拡張のGINインデックスで、部分一致検索の全行スキャンを避ける
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_posts_title_trgm
  ON posts USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_posts_body_trgm
  ON posts USING gin (body gin_trgm_ops);
