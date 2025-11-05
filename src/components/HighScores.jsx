import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Trash2 } from 'lucide-react'

function HighScores() {
  const [highScores, setHighScores] = useState([])

  useEffect(() => {
    loadHighScores()
  }, [])

  const loadHighScores = () => {
    const scores = JSON.parse(localStorage.getItem('triviaHighScores') || '[]')
    setHighScores(scores)
  }

  const clearHighScores = () => {
    if (window.confirm('Are you sure you want to clear all high scores?')) {
      localStorage.removeItem('triviaHighScores')
      setHighScores([])
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getMedalIcon = (index) => {
    if (index === 0) return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
    if (index === 1) return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
    if (index === 2) return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
    return <span className="w-5 sm:w-6 text-center font-bold text-gray-500 text-sm sm:text-base">#{index + 1}</span>
  }

  if (highScores.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 mt-6 sm:mt-8 animate-slide-up touch-manipulation select-none">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green text-center sm:text-left">
          🏆 High Scores
        </h2>
        <button
          onClick={clearHighScores}
          className="p-2 sm:p-3 text-kenya-red hover:bg-kenya-red/10 rounded-lg transition-colors border-2 border-kenya-red/20 touch-manipulation min-h-[44px] min-w-[44px] active:scale-95"
          title="Clear all high scores"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {highScores.map((score, index) => (
          <div
            key={index}
            className={`flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 rounded-lg transition-all hover:scale-102 gap-2 sm:gap-0 ${
              index === 0
                ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 shadow-md'
                : index === 1
                ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-400 shadow-md'
                : index === 2
                ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400 shadow-md'
                : 'bg-gradient-to-r from-kenya-green/5 to-kenya-red/5 border-2 border-kenya-green/30'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {getMedalIcon(index)}
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-gray-800 text-base sm:text-lg">{score.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">{formatDate(score.date)}</p>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <p className="font-bold text-lg sm:text-xl text-kenya-green">
                {score.score}/{score.totalQuestions}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-kenya-red">{score.percentage}%</p>
            </div>
          </div>
        ))}
      </div>

      {highScores.length >= 10 && (
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 font-semibold">
          Showing top 10 scores 🇰🇪
        </p>
      )}
    </div>
  )
}

export default HighScores
