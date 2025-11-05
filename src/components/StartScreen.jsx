import { useState } from 'react'
import { Trophy, MapPin, Flag, LogOut, User, Award, Target } from 'lucide-react'

function StartScreen({ onStart, currentUser, onLogout }) {
  const [name, setName] = useState('')

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
        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-kenya-red to-kenya-green rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-kenya-black">{currentUser.name}</h2>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-kenya-red text-white rounded-lg font-semibold hover:bg-kenya-red/80 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
          
          {/* User Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-kenya-green/10 to-kenya-green/20 border-2 border-kenya-green rounded-md p-4 text-center">
              <Target className="w-6 h-6 text-kenya-green mx-auto mb-2" />
              <p className="text-2xl font-bold text-kenya-green">{currentUser.gamesPlayed}</p>
              <p className="text-xs text-gray-600 font-semibold">Games Played</p>
            </div>
            <div className="bg-gradient-to-br from-kenya-red/10 to-kenya-red/20 border-2 border-kenya-red rounded-md p-4 text-center">
              <Trophy className="w-6 h-6 text-kenya-red mx-auto mb-2" />
              <p className="text-2xl font-bold text-kenya-red">{currentUser.highestScore}</p>
              <p className="text-xs text-gray-600 font-semibold">Highest Score</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/20 border-2 border-yellow-500 rounded-md p-4 text-center">
              <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{currentUser.totalScore}</p>
              <p className="text-xs text-gray-600 font-semibold">Total Score</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 mb-8 animate-slide-up">
      <div className="text-center mb-8">
        {/* Kenya Flag Representation */}
        <div className="mb-6 mx-auto w-32 h-20 rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
          <div className="h-1/4 bg-kenya-black"></div>
          <div className="h-1/4 bg-kenya-red"></div>
          <div className="h-1/4 bg-kenya-green"></div>
          <div className="h-1/4 bg-kenya-white"></div>
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <MapPin className="w-12 h-12 text-kenya-red animate-pulse-slow" />
          <Trophy className="w-16 h-16 text-yellow-500 animate-bounce-subtle" />
          <Flag className="w-12 h-12 text-kenya-green animate-pulse-slow" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green mb-4">
          Kenya Trivia Challenge
        </h1>
        
        <p className="text-2xl font-semibold text-kenya-green mb-2">
          🇰🇪 Welcome! 🇰🇪
        </p>
        
        <p className="text-xl text-gray-600 mb-4">
          Test Your Knowledge About Kenya!
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {['Geography', 'History', 'Culture', 'Wildlife', 'Sports', 'Economy'].map((category) => (
            <span 
              key={category}
              className="px-4 py-2 bg-gradient-to-r from-kenya-green/20 to-kenya-red/20 text-kenya-black border-2 border-kenya-green rounded-md text-sm font-bold shadow-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {currentUser ? (
        // Logged-in user: Show start button directly
        <div className="max-w-md mx-auto">
          <div className="mb-6 text-center">
            <p className="text-lg text-gray-700">
              Ready to test your knowledge, <span className="font-bold text-kenya-green">{currentUser.name.split(' ')[0]}</span>?
            </p>
          </div>
          <button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-8 rounded-lg font-bold text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            Start Game 🎮
          </button>
        </div>
      ) : (
        // Guest user: Show name input form
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-6">
            <label htmlFor="playerName" className="block text-lg font-semibold text-kenya-black mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 border-2 border-kenya-green rounded-lg focus:outline-none focus:border-kenya-red focus:ring-2 focus:ring-kenya-green/20 transition-all text-lg"
              maxLength={20}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-8 rounded-lg font-bold text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            Start Game 🎮
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green/30 rounded-lg p-4">
          <p className="text-sm text-kenya-black font-semibold">
            🦁 20 Questions About Beautiful Kenya 🌍
          </p>
          <p className="text-xs text-gray-600 mt-1">
            From Nairobi to Mombasa, from Maasai Mara to Mount Kenya!
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default StartScreen
