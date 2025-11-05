import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Trash2, Star, Zap, Target } from 'lucide-react'
import { formatScore, calculateAccuracy } from '../utils/scoringSystem'

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

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      casual: { label: 'Casual', color: 'bg-blue-100 text-blue-700 border-blue-300' },
      challenge: { label: 'Challenge', color: 'bg-orange-100 text-orange-700 border-orange-300' },
      blitz: { label: 'Blitz', color: 'bg-red-100 text-red-700 border-red-300' },
      // Legacy support for old difficulty names
      timed: { label: 'Timed', color: 'bg-orange-100 text-orange-700 border-orange-300' },
      expert: { label: 'Expert', color: 'bg-red-100 text-red-700 border-red-300' },
    }
    const badge = badges[difficulty] || badges.casual
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600'
    if (grade.startsWith('B')) return 'text-blue-600'
    if (grade.startsWith('C')) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGamesPlayedBadge = (gamesPlayed) => {
    if (!gamesPlayed) return null
    
    // Color code based on how many attempts it took
    let badgeColor
    if (gamesPlayed <= 3) {
      badgeColor = 'bg-yellow-100 text-yellow-700 border-yellow-300' // Gold - impressive!
    } else if (gamesPlayed <= 10) {
      badgeColor = 'bg-gray-100 text-gray-700 border-gray-300' // Silver
    } else {
      badgeColor = 'bg-orange-100 text-orange-700 border-orange-300' // Bronze - veteran
    }
    
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${badgeColor}`} title={`Total attempts made: ${gamesPlayed}`}>
        🎯 #{gamesPlayed}
      </span>
    )
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
                ? 'bg-gradient-to-r from-yellow-100 to-amber-200 border-2 border-yellow-500 shadow-lg'
                : index === 1
                ? 'bg-gradient-to-r from-slate-200 to-zinc-300 border-2 border-slate-500 shadow-lg'
                : index === 2
                ? 'bg-gradient-to-r from-orange-100 to-amber-200 border-2 border-orange-500 shadow-lg'
                : 'bg-gradient-to-r from-kenya-green/5 to-kenya-red/5 border-2 border-kenya-green/30'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {getMedalIcon(index)}
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <p className="font-bold text-gray-800 text-base sm:text-lg">{score.name}</p>
                  {score.difficulty && getDifficultyBadge(score.difficulty)}
                  {score.gamesPlayed && getGamesPlayedBadge(score.gamesPlayed)}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{formatDate(score.date)}</p>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <div className="flex items-center gap-2 justify-center sm:justify-end mb-1">
                <Zap className="w-4 h-4 text-purple-600" />
                <p className="font-bold text-lg sm:text-xl text-purple-600">
                  {formatScore(score.score)}
                </p>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-end text-xs sm:text-sm">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-semibold text-kenya-green">{score.percentage}%</span>
                {(() => {
                  // Use stored correctAnswers if available, otherwise estimate (for old scores)
                  const correctAnswers = score.correctAnswers ?? Math.min(
                    Math.floor(score.score / 100),
                    score.totalQuestions
                  )
                  const accuracy = calculateAccuracy(correctAnswers, score.totalQuestions)
                  return (
                    <span className={`font-bold ${getGradeColor(accuracy.grade)}`}>
                      {accuracy.grade}
                    </span>
                  )
                })()}
              </div>
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
