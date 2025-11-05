-- Game Scores Table
-- Run this SQL in your Supabase SQL Editor

-- Create game_scores table
create table if not exists game_scores (
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

-- Create indexes for better query performance
create index if not exists game_scores_user_id_idx on game_scores(user_id);
create index if not exists game_scores_level_id_idx on game_scores(level_id);
create index if not exists game_scores_score_idx on game_scores(score desc);
create index if not exists game_scores_created_at_idx on game_scores(created_at desc);
create index if not exists game_scores_level_score_idx on game_scores(level_id, score desc);

-- Enable Row Level Security
alter table game_scores enable row level security;

-- Policy: Users can read all scores (for leaderboard)
create policy "Anyone can view scores"
  on game_scores for select
  using (true);

-- Policy: Authenticated users can insert their own scores
create policy "Authenticated users can insert scores"
  on game_scores for insert
  with check (auth.uid() = user_id);

-- Policy: Users can insert guest scores (no user_id)
create policy "Anyone can insert guest scores"
  on game_scores for insert
  with check (user_id is null);

-- Policy: Users can delete their own scores
create policy "Users can delete own scores"
  on game_scores for delete
  using (auth.uid() = user_id);

-- Optional: Create a view for leaderboard queries
create or replace view leaderboard_by_level as
select 
  level_id,
  player_name,
  score,
  percentage,
  stars,
  difficulty,
  created_at,
  row_number() over (partition by level_id order by score desc, percentage desc) as rank
from game_scores
order by level_id, rank;

-- Grant access to the view
grant select on leaderboard_by_level to anon, authenticated;
