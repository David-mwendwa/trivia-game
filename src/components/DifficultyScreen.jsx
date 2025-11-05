import { Zap, Clock, Flame, Trophy } from 'lucide-react'

function DifficultyScreen({ onSelectDifficulty, playerName }) {
  const difficulties = [
    {
      id: 'casual',
      name: 'Casual Mode',
      icon: Trophy,
      description: 'No time limit - Take your time to think',
      timeLimit: null,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
      bgColor: 'from-blue-50 to-blue-100',
      features: ['No Timer', 'Perfect for Learning', 'No Pressure']
    },
    {
      id: 'challenge',
      name: 'Challenge Mode',
      icon: Clock,
      description: '20 seconds per question',
      timeLimit: 20,
      color: 'from-kenya-green to-green-600',
      borderColor: 'border-kenya-green',
      bgColor: 'from-kenya-green/10 to-green-100',
      features: ['20s Timer', 'Time Bonus Points', 'Moderate Difficulty']
    },
    {
      id: 'blitz',
      name: 'Blitz Mode',
      icon: Flame,
      description: '10 seconds per question - Lightning fast!',
      timeLimit: 10,
      color: 'from-kenya-red to-red-600',
      borderColor: 'border-kenya-red',
      bgColor: 'from-kenya-red/10 to-red-100',
      features: ['10s Timer', 'Maximum Time Bonus', 'Expert Level']
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 animate-slide-up touch-manipulation select-none">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex justify-center mb-3 sm:mb-4">
          <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 animate-pulse" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green mb-3 sm:mb-4">
          Choose Your Difficulty
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-2">
          Ready, <span className="font-bold text-kenya-green">{playerName}</span>?
        </p>
        
        <p className="text-xs sm:text-sm text-gray-500">
          Select your preferred game mode
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {difficulties.map((difficulty) => {
          const Icon = difficulty.icon
          return (
            <button
              key={difficulty.id}
              onClick={() => onSelectDifficulty(difficulty.id, difficulty.timeLimit)}
              className={`bg-gradient-to-br ${difficulty.bgColor} border-2 ${difficulty.borderColor} rounded-lg p-4 sm:p-6 hover:scale-105 active:scale-95 transform transition-all duration-300 shadow-lg hover:shadow-2xl text-left touch-manipulation min-h-[200px] sm:min-h-[240px]`}
            >
              <div className="flex flex-col items-center text-center h-full justify-between">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${difficulty.color} rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                  {difficulty.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 font-semibold">
                  {difficulty.description}
                </p>
                
                <div className="space-y-1.5 sm:space-y-2 w-full">
                  {difficulty.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-gray-700"
                    >
                      <span className="w-1.5 h-1.5 bg-kenya-green rounded-full"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <div className="bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green/30 rounded-lg p-3 sm:p-4 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-kenya-black font-semibold">
            💡 <strong>Tip:</strong> Challenge and Blitz modes award bonus points for quick correct answers!
          </p>
        </div>
      </div>
    </div>
  )
}

export default DifficultyScreen
