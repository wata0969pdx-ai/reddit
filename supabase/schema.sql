-- ==================================
-- サカボード データベース設定
-- Supabaseの「SQL Editor」に貼り付けて実行してください
-- ==================================

-- 1. postsテーブル（投稿）
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. commentsテーブル（コメント）
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Row Level Security (RLS) を有効化
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 4. 全員が読み書きできるポリシーを設定（ログイン不要）
CREATE POLICY "誰でも投稿を読める" ON posts FOR SELECT USING (true);
CREATE POLICY "誰でも投稿できる" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "誰でもいいねできる" ON posts FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "誰でもコメントを読める" ON comments FOR SELECT USING (true);
CREATE POLICY "誰でもコメントできる" ON comments FOR INSERT WITH CHECK (true);

-- 5. いいねを安全に増やすための関数
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS void AS $$
  UPDATE posts SET likes = likes + 1 WHERE id = post_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- 6. テスト用のサンプルデータ（任意）
INSERT INTO posts (title, body, category) VALUES
  ('日本代表、W杯予選を突破！', '昨日の試合は素晴らしかった。久保選手の動きが光っていましたね。', 'japan'),
  ('川崎フロンターレ vs 浦和レッズ 試合感想', '3-1で川崎の勝利。やはり中盤の組み立てが違いますね。', 'jleague'),
  ('バルセロナが若手日本人選手を獲得か？', '複数のメディアが報道。移籍金は約20億円規模と言われています。', 'transfer');
