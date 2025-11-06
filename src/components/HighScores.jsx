import { useState, useEffect, useMemo } from 'react'
import { Trophy, Medal, Award, Star, Zap, Target, ChevronDown, ChevronUp } from 'lucide-react'
import { formatScore, calculateAccuracy } from '../utils/scoringSystem'
import { getAllScores, getLocalScores } from '../utils/scoresManager'

function HighScores() {
  const [highScores, setHighScores] = useState([])
  const [expandedLevels, setExpandedLevels] = useState({ 1: true }) // Level 1 open by default
  const [visibleScores, setVisibleScores] = useState({}) // Track visible scores per level

  useEffect(() => {
    loadHighScores()
  }, [])

  const loadHighScores = async () => {
    // Try to fetch from Supabase first - increase limit to 500 to have enough scores
    const { success, data } = await getAllScores(500)
    
    if (success && data.length > 0) {
      // Transform Supabase data to match expected format
      const transformedScores = data.map(score => ({
        name: score.player_name,
        score: score.score,
        totalQuestions: score.total_questions,
        correctAnswers: score.correct_answers,
        percentage: score.percentage,
        difficulty: score.difficulty,
        levelId: score.level_id,
        date: score.created_at
      }))
      setHighScores(transformedScores)
    } else {
      // Fallback to localStorage if Supabase fails or has no data
      const localScores = getLocalScores()
      setHighScores(localScores)
    }
  }

  const toggleLevel = (levelId) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }))
    
    // Initialize visible scores count for this level if not set
    if (!visibleScores[levelId]) {
      setVisibleScores(prev => ({
        ...prev,
        [levelId]: 50 // Show 50 scores by default
      }))
    }
  }

  // Group scores by level with useMemo for better performance
  const scoresByLevel = useMemo(() => {
    return highScores.reduce((acc, score) => {
      const levelId = score.levelId || 'unknown'
      if (!acc[levelId]) acc[levelId] = []
      acc[levelId].push(score)
      return acc
    }, {})
  }, [highScores])

  // Sort each level's scores with useMemo
  const sortedScoresByLevel = useMemo(() => {
    const sorted = { ...scoresByLevel }
    Object.keys(sorted).forEach(levelId => {
      sorted[levelId] = [...sorted[levelId]].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return b.percentage - a.percentage
      })
    })
    return sorted
  }, [scoresByLevel])

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
        
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((levelId) => {
          const levelScores = scoresByLevel[levelId] || []
          if (levelScores.length === 0) return null
          const isExpanded = expandedLevels[levelId]

          return (
            <div key={levelId} className="border-2 border-kenya-green/30 rounded-lg overflow-hidden">
              {/* Level Header */}
              <button
                onClick={() => toggleLevel(levelId)}
                className="w-full bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 p-3 sm:p-4 flex items-center justify-between hover:from-kenya-green/20 hover:to-kenya-red/20 transition-all touch-manipulation min-h-[44px]"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Trophy className="w-5 h-5 text-kenya-green" />
                  <h3 className="font-bold text-base sm:text-lg text-kenya-black">
                    Level {levelId}
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-600 font-semibold">
                    ({levelScores.length} {levelScores.length === 1 ? 'score' : 'scores'})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Level Scores */}
              {isExpanded && (
                <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 bg-white">
                  {levelScores.slice(0, visibleScores[levelId] || 50).map((score, index) => (
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
                  {levelScores.length > (visibleScores[levelId] || 50) ? (
                    <button
                      onClick={() => {
                        setVisibleScores(prev => ({
                          ...prev,
                          [levelId]: (prev[levelId] || 50) + 50
                        }))
                      }}
                      className="mt-3 w-full py-2 px-4 bg-kenya-green/10 hover:bg-kenya-green/20 text-kenya-green font-medium rounded-lg transition-colors"
                    >
                      Load More ({levelScores.length - (visibleScores[levelId] || 50)} more scores)
                    </button>
                  ) : levelScores.length > 50 && (
                    <p className="text-center text-xs text-gray-500 mt-2">
                      Showing all {levelScores.length} scores
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {highScores.length > 0 && (
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 font-semibold">
          📊 Total Scores: {highScores.length} 🇰🇪
        </p>
      )}
    </div>
  )
}

export default HighScores
