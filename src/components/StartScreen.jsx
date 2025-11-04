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
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 mb-8 animate-slide-up">
      <div className="text-center mb-10">
        {/* Kenya Flag Representation */}
        <div className="mb-8 mx-auto w-40 h-24 rounded-xl overflow-hidden shadow-xl border-4 border-gray-200 transform hover:scale-105 transition-transform">
          <div className="h-1/4 bg-kenya-black"></div>
          <div className="h-1/4 bg-kenya-red"></div>
          <div className="h-1/4 bg-kenya-green"></div>
          <div className="h-1/4 bg-kenya-white"></div>
        </div>
        
        <div className="flex justify-center gap-6 mb-8">
          <MapPin className="w-14 h-14 text-kenya-red animate-pulse-slow" />
          <Trophy className="w-20 h-20 text-yellow-500 animate-bounce-subtle" />
          <Flag className="w-14 h-14 text-kenya-green animate-pulse-slow" />
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green mb-6 leading-tight">
          Kenya Trivia Challenge
        </h1>
        
        <p className="text-3xl md:text-4xl font-bold text-kenya-green mb-3">
          🇰🇪 Karibu! 🇰🇪
        </p>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-2xl mx-auto">
          Test Your Knowledge About Beautiful Kenya!
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {['Geography', 'History', 'Culture', 'Wildlife', 'Sports', 'Economy'].map((category) => (
            <span 
              key={category}
              className="px-5 py-2.5 bg-gradient-to-r from-kenya-green/20 to-kenya-red/20 text-kenya-black border-2 border-kenya-green rounded-full text-base font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-8">
          <label htmlFor="playerName" className="block text-xl font-bold text-kenya-black mb-3">
            Enter Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name here..."
            className="w-full px-6 py-4 border-3 border-kenya-green rounded-2xl focus:outline-none focus:border-kenya-red focus:ring-4 focus:ring-kenya-green/20 transition-all text-xl font-medium shadow-md"
            maxLength={20}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-5 px-10 rounded-2xl font-bold text-2xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          Start Game 🎮
        </button>
      </form>

      <div className="mt-10 text-center">
        <div className="bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green/30 rounded-2xl p-6 shadow-md">
          <p className="text-lg text-kenya-black font-bold mb-2">
            🦁 20 Questions About Beautiful Kenya 🌍
          </p>
          <p className="text-base text-gray-600">
            From Nairobi to Mombasa, from Maasai Mara to Mount Kenya!
          </p>
        </div>
      </div>
    </div>
  )
}

export default StartScreen
