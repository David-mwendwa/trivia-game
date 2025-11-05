/**
 * Level System Utilities
 * Manages level progression, unlocking, and progress tracking
 */

import questionsData from '../data/questions.json'
import { saveProgressToCloud } from './levelProgressSync'

// Constants
export const QUESTIONS_PER_LEVEL = 20
export const MIN_PASS_PERCENTAGE = 60 // Minimum to unlock next level

/**
 * Generate all levels dynamically based on available questions
 */
export const generateLevels = () => {
  const totalQuestions = questionsData.length
  const totalLevels = Math.ceil(totalQuestions / QUESTIONS_PER_LEVEL)
  
  return Array.from({ length: totalLevels }, (_, index) => ({
    id: index + 1,
    name: `Level ${index + 1}`,
    description: `Questions ${index * QUESTIONS_PER_LEVEL + 1}-${Math.min((index + 1) * QUESTIONS_PER_LEVEL, totalQuestions)}`,
    startIndex: index * QUESTIONS_PER_LEVEL,
    endIndex: Math.min((index + 1) * QUESTIONS_PER_LEVEL, totalQuestions),
    questionCount: Math.min(QUESTIONS_PER_LEVEL, totalQuestions - (index * QUESTIONS_PER_LEVEL)),
    isLocked: index > 0, // First level always unlocked
    stars: 0,
    bestScore: 0,
    bestAccuracy: 0,
    attempts: 0,
    completed: false
  }))
}

/**
 * Get questions for a specific level
 */
export const getLevelQuestions = (levelId) => {
  const levels = generateLevels()
  const level = levels.find(l => l.id === levelId)
  
  if (!level) return []
  
  return questionsData.slice(level.startIndex, level.endIndex)
}

/**
 * Calculate stars based on accuracy (max 5 stars per level)
 * 95-100% = 5 stars (Perfect)
 * 85-94% = 4 stars (Excellent)
 * 75-84% = 3 stars (Good)
 * 65-74% = 2 stars (Above Average)
 * 60-64% = 1 star (Pass)
 * <60% = 0 stars (Failed)
 */
export const calculateStars = (accuracy) => {
  if (accuracy >= 95) return 5
  if (accuracy >= 85) return 4
  if (accuracy >= 75) return 3
  if (accuracy >= 65) return 2
  if (accuracy >= MIN_PASS_PERCENTAGE) return 1
  return 0
}

/**
 * Check if level is passed (60% or higher)
 */
export const isLevelPassed = (accuracy) => {
  return accuracy >= MIN_PASS_PERCENTAGE
}

/**
 * Get level progress from localStorage
 */
export const getLevelProgress = () => {
  try {
    const saved = localStorage.getItem('triviaLevelProgress')
    if (!saved) return null
    return JSON.parse(saved)
  } catch (error) {
    console.error('Error loading level progress:', error)
    return null
  }
}

/**
 * Save level progress to localStorage
 */
export const saveLevelProgress = (progress) => {
  try {
    localStorage.setItem('triviaLevelProgress', JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving level progress:', error)
  }
}

/**
 * Initialize level progress for a new user
 */
export const initializeLevelProgress = () => {
  const levels = generateLevels()
  const progress = {}
  
  levels.forEach(level => {
    progress[level.id] = {
      isUnlocked: level.id === 1, // Only first level unlocked
      stars: 0,
      bestScore: 0,
      bestAccuracy: 0,
      attempts: 0,
      completed: false,
      lastPlayedAt: null
    }
  })
  
  saveLevelProgress(progress)
  return progress
}

/**
 * Get or initialize level progress
 */
export const getOrInitProgress = () => {
  let progress = getLevelProgress()
  if (!progress) {
    progress = initializeLevelProgress()
  }
  return progress
}

/**
 * Update progress after completing a level
 */
export const updateLevelProgress = async (levelId, score, accuracy, correctAnswers, totalQuestions, userId = null) => {
  const progress = getOrInitProgress()
  const levels = generateLevels()
  
  if (!progress[levelId]) {
    progress[levelId] = {
      isUnlocked: true,
      stars: 0,
      bestScore: 0,
      bestAccuracy: 0,
      attempts: 0,
      completed: false,
      lastPlayedAt: null
    }
  }
  
  const levelProgress = progress[levelId]
  const stars = calculateStars(accuracy)
  const passed = isLevelPassed(accuracy)
  
  // Update level stats
  levelProgress.attempts += 1
  levelProgress.lastPlayedAt = new Date().toISOString()
  
  // Update best scores if improved
  if (score > levelProgress.bestScore) {
    levelProgress.bestScore = score
  }
  
  if (accuracy > levelProgress.bestAccuracy) {
    levelProgress.bestAccuracy = accuracy
  }
  
  if (stars > levelProgress.stars) {
    levelProgress.stars = stars
  }
  
  if (passed) {
    levelProgress.completed = true
    
    // Unlock next level if exists
    const nextLevelId = levelId + 1
    if (nextLevelId <= levels.length && progress[nextLevelId]) {
      progress[nextLevelId].isUnlocked = true
    }
  }
  
  // Save locally
  saveLevelProgress(progress)
  
  // Sync to cloud if user is logged in
  if (userId) {
    await saveProgressToCloud(userId, levelId, levelProgress)
  }
  
  return { progress, passed, stars }
}

/**
 * Get levels with progress data merged
 */
export const getLevelsWithProgress = () => {
  const levels = generateLevels()
  const progress = getOrInitProgress()
  
  return levels.map(level => ({
    ...level,
    ...progress[level.id],
    isLocked: !progress[level.id]?.isUnlocked
  }))
}

/**
 * Reset all progress (for testing or user request)
 */
export const resetAllProgress = () => {
  localStorage.removeItem('triviaLevelProgress')
  return initializeLevelProgress()
}

/**
 * Get total completion stats
 */
export const getTotalStats = () => {
  const progress = getOrInitProgress()
  const levels = generateLevels()
  
  let totalStars = 0
  let levelsWithStars = 0 // Count of levels that have at least 1 star
  let completedLevels = 0
  let totalAttempts = 0
  let levelsUnlocked = 0
  
  levels.forEach(level => {
    const levelProgress = progress[level.id]
    if (levelProgress) {
      totalStars += levelProgress.stars
      if (levelProgress.stars > 0) levelsWithStars++ // Has earned at least 1 star
      if (levelProgress.completed) completedLevels++
      totalAttempts += levelProgress.attempts
      if (levelProgress.isUnlocked) levelsUnlocked++
    }
  })
  
  const completionPercentage = Math.round((completedLevels / levels.length) * 100)
  
  return {
    totalStars, // Total stars earned (for internal use)
    levelsWithStars, // Levels with at least 1 star (display this)
    maxLevels: levels.length, // Total levels (display out of this)
    completedLevels,
    totalLevels: levels.length,
    levelsUnlocked,
    totalAttempts,
    completionPercentage
  }
}
