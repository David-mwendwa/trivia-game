# Supabase Integration Guide

## 🎯 Overview

Your trivia game now features a robust backend powered by Supabase, enabling:

### Core Features
- 🌍 Global leaderboards with real-time updates
- 🔒 Secure authentication (email/password & social logins)
- 📱 Cross-device synchronization
- ⚡ Real-time score updates
- 📊 Advanced analytics and statistics
- 🔄 Automatic localStorage fallback when offline

---

## 🚀 Quick Start

### 1. Database Setup

1. **Create a new project** at [app.supabase.com](https://app.supabase.com)
2. **Run the setup script**:
   - Go to **SQL Editor**
   - Create new query
   - Paste contents of `SUPABASE_SETUP.sql`
   - Click **Run**

### 2. Configure Authentication

1. **Enable Auth Providers** in Supabase:
   - Email/Password
   - Google (recommended)
   - GitHub (optional)
   - Twitter (optional)

2. **Configure Site URL** in Authentication settings:
   - Add your production domain
   - Add `http://localhost:3000` for development

---

## 🔍 Database Schema

### Main Tables

#### `game_scores`
- `id` (uuid) - Primary key
- `user_id` (uuid, nullable) - References auth.users
- `player_name` (text) - Display name
- `level_id` (integer) - Game level (1-5)
- `score` (integer) - Total points
- `percentage` (integer) - Accuracy (0-100)
- `correct_answers` (integer)
- `total_questions` (integer)
- `difficulty` (text) - 'easy', 'medium', 'hard'
- `stars` (integer, 0-5) - Performance rating
- `time_spent` (integer) - Seconds taken
- `device_info` (jsonb) - Browser/device details
- `created_at` (timestamptz) - Auto-generated

### Views

#### `leaderboard`
- Top scores with player info
- Filterable by time period
- Sortable by score/time

## 🔒 Security Rules

Row Level Security (RLS) is enabled with these policies:

1. **Public Read**
   - Anyone can view leaderboard
   - Sensitive user data is protected

2. **User Write**
   - Users can only modify their own scores
   - Score validation rules in place

3. **Admin Access**
   - Full access for administrators
   - Audit logging enabled

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
