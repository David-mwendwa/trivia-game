-- ============================================
-- Level Progress Sync Table
-- Copy and run this in Supabase SQL Editor
-- ============================================

-- Drop existing table if you want to start fresh
DROP TABLE IF EXISTS user_level_progress CASCADE;

-- Create user_level_progress table
CREATE TABLE user_level_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  level_id integer not null check (level_id between 1 and 5),
  unlocked boolean default true not null,
  completed boolean default false not null,
  attempts integer default 0 check (attempts >= 0),
  best_score integer default 0 check (best_score >= 0),
  best_accuracy integer default 0 check (best_accuracy >= 0 and best_accuracy <= 100),
  stars integer default 0 check (stars >= 0 and stars <= 5),
  last_played_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(user_id, level_id)
);

-- Create indexes for faster queries
CREATE INDEX user_level_progress_user_id_idx ON user_level_progress(user_id);
CREATE INDEX user_level_progress_level_id_idx ON user_level_progress(level_id);
CREATE INDEX user_level_progress_updated_at_idx ON user_level_progress(updated_at desc);

-- Enable Row Level Security
ALTER TABLE user_level_progress ENABLE row level security;

-- RLS Policies

-- Users can read their own progress
CREATE POLICY "Users can view own progress"
  ON user_level_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON user_level_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON user_level_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete own progress"
  ON user_level_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_level_progress_updated_at
    BEFORE UPDATE ON user_level_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================
