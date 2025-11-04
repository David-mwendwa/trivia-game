import { useState } from 'react'
import { Trophy, MapPin, Flag } from 'lucide-react'

function StartScreen({ onStart }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onStart(name.trim())
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8 animate-slide-up">
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
              className="px-4 py-2 bg-gradient-to-r from-kenya-green/20 to-kenya-red/20 text-kenya-black border-2 border-kenya-green rounded-full text-sm font-bold shadow-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

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
            className="w-full px-4 py-3 border-2 border-kenya-green rounded-xl focus:outline-none focus:border-kenya-red focus:ring-2 focus:ring-kenya-green/20 transition-all text-lg"
            maxLength={20}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-8 rounded-xl font-bold text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
        >
          Start Game 🎮
        </button>
      </form>

      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green/30 rounded-xl p-4">
          <p className="text-sm text-kenya-black font-semibold">
            🦁 20 Questions About Beautiful Kenya 🌍
          </p>
          <p className="text-xs text-gray-600 mt-1">
            From Nairobi to Mombasa, from Maasai Mara to Mount Kenya!
          </p>
        </div>
      </div>
    </div>
  )
}

export default StartScreen
