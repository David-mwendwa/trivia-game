import { useState, useEffect, useRef } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'
import HighScores from './components/HighScores'
import LoginScreen from './components/LoginScreen'
import DifficultyScreen from './components/DifficultyScreen'
import { getCurrentUser, logoutUser, updateUserStats } from './utils/supabaseUserManager'

// Helper to transform Supabase user data to camelCase
const transformUserData = (userData) => {
  if (!userData) return null
  const { user, profile } = userData
  
  console.log('Transforming user data:', { user, profile })
  
  const transformed = {
    id: user.id,
    email: user.email,
    name: profile?.name || user.user_metadata?.name || user.email,
    gamesPlayed: profile?.games_played ?? 0,
    totalScore: profile?.total_score ?? 0,
    highestScore: profile?.highest_score ?? 0,
  }
  
  console.log('Transformed user:', transformed)
  return transformed
}

function App() {
  const [gameState, setGameState] = useState('loading') // 'loading', 'login', 'start', 'difficulty', 'playing', 'results'
  const [currentUser, setCurrentUser] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [difficulty, setDifficulty] = useState('casual')
  const [timeLimit, setTimeLimit] = useState(null)
  const statsUpdated = useRef(false)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      const userData = await getCurrentUser()
      const transformedUser = transformUserData(userData)
      if (transformedUser) {
        setCurrentUser(transformedUser)
        setPlayerName(transformedUser.name)
        setGameState('start')
      } else {
        setGameState('login')
      }
    }
    checkUser()
  }, [])

  const handleLoginSuccess = (mergedUser) => {
    // LoginScreen passes { ...user, ...profile }, transform to camelCase
    console.log('Login success, received user:', mergedUser)
    
    const transformedUser = {
      id: mergedUser.id,
      email: mergedUser.email,
      name: mergedUser.name,
      gamesPlayed: mergedUser.games_played ?? 0,
      totalScore: mergedUser.total_score ?? 0,
      highestScore: mergedUser.highest_score ?? 0,
    }
    
    console.log('Transformed on login:', transformedUser)
    setCurrentUser(transformedUser)
    setPlayerName(transformedUser.name)
    setGameState('start')
  }

  const handleLogout = async () => {
    await logoutUser()
    setCurrentUser(null)
    setPlayerName('')
    setGameState('login')
    setScore(0)
    setTotalQuestions(0)
  }

  const startGame = (name) => {
    setPlayerName(name)
    setGameState('difficulty')
  }

  const handleDifficultySelect = (selectedDifficulty, selectedTimeLimit) => {
    setDifficulty(selectedDifficulty)
    setTimeLimit(selectedTimeLimit)
    setGameState('playing')
    setScore(0)
    setTotalQuestions(0)
    statsUpdated.current = false // Reset for new game
  }

  const endGame = async (finalScore, total, gameStats = {}) => {
    setScore(finalScore)
    setTotalQuestions(total)
    setCorrectAnswers(gameStats.correctCount || 0)
    setGameState('results')
    
    // Prevent duplicate stats updates (React StrictMode runs effects twice)
    if (statsUpdated.current) return
    statsUpdated.current = true
    
    // Update user stats in Supabase
    if (currentUser && currentUser.id) {
      await updateUserStats(currentUser.id, finalScore, total)
      // Refresh current user data
      const userData = await getCurrentUser()
      const transformedUser = transformUserData(userData)
      if (transformedUser) {
        setCurrentUser(transformedUser)
      }
    }
  }

  const restartGame = () => {
    setGameState('difficulty')
    setScore(0)
    setTotalQuestions(0)
    statsUpdated.current = false // Reset for new game
  }

  // Loading screen while checking session
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kenya-black via-kenya-red to-kenya-green flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kenya-black via-kenya-red to-kenya-green flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 touch-manipulation overscroll-contain">
      <div className="max-w-4xl w-full mx-auto">
        {gameState === 'login' && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
        {gameState === 'start' && (
          <StartScreen 
            onStart={startGame} 
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
        {gameState === 'difficulty' && (
          <DifficultyScreen
            playerName={playerName}
            onSelectDifficulty={handleDifficultySelect}
          />
        )}
        {gameState === 'playing' && (
          <GameScreen 
            playerName={playerName} 
            onGameEnd={endGame}
            difficulty={difficulty}
            timeLimit={timeLimit}
          />
        )}
        {gameState === 'results' && (
          <ResultsScreen
            playerName={playerName}
            score={score}
            totalQuestions={totalQuestions}
            correctAnswers={correctAnswers}
            difficulty={difficulty}
            currentUser={currentUser}
            onRestart={restartGame}
          />
        )}
        
        {gameState === 'start' && <HighScores />}
      </div>
    </div>
  )
}

export default App
