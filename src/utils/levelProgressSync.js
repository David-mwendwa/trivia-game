import { supabase } from '../lib/supabase'

/**
 * Load user's level progress from Supabase
 */
export const loadProgressFromCloud = async (userId) => {
  try {
    if (!userId) {
      console.log('No user ID, skipping cloud sync')
      return { success: false, data: null }
    }

    console.log('🔄 Loading level progress from Supabase...')

    const { data, error } = await supabase
      .from('user_level_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('❌ Error loading progress from Supabase:', error)
      return { success: false, error }
    }

    console.log('✅ Progress loaded from Supabase:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Exception loading progress:', error)
    return { success: false, error }
  }
}

/**
 * Save level progress to Supabase
 */
export const saveProgressToCloud = async (userId, levelId, progressData) => {
  try {
    if (!userId) {
      console.log('No user ID, skipping cloud save')
      return { success: false }
    }

    console.log('🔄 Saving level progress to Supabase...', { levelId, progressData })

    const record = {
      user_id: userId,
      level_id: levelId,
      unlocked: progressData.unlocked,
      completed: progressData.completed,
      attempts: progressData.attempts || 0,
      best_score: progressData.bestScore || 0,
      best_accuracy: progressData.bestAccuracy || 0,
      stars: progressData.stars || 0,
      last_played_at: progressData.lastPlayedAt || new Date().toISOString()
    }

    // Use upsert to insert or update
    const { data, error } = await supabase
      .from('user_level_progress')
      .upsert([record], { 
        onConflict: 'user_id,level_id',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      console.error('❌ Error saving progress to Supabase:', error)
      return { success: false, error }
    }

    console.log('✅ Progress saved to Supabase:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Exception saving progress:', error)
    return { success: false, error }
  }
}

/**
 * Sync all level progress to cloud
 */
export const syncAllProgressToCloud = async (userId, localProgress) => {
  try {
    if (!userId) {
      return { success: false }
    }

    console.log('🔄 Syncing all progress to Supabase...')

    const promises = Object.entries(localProgress).map(([levelId, progress]) => {
      return saveProgressToCloud(userId, parseInt(levelId), progress)
    })

    const results = await Promise.all(promises)
    const allSuccess = results.every(r => r.success)

    if (allSuccess) {
      console.log('✅ All progress synced to Supabase')
    } else {
      console.warn('⚠️ Some progress failed to sync')
    }

    return { success: allSuccess, results }
  } catch (error) {
    console.error('❌ Exception syncing all progress:', error)
    return { success: false, error }
  }
}

/**
 * Merge local and cloud progress (take the best of both)
 */
export const mergeProgress = (localProgress, cloudProgress) => {
  console.log('🔄 Merging local and cloud progress...')

  const merged = { ...localProgress }

  cloudProgress.forEach(cloudLevel => {
    const levelId = cloudLevel.level_id
    const local = localProgress[levelId] || {}

    // Convert cloud format to local format
    merged[levelId] = {
      unlocked: cloudLevel.unlocked || local.unlocked || false,
      completed: cloudLevel.completed || local.completed || false,
      attempts: Math.max(cloudLevel.attempts || 0, local.attempts || 0),
      bestScore: Math.max(cloudLevel.best_score || 0, local.bestScore || 0),
      bestAccuracy: Math.max(cloudLevel.best_accuracy || 0, local.bestAccuracy || 0),
      stars: Math.max(cloudLevel.stars || 0, local.stars || 0),
      lastPlayedAt: getMostRecent(cloudLevel.last_played_at, local.lastPlayedAt)
    }
  })

  console.log('✅ Progress merged:', merged)
  return merged
}

/**
 * Initialize cloud progress for new user (Level 1 unlocked)
 */
export const initializeCloudProgress = async (userId) => {
  try {
    if (!userId) {
      return { success: false }
    }

    console.log('🔄 Initializing cloud progress for new user...')

    // Check if user already has progress
    const { data: existing } = await supabase
      .from('user_level_progress')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    if (existing && existing.length > 0) {
      console.log('ℹ️ User already has progress, skipping initialization')
      return { success: true, data: existing }
    }

    // Create initial progress (Level 1 unlocked)
    const initialProgress = {
      user_id: userId,
      level_id: 1,
      unlocked: true,
      completed: false,
      attempts: 0,
      best_score: 0,
      best_accuracy: 0,
      stars: 0
    }

    const { data, error } = await supabase
      .from('user_level_progress')
      .insert([initialProgress])
      .select()

    if (error) {
      console.error('❌ Error initializing progress:', error)
      return { success: false, error }
    }

    console.log('✅ Cloud progress initialized:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Exception initializing progress:', error)
    return { success: false, error }
  }
}

/**
 * Full sync: Load from cloud, merge with local, save back to cloud
 */
export const performFullSync = async (userId) => {
  try {
    if (!userId) {
      console.log('No user ID, skipping full sync')
      return { success: false }
    }

    console.log('🔄 Starting full progress sync...')

    // 1. Load local progress
    const localProgress = JSON.parse(
      localStorage.getItem('triviaLevelProgress') || '{}'
    )

    // 2. Load cloud progress
    const { success: loadSuccess, data: cloudData } = await loadProgressFromCloud(userId)

    if (!loadSuccess || !cloudData || cloudData.length === 0) {
      // No cloud data - upload local progress
      console.log('📤 No cloud data found, uploading local progress...')
      if (Object.keys(localProgress).length > 0) {
        await syncAllProgressToCloud(userId, localProgress)
      } else {
        // No local or cloud data - initialize
        await initializeCloudProgress(userId)
      }
      return { success: true, merged: localProgress }
    }

    // 3. Merge local and cloud
    const merged = mergeProgress(localProgress, cloudData)

    // 4. Save merged progress locally
    localStorage.setItem('triviaLevelProgress', JSON.stringify(merged))

    // 5. Sync merged progress back to cloud
    await syncAllProgressToCloud(userId, merged)

    console.log('✅ Full sync complete!')
    return { success: true, merged }
  } catch (error) {
    console.error('❌ Exception during full sync:', error)
    return { success: false, error }
  }
}

/**
 * Helper: Get most recent date
 */
const getMostRecent = (date1, date2) => {
  if (!date1) return date2
  if (!date2) return date1
  return new Date(date1) > new Date(date2) ? date1 : date2
}

/**
 * Delete all user progress from cloud
 */
export const deleteCloudProgress = async (userId) => {
  try {
    if (!userId) {
      return { success: false }
    }

    console.log('🗑️ Deleting cloud progress...')

    const { error } = await supabase
      .from('user_level_progress')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('❌ Error deleting progress:', error)
      return { success: false, error }
    }

    console.log('✅ Cloud progress deleted')
    return { success: true }
  } catch (error) {
    console.error('❌ Exception deleting progress:', error)
    return { success: false, error }
  }
}
