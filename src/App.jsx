import { useState } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'
import HighScores from './components/HighScores'

function App() {
  const [gameState, setGameState] = useState('start') // 'start', 'playing', 'results'
  const [playerName, setPlayerName] = useState('')
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

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
        {gameState === 'start' && <StartScreen onStart={startGame} />}
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
