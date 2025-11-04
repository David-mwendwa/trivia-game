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
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform animate-bounce-subtle">
      <div className="text-center">
        {/* Trophy Icon */}
        <div className="flex justify-center mb-6">
          <Trophy className={`w-24 h-24 ${performance.color} animate-pulse-slow`} />
        </div>

        {/* Performance Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          {performance.text}
        </h1>
        <p className="text-6xl mb-6">{performance.emoji}</p>

        {/* Player Name */}
        <p className="text-2xl text-gray-600 mb-8">
          Great game, <span className="font-bold text-kenya-green">{playerName}</span>! 🇰🇪
        </p>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-kenya-red mb-2" />
              <p className="text-sm text-gray-600 mb-1">Your Score</p>
              <p className="text-3xl font-bold text-kenya-red">
                {score} / {totalQuestions}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <TrendingUp className="w-8 h-8 text-kenya-green mb-2" />
              <p className="text-sm text-gray-600 mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-kenya-green">{percentage}%</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Correct</p>
              <p className="text-3xl font-bold text-yellow-600">{score}</p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-kenya-green/10 border-2 border-kenya-green rounded-xl p-4 mb-8">
          <p className="text-sm text-kenya-black font-semibold">
            💡 <strong>Did you know?</strong> You answered {score} questions correctly about Kenya! 
            {percentage === 100 && " You're a true Kenya Expert! 🎓🇰🇪"}
            {percentage < 100 && ` Try again to beat your score! 🚀`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-8 rounded-xl font-bold text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-6 h-6" />
            Play Again
          </button>
        </div>

        {/* Encouragement */}
        <p className="mt-6 text-gray-500 text-sm font-semibold">
          Your score has been saved! 🎯🇰🇪
        </p>
      </div>
    </div>
  )
}

export default ResultsScreen
