import { supabase } from '../lib/supabase'
import { calculateStars } from './levelSystem'

/**
 * Save a game score to Supabase
 */
export const saveScore = async (scoreData) => {
  try {
    console.log('🔄 Attempting to save score to Supabase...', scoreData)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.warn('⚠️ Auth check error (guest mode):', authError.message)
    }
    
    const stars = calculateStars(scoreData.percentage)
    
    const scoreRecord = {
      user_id: user?.id || null, // null for guest users
      player_name: scoreData.playerName,
      level_id: scoreData.levelId,
      score: scoreData.score,
      percentage: scoreData.percentage,
      correct_answers: scoreData.correctAnswers,
      total_questions: scoreData.totalQuestions,
      difficulty: scoreData.difficulty,
      stars: stars
    }

    console.log('📝 Score record to insert:', scoreRecord)

    const { data, error } = await supabase
      .from('game_scores')
      .insert([scoreRecord])
      .select()

    if (error) {
      console.error('❌ Supabase insert error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      // Fall back to localStorage
      saveToLocalStorage(scoreData)
      return { success: false, error }
    }

    console.log('✅ Score saved to Supabase successfully:', data)
    // Also save to localStorage as backup
    saveToLocalStorage(scoreData)
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('❌ Exception while saving score:', {
      message: error.message,
      stack: error.stack
    })
    // Fall back to localStorage
    saveToLocalStorage(scoreData)
    return { success: false, error }
  }
}

/**
 * Get high scores for a specific level
 */
export const getLevelScores = async (levelId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('level_id', levelId)
      .order('score', { ascending: false })
      .order('percentage', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching level scores:', error)
      return { success: false, error, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to fetch level scores:', error)
    return { success: false, error, data: [] }
  }
}

/**
 * Get all scores grouped by level
 */
export const getAllScores = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching all scores:', error)
      return { success: false, error, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to fetch all scores:', error)
    return { success: false, error, data: [] }
  }
}

/**
 * Get user's personal best scores
 */
export const getUserBestScores = async (userId) => {
  try {
    if (!userId) {
      return { success: false, data: [] }
    }

    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('user_id', userId)
      .order('score', { ascending: false })

    if (error) {
      console.error('Error fetching user scores:', error)
      return { success: false, error, data: [] }
    }

    // Get best score per level
    const bestByLevel = {}
    data.forEach(score => {
      if (!bestByLevel[score.level_id] || score.score > bestByLevel[score.level_id].score) {
        bestByLevel[score.level_id] = score
      }
    })

    return { success: true, data: Object.values(bestByLevel) }
  } catch (error) {
    console.error('Failed to fetch user scores:', error)
    return { success: false, error, data: [] }
  }
}

/**
 * Get global leaderboard (top scores across all levels)
 */
export const getGlobalLeaderboard = async (limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .order('score', { ascending: false })
      .order('percentage', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching global leaderboard:', error)
      return { success: false, error, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to fetch global leaderboard:', error)
    return { success: false, error, data: [] }
  }
}

/**
 * Delete all user's scores (for reset)
 */
export const deleteUserScores = async (userId) => {
  try {
    if (!userId) {
      return { success: false, error: 'No user ID provided' }
    }

    const { error } = await supabase
      .from('game_scores')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting user scores:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to delete user scores:', error)
    return { success: false, error }
  }
}

/**
 * Fallback: Save to localStorage
 */
const saveToLocalStorage = (scoreData) => {
  try {
    const highScores = JSON.parse(localStorage.getItem('triviaHighScores') || '[]')
    
    const newScore = {
      name: scoreData.playerName,
      score: scoreData.score,
      totalQuestions: scoreData.totalQuestions,
      correctAnswers: scoreData.correctAnswers,
      percentage: scoreData.percentage,
      difficulty: scoreData.difficulty,
      levelId: scoreData.levelId,
      date: new Date().toISOString()
    }
    
    highScores.push(newScore)
    
    // Sort and keep top 50
    highScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.percentage - a.percentage
    })
    
    const top50 = highScores.slice(0, 50)
    localStorage.setItem('triviaHighScores', JSON.stringify(top50))
    
    console.log('Score saved to localStorage as backup')
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

/**
 * Get scores from localStorage (fallback)
 */
export const getLocalScores = () => {
  try {
    return JSON.parse(localStorage.getItem('triviaHighScores') || '[]')
  } catch (error) {
    console.error('Failed to get local scores:', error)
    return []
  }
}
