import { useState, useEffect } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'
import HighScores from './components/HighScores'
import LoginScreen from './components/LoginScreen'
import { getCurrentUser, clearCurrentUser, updateUserStats } from './utils/userManager'

function App() {
  const [gameState, setGameState] = useState('login') // 'login', 'start', 'playing', 'results'
  const [currentUser, setCurrentUser] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  // Check if user is already logged in on mount
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      setPlayerName(user.name)
      setGameState('start')
    }
  }, [])

  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    setPlayerName(user.name)
    setGameState('start')
  }

  const handleLogout = () => {
    clearCurrentUser()
    setCurrentUser(null)
    setPlayerName('')
    setGameState('login')
    setScore(0)
    setTotalQuestions(0)
  }

  const startGame = (name) => {
    setPlayerName(name)
    setGameState('playing')
    setScore(0)
    setTotalQuestions(0)
  }

  const endGame = (finalScore, total) => {
    setScore(finalScore)
    setTotalQuestions(total)
    setGameState('results')
    
    // Update user stats in localStorage
    if (currentUser) {
      updateUserStats(finalScore, total)
      // Refresh current user data
      const updatedUser = getCurrentUser()
      if (updatedUser) {
        setCurrentUser(updatedUser)
      }
    }
  }

  const restartGame = () => {
    setGameState('start')
    setScore(0)
    setTotalQuestions(0)
    setPlayerName('')
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
        {gameState === 'playing' && (
          <GameScreen 
            playerName={playerName} 
            onGameEnd={endGame}
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
