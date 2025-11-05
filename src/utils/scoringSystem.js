/**
 * Advanced Scoring System for Kenya Trivia Challenge
 * Provides sophisticated scoring calculations with multiple factors
 */

// Scoring constants
const SCORING_CONFIG = {
  BASE_POINTS: 100, // Base points per correct answer
  
  // Difficulty multipliers
  DIFFICULTY_MULTIPLIERS: {
    casual: 1.0,
    challenge: 1.3,
    blitz: 1.5,
    // Legacy support
    timed: 1.3,
    expert: 1.5,
  },
  
  // Time bonus scaling (more granular)
  TIME_BONUS: {
    MAX_BONUS: 50, // Maximum bonus points for speed
    THRESHOLD: 0.25, // Minimum time percentage to get bonus
  },
  
  // Streak bonuses
  STREAK: {
    MIN_STREAK: 3, // Minimum consecutive correct for streak bonus
    BONUS_PER_STREAK: 25, // Additional points per question in streak
    MAX_STREAK_MULTIPLIER: 2.0, // Maximum multiplier from streaks
  },
  
  // Wrong answer penalty (optional, can be 0)
  WRONG_PENALTY: 0, // Points deducted for wrong answers
  
  // Perfect game bonus
  PERFECT_BONUS: 500,
}

/**
 * Calculate time bonus based on remaining time
 * Uses logarithmic scale for smoother progression
 */
export const calculateTimeBonus = (timeRemaining, timeLimit) => {
  if (!timeLimit || timeRemaining <= 0) return 0
  
  const timePercentage = timeRemaining / timeLimit
  
  // No bonus if answered too slowly
  if (timePercentage < SCORING_CONFIG.TIME_BONUS.THRESHOLD) return 0
  
  // Logarithmic scaling for smoother bonus progression
  const bonusRatio = Math.log(1 + timePercentage) / Math.log(2)
  const bonus = Math.floor(SCORING_CONFIG.TIME_BONUS.MAX_BONUS * bonusRatio)
  
  return bonus
}

/**
 * Calculate streak bonus
 */
export const calculateStreakBonus = (currentStreak) => {
  if (currentStreak < SCORING_CONFIG.STREAK.MIN_STREAK) return 0
  
  const streakBonus = (currentStreak - SCORING_CONFIG.STREAK.MIN_STREAK + 1) * 
                     SCORING_CONFIG.STREAK.BONUS_PER_STREAK
  
  return Math.min(
    streakBonus,
    SCORING_CONFIG.STREAK.BONUS_PER_STREAK * SCORING_CONFIG.STREAK.MAX_STREAK_MULTIPLIER
  )
}

/**
 * Calculate points for a single question
 */
export const calculateQuestionScore = ({
  isCorrect,
  timeRemaining,
  timeLimit,
  currentStreak,
  difficulty = 'casual',
}) => {
  if (!isCorrect) {
    return {
      points: -SCORING_CONFIG.WRONG_PENALTY,
      breakdown: {
        base: 0,
        timeBonus: 0,
        streakBonus: 0,
        difficultyMultiplier: 0,
        penalty: -SCORING_CONFIG.WRONG_PENALTY,
      },
    }
  }
  
  // Calculate components
  const basePoints = SCORING_CONFIG.BASE_POINTS
  const difficultyMultiplier = SCORING_CONFIG.DIFFICULTY_MULTIPLIERS[difficulty] || 1.0
  const timeBonus = calculateTimeBonus(timeRemaining, timeLimit)
  const streakBonus = calculateStreakBonus(currentStreak)
  
  // Total points with multiplier
  const subtotal = basePoints + timeBonus + streakBonus
  const totalPoints = Math.floor(subtotal * difficultyMultiplier)
  
  return {
    points: totalPoints,
    breakdown: {
      base: basePoints,
      timeBonus,
      streakBonus,
      difficultyMultiplier,
      total: totalPoints,
    },
  }
}

/**
 * Calculate comprehensive accuracy metrics
 */
export const calculateAccuracy = (correctAnswers, totalQuestions, questionsData) => {
  if (totalQuestions === 0) {
    return {
      percentage: 0,
      grade: 'N/A',
      rating: 'Not Rated',
      stars: 0,
    }
  }
  
  // Ensure correct answers never exceeds total questions
  const validCorrect = Math.min(correctAnswers, totalQuestions)
  const percentage = Math.min((validCorrect / totalQuestions) * 100, 100)
  
  // Grade system
  let grade, rating, stars
  if (percentage === 100) {
    grade = 'A+'
    rating = 'Perfect'
    stars = 5
  } else if (percentage >= 90) {
    grade = 'A'
    rating = 'Excellent'
    stars = 5
  } else if (percentage >= 80) {
    grade = 'B+'
    rating = 'Very Good'
    stars = 4
  } else if (percentage >= 70) {
    grade = 'B'
    rating = 'Good'
    stars = 4
  } else if (percentage >= 60) {
    grade = 'C+'
    rating = 'Above Average'
    stars = 3
  } else if (percentage >= 50) {
    grade = 'C'
    rating = 'Average'
    stars = 3
  } else if (percentage >= 40) {
    grade = 'D'
    rating = 'Below Average'
    stars = 2
  } else {
    grade = 'F'
    rating = 'Needs Improvement'
    stars = 1
  }
  
  return {
    percentage: Math.round(percentage * 10) / 10, // One decimal place
    grade,
    rating,
    stars,
    correctAnswers: validCorrect,
    totalQuestions,
  }
}

/**
 * Calculate final game statistics
 */
export const calculateGameStats = ({
  correctAnswers,
  totalQuestions,
  totalScore,
  difficulty,
  timeLimit,
  longestStreak,
  categoryBreakdown = {},
}) => {
  const accuracy = calculateAccuracy(correctAnswers, totalQuestions)
  
  // Perfect game bonus
  const perfectBonus = accuracy.percentage === 100 ? SCORING_CONFIG.PERFECT_BONUS : 0
  const finalScore = totalScore + perfectBonus
  
  // Average points per question
  const avgPointsPerQuestion = totalQuestions > 0 
    ? Math.round(finalScore / totalQuestions) 
    : 0
  
  // Performance rating
  let performanceRating = 'Beginner'
  if (finalScore >= 3000) performanceRating = 'Master'
  else if (finalScore >= 2000) performanceRating = 'Expert'
  else if (finalScore >= 1000) performanceRating = 'Advanced'
  else if (finalScore >= 500) performanceRating = 'Intermediate'
  
  return {
    finalScore,
    accuracy,
    perfectBonus,
    avgPointsPerQuestion,
    longestStreak,
    performanceRating,
    difficulty,
    categoryBreakdown,
  }
}

/**
 * Format score for display
 */
export const formatScore = (score) => {
  return score.toLocaleString()
}

/**
 * Get performance color based on score
 */
export const getPerformanceColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 70) return 'text-blue-600'
  if (percentage >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

export default {
  calculateTimeBonus,
  calculateStreakBonus,
  calculateQuestionScore,
  calculateAccuracy,
  calculateGameStats,
  formatScore,
  getPerformanceColor,
  SCORING_CONFIG,
}
