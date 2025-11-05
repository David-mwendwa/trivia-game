import { useState, useEffect } from 'react'
import { Trophy, Lock, Star, ChevronRight, RotateCcw, Award } from 'lucide-react'
import { getLevelsWithProgress, getTotalStats, resetAllProgress } from '../utils/levelSystem'

function LevelSelect({ onLevelSelect, onBack }) {
  const [levels, setLevels] = useState([])
  const [stats, setStats] = useState(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = () => {
    const levelsData = getLevelsWithProgress()
    const statsData = getTotalStats()
    setLevels(levelsData)
    setStats(statsData)
  }

  const handleResetProgress = () => {
    resetAllProgress()
    loadProgress()
    setShowResetConfirm(false)
  }

  const renderStars = (stars) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i <= stars
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getLevelColor = (level) => {
    if (level.isLocked) return 'bg-gray-100 border-gray-300'
    if (level.stars === 3) return 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-400'
    if (level.stars === 2) return 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-400'
    if (level.stars === 1) return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-400'
    return 'bg-white border-kenya-green'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kenya-red/10 via-white to-kenya-green/10 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green mb-3">
            Select Level
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Complete each level with 60% or higher to unlock the next!
          </p>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <p className="text-2xl font-bold text-yellow-600">{stats.totalStars}/{stats.maxStars}</p>
                </div>
                <p className="text-xs text-gray-600">Total Stars</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">{stats.completedLevels}/{stats.totalLevels}</p>
                </div>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-5 h-5 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-600">{stats.completionPercentage}%</p>
                </div>
                <p className="text-xs text-gray-600">Progress</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-600">{stats.levelsUnlocked}</p>
                </div>
                <p className="text-xs text-gray-600">Unlocked</p>
              </div>
            </div>
          </div>
        )}

        {/* Level Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => !level.isLocked && onLevelSelect(level.id)}
              disabled={level.isLocked}
              className={`${getLevelColor(level)} border-2 rounded-lg p-4 sm:p-6 transition-all hover:scale-105 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-xl touch-manipulation min-h-[44px] active:scale-95`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {level.name}
                </h3>
                {level.isLocked ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : (
                  renderStars(level.stars)
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                {level.description}
              </p>

              {!level.isLocked && (
                <div className="space-y-2">
                  {level.bestScore > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Best Score:</span>
                      <span className="font-bold text-purple-600">{level.bestScore.toLocaleString()}</span>
                    </div>
                  )}
                  {level.bestAccuracy > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Best Accuracy:</span>
                      <span className="font-bold text-kenya-green">{level.bestAccuracy}%</span>
                    </div>
                  )}
                  {level.attempts > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Attempts:</span>
                      <span className="font-bold text-gray-700">{level.attempts}</span>
                    </div>
                  )}
                </div>
              )}

              {level.isLocked && (
                <p className="text-xs text-gray-500 italic mt-2">
                  Complete previous level to unlock
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors shadow-md touch-manipulation min-h-[44px] active:scale-95"
          >
            ← Back to Menu
          </button>
          
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-6 py-3 bg-kenya-red/10 text-kenya-red rounded-lg font-bold hover:bg-kenya-red/20 transition-colors shadow-md border-2 border-kenya-red/30 touch-manipulation min-h-[44px] active:scale-95"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Reset Progress
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleResetProgress}
                className="px-4 py-3 bg-kenya-red text-white rounded-lg font-bold hover:bg-kenya-red/90 transition-colors shadow-md touch-manipulation min-h-[44px] active:scale-95"
              >
                ✓ Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-3 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition-colors shadow-md touch-manipulation min-h-[44px] active:scale-95"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LevelSelect
