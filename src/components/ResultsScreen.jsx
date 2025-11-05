import { useEffect, useRef } from 'react'
import { Trophy, Star, RotateCcw, TrendingUp, Award, Zap } from 'lucide-react'
import { calculateAccuracy, formatScore, getPerformanceColor } from '../utils/scoringSystem'

function ResultsScreen({ playerName, score, totalQuestions, correctAnswers = 0, difficulty = 'casual', onRestart, currentUser }) {
  const hasSaved = useRef(false)
  
  // Ensure correct answers never exceeds total questions
  const validCorrectAnswers = Math.min(correctAnswers, totalQuestions)
  
  // Calculate sophisticated accuracy metrics
  const accuracy = calculateAccuracy(validCorrectAnswers, totalQuestions)
  const percentage = Math.min(accuracy.percentage, 100) // Cap at 100%
  
  useEffect(() => {
    // Prevent duplicate saves (React StrictMode runs twice)
    if (hasSaved.current) return
    hasSaved.current = true
    
    // Get total games played (including this one)
    let gamesPlayed = 1
    if (currentUser && currentUser.gamesPlayed !== undefined) {
      // For authenticated users, use updated count from profile
      gamesPlayed = currentUser.gamesPlayed
    } else {
      // For guest users, count from localStorage
      const scores = JSON.parse(localStorage.getItem('triviaHighScores') || '[]')
      gamesPlayed = scores.filter(s => s.name === playerName).length + 1
    }
    
    // Save high score to localStorage
    const highScores = JSON.parse(localStorage.getItem('triviaHighScores') || '[]')
    
    const newScore = {
      name: playerName,
      score: score,
      totalQuestions: totalQuestions,
      correctAnswers: validCorrectAnswers,
      percentage: percentage,
      difficulty: difficulty,
      gamesPlayed: gamesPlayed,
      date: new Date().toISOString()
    }
    
    highScores.push(newScore)
    
    // Sort by score (descending) and keep top 10
    highScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return b.percentage - a.percentage
    })
    
    const top10 = highScores.slice(0, 10)
    localStorage.setItem('triviaHighScores', JSON.stringify(top10))
  }, [])

  const getPerformanceMessage = () => {
    return {
      text: `${accuracy.rating}! ${accuracy.grade}`,
      emoji: accuracy.stars >= 5 ? "🎉" : accuracy.stars >= 4 ? "😄" : accuracy.stars >= 3 ? "😊" : accuracy.stars >= 2 ? "😐" : "😅",
      color: getPerformanceColor(percentage)
    }
  }

  const performance = getPerformanceMessage()
  
  // Render stars
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 sm:w-6 sm:h-6 inline ${i < accuracy.stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 transform animate-bounce-subtle touch-manipulation select-none">
      <div className="text-center">
        {/* Trophy Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Trophy className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${performance.color} animate-pulse-slow`} />
        </div>

        {/* Performance Message */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
          {performance.text}
        </h1>
        <p className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">{performance.emoji}</p>

        {/* Player Name */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8">
          Great game, <span className="font-bold text-kenya-green">{playerName}</span>! 🇰🇪
        </p>

        {/* Stars Rating */}
        <div className="mb-4 sm:mb-6">
          {renderStars()}
        </div>

        {/* Grade Badge */}
        <div className="inline-block mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg">
            <p className="text-2xl sm:text-3xl font-bold">Grade: {accuracy.grade}</p>
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex flex-col items-center">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Score</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {formatScore(score)}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-kenya-green mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Accuracy</p>
              <p className="text-2xl sm:text-3xl font-bold text-kenya-green">{percentage}%</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Correct Answers</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{validCorrectAnswers}/{totalQuestions}</p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-kenya-green/10 border-2 border-kenya-green rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-kenya-black font-semibold">
            💡 <strong>Performance:</strong> {accuracy.rating} - You answered {validCorrectAnswers} questions correctly about Kenya! 
            {percentage === 100 && " You're a true Kenya Expert! 🎓🇰🇪"}
            {percentage >= 80 && percentage < 100 && " Outstanding performance! 🌟"}
            {percentage < 80 && ` Keep practicing to improve your score! 🚀`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-6 sm:px-8 rounded-lg font-bold text-lg sm:text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 touch-manipulation min-h-[56px]"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            Play Again
          </button>
        </div>

        {/* Encouragement */}
        <p className="mt-4 sm:mt-6 text-gray-500 text-xs sm:text-sm font-semibold">
          Your score has been saved! 🎯🇰🇪
        </p>
      </div>
    </div>
  )
}

export default ResultsScreen
