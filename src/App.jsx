import { useState, useEffect } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'
import HighScores from './components/HighScores'
import LoginScreen from './components/LoginScreen'
import DifficultyScreen from './components/DifficultyScreen'
import { getCurrentUser, logoutUser, updateUserStats } from './utils/supabaseUserManager'
import { supabase } from './lib/supabase'

function App() {
  const [gameState, setGameState] = useState('login') // 'login', 'start', 'difficulty', 'playing', 'results'
  const [currentUser, setCurrentUser] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [difficulty, setDifficulty] = useState('casual')
  const [timeLimit, setTimeLimit] = useState(null)

  // Check if user is already logged in on mount and listen for auth changes
  useEffect(() => {
    // Get initial session
    const checkUser = async () => {
      const userData = await getCurrentUser()
      if (userData) {
        setCurrentUser(userData.profile || userData.user)
        setPlayerName(userData.profile?.name || userData.user?.user_metadata?.name)
        setGameState('start')
      }
    }
    
    checkUser()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const userData = await getCurrentUser()
        if (userData) {
          setCurrentUser(userData.profile || userData.user)
          setPlayerName(userData.profile?.name || userData.user?.user_metadata?.name)
          setGameState('start')
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null)
        setPlayerName('')
        setGameState('login')
        setScore(0)
        setTotalQuestions(0)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    setPlayerName(user.name)
    setGameState('start')
  }

  const handleLogout = async () => {
    await logoutUser()
    // State will be updated by the auth state change listener
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
  }

  const endGame = async (finalScore, total) => {
    setScore(finalScore)
    setTotalQuestions(total)
    setGameState('results')
    
    // Update user stats in Supabase
    if (currentUser) {
      await updateUserStats(currentUser.id, finalScore, total)
      // Refresh current user data
      const updatedUser = await getCurrentUser()
      if (updatedUser) {
        setCurrentUser(updatedUser.profile || updatedUser.user)
      }
    }
  }

  const restartGame = () => {
    setGameState('difficulty')
    setScore(0)
    setTotalQuestions(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kenya-black via-kenya-red to-kenya-green flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
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
            onRestart={restartGame}
          />
        )}
        
        {gameState === 'start' && <HighScores />}
      </div>
    </div>
  )
}

export default App
