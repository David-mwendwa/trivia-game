# Supabase Scores Setup Guide

## 🎯 Overview

Your trivia game now stores scores in Supabase for:
- ✅ Persistent storage across devices
- ✅ Global leaderboards
- ✅ User-specific score tracking
- ✅ Cross-device sync for authenticated users
- ✅ Automatic fallback to localStorage

---

## 📋 Setup Steps

### 1. Create the Database Table

1. **Go to your Supabase project** at [supabase.com](https://supabase.com)
2. Navigate to **SQL Editor** (left sidebar)
3. **Copy and paste** the contents of `SUPABASE_SETUP.sql`
4. Click **Run** to execute the SQL

This will create:
- ✅ `game_scores` table
- ✅ Indexes for fast queries
- ✅ Row Level Security (RLS) policies
- ✅ Optional leaderboard view

---

### 2. Verify Setup

After running the SQL, verify the table was created:

1. Go to **Table Editor** (left sidebar)
2. You should see `game_scores` table
3. Click on it to see the columns

**Expected columns:**
- `id` (uuid)
- `user_id` (uuid, nullable)
- `player_name` (text)
- `level_id` (integer, 1-5)
- `score` (integer)
- `percentage` (integer, 0-100)
- `correct_answers` (integer)
- `total_questions` (integer)
- `difficulty` (text)
- `stars` (integer, 0-5)
- `created_at` (timestamp)

---

### 3. Test the Integration

1. **Play a game** and complete a level
2. **Check Supabase**:
   - Go to **Table Editor** → `game_scores`
   - You should see your score record
3. **Check High Scores** on the start screen
   - Scores should load from Supabase
   - Fallback to localStorage if Supabase fails

---

## 🔒 Security Features

### Row Level Security (RLS) Policies:

1. **Read**: Anyone can view all scores (for leaderboards)
2. **Insert**: 
   - Authenticated users can insert their own scores
   - Guest users can insert scores (user_id = null)
3. **Delete**: Users can only delete their own scores

---

## 📊 Available Features

### Current Implementation:

✅ **Save scores to Supabase** (`saveScore`)
- Automatically saves after each game
- Includes stars calculation
- Falls back to localStorage on error

✅ **Load all scores** (`getAllScores`)
- High scores component uses this
- Fetches up to 100 recent scores
- Groups by level in accordion

✅ **Get level-specific scores** (`getLevelScores`)
- Top 10 scores per level
- Sorted by score, then percentage

✅ **User personal bests** (`getUserBestScores`)
- Best score per level for authenticated users

✅ **Global leaderboard** (`getGlobalLeaderboard`)
- Top 20 scores across all levels
- Cross-level comparison

---

## 🔄 Data Flow

```
Player completes game
       ↓
ResultsScreen saves score
       ↓
scoresManager.saveScore()
       ↓
Supabase database ✅
       ↓
localStorage (backup) ✅
       ↓
HighScores component loads scores
       ↓
Display in level accordion
```

---

## 🛠️ Utilities Reference

### `scoresManager.js` Functions:

#### **saveScore(scoreData)**
```javascript
await saveScore({
  playerName: 'John',
  levelId: 1,
  score: 2450,
  percentage: 95,
  correctAnswers: 19,
  totalQuestions: 20,
  difficulty: 'casual'
})
```

#### **getLevelScores(levelId, limit)**
```javascript
const { success, data } = await getLevelScores(1, 10)
// Returns top 10 scores for level 1
```

#### **getAllScores(limit)**
```javascript
const { success, data } = await getAllScores(50)
// Returns up to 50 recent scores
```

#### **getUserBestScores(userId)**
```javascript
const { success, data } = await getUserBestScores(currentUser.id)
// Returns best score per level for user
```

#### **getGlobalLeaderboard(limit)**
```javascript
const { success, data } = await getGlobalLeaderboard(20)
// Returns top 20 scores globally
```

---

## 🐛 Troubleshooting

### Scores not saving?

1. **Check browser console** for errors
2. **Verify Supabase connection** in Network tab
3. **Check RLS policies** are enabled
4. **Verify .env.local** has correct credentials

### Scores not loading?

1. **Check if table exists** in Supabase
2. **Verify data exists** in Table Editor
3. **Check browser console** for fetch errors
4. **Fallback to localStorage** should work automatically

### localStorage still being used?

This is **intentional**! localStorage serves as:
- ✅ Backup if Supabase is down
- ✅ Offline support
- ✅ Faster initial load (cache)

---

## 🚀 Future Enhancements

### Potential additions:

- **Global leaderboard page**
- **Player profiles with stats**
- **Weekly/monthly competitions**
- **Achievement system**
- **Score history timeline**
- **Compare with friends**
- **Export scores to CSV**

---

## 📝 Database Schema

```sql
game_scores
├── id (uuid, PK)
├── user_id (uuid, FK → auth.users, nullable)
├── player_name (text)
├── level_id (integer, 1-5)
├── score (integer, ≥ 0)
├── percentage (integer, 0-100)
├── correct_answers (integer, ≥ 0)
├── total_questions (integer, default: 20)
├── difficulty (text, enum)
├── stars (integer, 0-5)
└── created_at (timestamp)
```

---

## ✅ Checklist

- [ ] Run `SUPABASE_SETUP.sql` in Supabase SQL Editor
- [ ] Verify `game_scores` table exists
- [ ] Play a game and complete a level
- [ ] Check Supabase Table Editor for score record
- [ ] Verify High Scores displays Supabase data
- [ ] Test with authenticated user
- [ ] Test with guest user
- [ ] Verify localStorage fallback works (disable network)

---

## 🎉 You're All Set!

Your trivia game now has:
- ✅ Cloud-based score storage
- ✅ Global leaderboards
- ✅ User score tracking
- ✅ Automatic fallback system
- ✅ Secure data access

Happy coding! 🚀🇰🇪
