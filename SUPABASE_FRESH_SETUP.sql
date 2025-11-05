-- ============================================
-- FRESH SETUP: Game Scores Table
-- Copy this ENTIRE file and run it in Supabase SQL Editor
-- ============================================

-- Step 1: Drop existing table (if exists)
DROP TABLE IF EXISTS game_scores CASCADE;

-- Step 2: Create game_scores table with all columns
CREATE TABLE game_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  player_name text not null,
  level_id integer not null check (level_id between 1 and 5),
  score integer not null check (score >= 0),
  percentage integer not null check (percentage >= 0 and percentage <= 100),
  correct_answers integer not null check (correct_answers >= 0),
  total_questions integer not null default 20,
  difficulty text not null check (difficulty in ('casual', 'challenge', 'blitz')),
  stars integer not null default 0 check (stars >= 0 and stars <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 3: Create indexes for better query performance
CREATE INDEX game_scores_user_id_idx on game_scores(user_id);
CREATE INDEX game_scores_level_id_idx on game_scores(level_id);
CREATE INDEX game_scores_score_idx on game_scores(score desc);
CREATE INDEX game_scores_created_at_idx on game_scores(created_at desc);
CREATE INDEX game_scores_level_score_idx on game_scores(level_id, score desc);

-- Step 4: Enable Row Level Security
ALTER TABLE game_scores ENABLE row level security;

-- Step 5: Create RLS Policies

-- Policy: Anyone can view all scores (for leaderboard)
CREATE POLICY "Anyone can view scores"
  ON game_scores FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert their own scores
CREATE POLICY "Authenticated users can insert scores"
  ON game_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Guest users can insert scores (no user_id)
CREATE POLICY "Anyone can insert guest scores"
  ON game_scores FOR INSERT
  WITH CHECK (user_id is null);

-- Policy: Users can delete their own scores
CREATE POLICY "Users can delete own scores"
  ON game_scores FOR DELETE
  USING (auth.uid() = user_id);

-- Step 6: Create leaderboard view (optional)
CREATE OR REPLACE VIEW leaderboard_by_level AS
SELECT 
  level_id,
  player_name,
  score,
  percentage,
  stars,
  difficulty,
  created_at,
  row_number() over (partition by level_id order by score desc, percentage desc) as rank
FROM game_scores
ORDER BY level_id, rank;

-- Grant access to the view
GRANT SELECT ON leaderboard_by_level TO anon, authenticated;

-- ============================================
-- SETUP COMPLETE! ✅
-- You should now see:
-- - game_scores table in Table Editor
-- - All 11 columns including 'stars'
-- - RLS policies enabled
-- ============================================
