import { useEffect } from 'react'
import { Trophy, Star, RotateCcw, TrendingUp } from 'lucide-react'

function ResultsScreen({ playerName, score, totalQuestions, onRestart }) {
  const percentage = Math.round((score / totalQuestions) * 100)
  
  useEffect(() => {
    // Save high score to localStorage
    const highScores = JSON.parse(localStorage.getItem('triviaHighScores') || '[]')
    
    const newScore = {
      name: playerName,
      score: score,
      totalQuestions: totalQuestions,
      percentage: percentage,
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
  }, [playerName, score, totalQuestions, percentage])

  const getPerformanceMessage = () => {
    if (percentage === 100) return { text: "Perfect Score! 🏆", emoji: "🎉", color: "text-yellow-500" }
    if (percentage >= 80) return { text: "Excellent! 🌟", emoji: "😄", color: "text-kenya-green" }
    if (percentage >= 60) return { text: "Good Job! 👍", emoji: "😊", color: "text-blue-500" }
    if (percentage >= 40) return { text: "Not Bad! 💪", emoji: "😐", color: "text-orange-500" }
    return { text: "Keep Trying! 📚", emoji: "😅", color: "text-kenya-red" }
  }

  const performance = getPerformanceMessage()

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

        {/* Score Display */}
        <div className="bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex flex-col items-center">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-kenya-red mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Your Score</p>
              <p className="text-2xl sm:text-3xl font-bold text-kenya-red">
                {score} / {totalQuestions}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-kenya-green mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Accuracy</p>
              <p className="text-2xl sm:text-3xl font-bold text-kenya-green">{percentage}%</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Correct</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{score}</p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-kenya-green/10 border-2 border-kenya-green rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-kenya-black font-semibold">
            💡 <strong>Did you know?</strong> You answered {score} questions correctly about Kenya! 
            {percentage === 100 && " You're a true Kenya Expert! 🎓🇰🇪"}
            {percentage < 100 && ` Try again to beat your score! 🚀`}
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
