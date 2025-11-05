# Cross-Device Level Progress Sync - Setup Guide

## 🎯 Overview

Your trivia game now supports **cross-device level progress synchronization**! 

### **What's Synced:**
✅ **Level unlocks** - Unlocked levels available on all devices  
✅ **Stars earned** - Star ratings per level synced  
✅ **Best scores** - Highest scores per level tracked  
✅ **Best accuracy** - Top accuracy percentages saved  
✅ **Completion status** - Completed levels marked  
✅ **Attempts count** - Total attempts per level  
✅ **Last played date** - Timestamp of last play  

### **How It Works:**
1. **Login** → Syncs cloud data with local progress
2. **Play game** → Saves to both local storage + Supabase
3. **Switch device** → Login to see your progress continue!

---

## 📋 Setup Steps

### **Step 1: Run the SQL Setup**

1. **Open Supabase Dashboard** → [supabase.com](https://supabase.com)
2. **Navigate to SQL Editor**
3. **Copy/paste** the entire `SUPABASE_LEVEL_PROGRESS.sql` file
4. **Click Run**

This creates:
- ✅ `user_level_progress` table
- ✅ Indexes for fast queries
- ✅ Row Level Security policies
- ✅ Auto-update trigger for `updated_at`

---

### **Step 2: Verify Table Creation**

1. **Go to Table Editor** (left sidebar)
2. **Find `user_level_progress` table**
3. **Check columns:**
   ```
   ├── id (uuid)
   ├── user_id (uuid, references auth.users)
   ├── level_id (integer, 1-5)
   ├── unlocked (boolean)
   ├── completed (boolean)
   ├── attempts (integer)
   ├── best_score (integer)
   ├── best_accuracy (integer, 0-100)
   ├── stars (integer, 0-5)
   ├── last_played_at (timestamp)
   ├── created_at (timestamp)
   └── updated_at (timestamp)
   ```

---

### **Step 3: Test the Sync**

#### **Test Scenario:**

1. **Device A (e.g., laptop):**
   - Login with your account
   - Play Level 1, earn 3 stars
   - Complete Level 1, unlock Level 2

2. **Device B (e.g., phone):**
   - Login with the same account
   - Check Level Select screen
   - **You should see:**
     - ✅ Level 1 completed with 3 stars
     - ✅ Level 2 unlocked
     - ✅ Same best scores

3. **Play on Device B:**
   - Complete Level 2
   - Earn 4 stars

4. **Back to Device A:**
   - Refresh or re-login
   - **You should see:**
     - ✅ Level 2 completed with 4 stars
     - ✅ Level 3 unlocked

---

## 🔄 How Sync Works

### **On Login:**
```javascript
performFullSync(userId)
├── Load local progress from localStorage
├── Load cloud progress from Supabase
├── Merge (take best of both)
├── Save merged to localStorage
└── Upload merged to Supabase
```

### **After Each Game:**
```javascript
updateLevelProgress(levelId, score, accuracy, userId)
├── Update local progress
├── Save to localStorage
└── Upload to Supabase (if logged in)
```

---

## 🔐 Security

### **Row Level Security Policies:**

1. **SELECT** - Users can only view their own progress
2. **INSERT** - Users can only create their own progress
3. **UPDATE** - Users can only update their own progress
4. **DELETE** - Users can only delete their own progress

**Guest users** (not logged in):
- ❌ No cloud sync
- ✅ Still use localStorage locally
- ✅ Can convert to synced on login

---

## 📊 Database Schema

```sql
user_level_progress
├── id (PK)
├── user_id (FK → auth.users, NOT NULL)
├── level_id (1-5, NOT NULL)
├── unlocked (default: true)
├── completed (default: false)
├── attempts (default: 0)
├── best_score (default: 0)
├── best_accuracy (0-100, default: 0)
├── stars (0-5, default: 0)
├── last_played_at (nullable)
├── created_at (auto)
└── updated_at (auto-updated on change)

UNIQUE CONSTRAINT: (user_id, level_id)
```

---

## 🚀 Features

### **Smart Merging:**
When syncing, the system takes the **best** of local and cloud:
- ✅ **Max attempts** (more experience)
- ✅ **Max best_score** (highest achievement)
- ✅ **Max best_accuracy** (best performance)
- ✅ **Max stars** (top rating)
- ✅ **Most recent last_played_at**

### **Automatic Initialization:**
- New users automatically get Level 1 unlocked in the cloud
- No manual setup required

### **Fallback Support:**
- If Supabase is down, uses localStorage
- Syncs back to cloud when connection restored

---

## 🛠️ Utility Functions

### **Available in `levelProgressSync.js`:**

#### **performFullSync(userId)**
```javascript
// Complete sync: load, merge, save
await performFullSync(userId)
```

#### **saveProgressToCloud(userId, levelId, progressData)**
```javascript
// Save single level progress
await saveProgressToCloud(userId, 1, {
  unlocked: true,
  completed: true,
  attempts: 3,
  bestScore: 2450,
  bestAccuracy: 95,
  stars: 5,
  lastPlayedAt: new Date().toISOString()
})
```

#### **loadProgressFromCloud(userId)**
```javascript
// Load all progress from cloud
const { success, data } = await loadProgressFromCloud(userId)
```

#### **syncAllProgressToCloud(userId, localProgress)**
```javascript
// Upload all local progress to cloud
await syncAllProgressToCloud(userId, progressObject)
```

#### **deleteCloudProgress(userId)**
```javascript
// Delete all user progress (for reset)
await deleteCloudProgress(userId)
```

---

## 📝 Implementation Details

### **Files Modified:**

1. **`src/utils/levelProgressSync.js`** ✨ NEW
   - Complete sync system
   - Smart merging logic
   - Cloud operations

2. **`src/utils/levelSystem.js`**
   - Made `updateLevelProgress` async
   - Added `userId` parameter
   - Calls `saveProgressToCloud`

3. **`src/components/ResultsScreen.jsx`**
   - Now awaits `updateLevelProgress`
   - Passes `userId` for cloud sync

4. **`src/App.jsx`**
   - Calls `performFullSync` on app load
   - Calls `performFullSync` on user login

---

## 🐛 Troubleshooting

### **Progress not syncing?**

1. **Check browser console** for sync messages:
   ```
   🔄 Syncing level progress on login...
   ✅ Progress loaded from Supabase
   ✅ Progress merged
   ✅ Full sync complete!
   ```

2. **Verify table exists** in Supabase
3. **Check user is logged in** (`currentUser` not null)
4. **Verify RLS policies** are enabled

### **Data not matching across devices?**

1. **Force re-login** on both devices
2. **Check Supabase Table Editor** for latest data
3. **Clear localStorage** and re-login to force cloud sync:
   ```javascript
   localStorage.removeItem('triviaLevelProgress')
   ```

### **Guest users not syncing?**

This is **expected**! Guest users don't have cloud sync.
- ✅ Progress saved to localStorage only
- ✅ Works on same browser/device
- ❌ Not synced across devices
- 💡 **Solution:** Create account to enable sync!

---

## ✅ Testing Checklist

- [ ] Run `SUPABASE_LEVEL_PROGRESS.sql` in Supabase
- [ ] Verify `user_level_progress` table exists
- [ ] Login on Device A
- [ ] Complete a level on Device A
- [ ] Check Supabase Table Editor - see progress record
- [ ] Login on Device B (same account)
- [ ] Verify progress loaded on Device B
- [ ] Complete another level on Device B
- [ ] Go back to Device A, refresh
- [ ] Verify new progress appears on Device A

---

## 🎉 Benefits

### **For Players:**
✅ Continue progress anywhere  
✅ Never lose progress  
✅ Play on multiple devices  
✅ Consistent experience  

### **For You (Developer):**
✅ User retention improved  
✅ Better analytics (see cloud data)  
✅ Competitive features possible  
✅ Professional app experience  

---

## 🔮 Future Enhancements

Potential additions:
- **Conflict resolution UI** (if simultaneous play on 2 devices)
- **Progress history** (see improvement over time)
- **Backup/restore** feature
- **Export progress** to JSON
- **Social features** (compare with friends)
- **Achievements** based on cloud progress

---

## 📞 Support

If sync is not working:
1. Check browser console for errors
2. Verify Supabase connection
3. Check RLS policies
4. Ensure user is authenticated
5. Force re-login to trigger sync

**Console Logs to Look For:**
- ✅ `🔄 Syncing level progress...`
- ✅ `✅ Progress saved to Supabase`
- ✅ `✅ Full sync complete!`
- ❌ `❌ Error saving progress:` (check error details)

---

## 🎯 Summary

Your trivia game now has **enterprise-level cross-device sync**!

- ✅ **3 SQL files ready** for Supabase setup
- ✅ **Complete sync system** implemented
- ✅ **Smart merging** preserves best progress
- ✅ **Automatic sync** on login and after games
- ✅ **Secure** with Row Level Security
- ✅ **Fallback** to localStorage always works

**Just run the SQL and test!** 🚀🇰🇪
