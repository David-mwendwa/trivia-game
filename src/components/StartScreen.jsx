import { useState, useEffect } from 'react'
import { Trophy, MapPin, Flag, LogOut, User, Award, Star, Layers, Target } from 'lucide-react'
import { getTotalStats } from '../utils/levelSystem'

function StartScreen({ onStart, currentUser, onLogout }) {
  const [name, setName] = useState('')
  const [levelStats, setLevelStats] = useState(null)

  useEffect(() => {
    // Load level progress stats
    const stats = getTotalStats()
    setLevelStats(stats)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (currentUser) {
      // Use first name from logged-in user
      const firstName = currentUser.name.split(' ')[0]
      onStart(firstName)
    } else if (name.trim()) {
      onStart(name.trim())
    }
  }

  const handleStartGame = () => {
    if (currentUser) {
      const firstName = currentUser.name.split(' ')[0]
      onStart(firstName)
    }
  }

  return (
    <>
      {/* User Profile Card */}
      {currentUser && (
        <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 animate-slide-up touch-manipulation select-none">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-kenya-red to-kenya-green rounded-full flex items-center justify-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-kenya-black">{currentUser.name}</h2>
                <p className="text-xs sm:text-sm text-gray-600">{currentUser.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-kenya-red text-white rounded-lg font-semibold hover:bg-kenya-red/80 transition-all touch-manipulation min-h-[44px] active:scale-95"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              Logout
            </button>
          </div>
          
          {/* User Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-gradient-to-br from-kenya-green/10 to-kenya-green/20 border-2 border-kenya-green rounded-md p-3 sm:p-4 text-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-kenya-green mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-kenya-green">{currentUser.gamesPlayed ?? 0}</p>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">Games Played</p>
            </div>
            <div className="bg-gradient-to-br from-kenya-red/10 to-kenya-red/20 border-2 border-kenya-red rounded-md p-3 sm:p-4 text-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-kenya-red mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-kenya-red">{currentUser.highestScore ?? 0}</p>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">Highest Score</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/20 border-2 border-yellow-500 rounded-md p-3 sm:p-4 text-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{currentUser.totalScore ?? 0}</p>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">Total Score</p>
            </div>
          </div>
          
          {/* Level Progress Stats */}
          {levelStats && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Level Mode Progress
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-yellow-400 rounded-md p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <p className="text-lg sm:text-xl font-bold text-yellow-600">{levelStats.totalStars}/{levelStats.maxStars}</p>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold">Total Stars</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 rounded-md p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Trophy className="w-4 h-4 text-purple-600" />
                    <p className="text-lg sm:text-xl font-bold text-purple-600">{levelStats.completedLevels}/{levelStats.totalLevels}</p>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold">Levels Completed</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-md p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="w-4 h-4 text-green-600" />
                    <p className="text-lg sm:text-xl font-bold text-green-600">{levelStats.completionPercentage}%</p>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold">Progress</p>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  {levelStats.levelsUnlocked === levelStats.totalLevels ? (
                    <>🎉 All levels unlocked! Amazing!</>
                  ) : (
                    <>🔓 {levelStats.levelsUnlocked} of {levelStats.totalLevels} levels unlocked</>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 mb-6 sm:mb-8 animate-slide-up touch-manipulation select-none">
      <div className="text-center mb-6 sm:mb-8">
        {/* Kenya Flag Representation */}
        <div className="mb-4 sm:mb-6 mx-auto w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
          <div className="h-1/4 bg-kenya-black"></div>
          <div className="h-1/4 bg-kenya-red"></div>
          <div className="h-1/4 bg-kenya-green"></div>
          <div className="h-1/4 bg-kenya-white"></div>
        </div>
        
        <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <MapPin className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-kenya-red animate-pulse-slow" />
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-yellow-500 animate-bounce-subtle" />
          <Flag className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-kenya-green animate-pulse-slow" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green mb-3 sm:mb-4">
          Kenya Trivia Challenge
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-kenya-green mb-2">
          🇰🇪 Welcome! 🇰🇪
        </p>
        
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-3 sm:mb-4">
          Test Your Knowledge About Kenya!
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
          {['Geography', 'History', 'Culture', 'Wildlife', 'Sports', 'Economy'].map((category) => (
            <span 
              key={category}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-kenya-green/20 to-kenya-red/20 text-kenya-black border-2 border-kenya-green rounded-md text-xs sm:text-sm font-bold shadow-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {currentUser ? (
        // Logged-in user: Show start button
        <div className="max-w-md mx-auto touch-manipulation">
          <div className="mb-4 sm:mb-6 text-center">
            <p className="text-base sm:text-lg text-gray-700">
              Ready to test your knowledge, <span className="font-bold text-kenya-green">{currentUser.name.split(' ')[0]}</span>?
            </p>
          </div>
          <button
            onClick={() => onStart(currentUser.name.split(' ')[0])}
            className="w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-6 sm:px-8 rounded-lg font-bold text-lg sm:text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl touch-manipulation min-h-[56px] flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Play Game 🎮
          </button>
        </div>
      ) : (
        // Guest user: Show name input form
        <form onSubmit={handleSubmit} className="max-w-md mx-auto touch-manipulation">
          <div className="mb-4 sm:mb-6">
            <label htmlFor="playerName" className="block text-base sm:text-lg font-semibold text-kenya-black mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-4 border-2 border-kenya-green rounded-lg focus:outline-none focus:border-kenya-red focus:ring-2 focus:ring-kenya-green/20 transition-all text-base sm:text-lg touch-manipulation min-h-[48px]"
              maxLength={20}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-6 sm:px-8 rounded-lg font-bold text-lg sm:text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl touch-manipulation min-h-[56px] flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Play Game 🎮
          </button>
        </form>
      )}

      <div className="mt-6 sm:mt-8 text-center">
        <div className="bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-kenya-black font-semibold">
            🦁 100 Questions About Beautiful Kenya 🌍
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Progress through 5 levels • 20 questions each • Unlock as you advance!
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default StartScreen
