import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Timer, Zap, TrendingUp } from 'lucide-react';
import questionsData from '../data/questions.json';
import { calculateQuestionScore, formatScore } from '../utils/scoringSystem';

function GameScreen({ playerName, onGameEnd, difficulty = 'casual', timeLimit = null }) {
  const [questions] = useState(() => {
    // Shuffle questions for variety
    return [...questionsData].sort(() => Math.random() - 0.5);
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!timeLimit || showResult) return;

    setTimeRemaining(timeLimit);
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showResult]);

  const handleTimeout = () => {
    if (showResult) return;
    setSelectedAnswer(null);
    setAnsweredCorrectly(false);
    setShowResult(true);
    setCurrentStreak(0); // Break streak on timeout
  };


  const handleAnswerClick = (answerIndex) => {
    if (showResult) return; // Prevent multiple clicks

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setAnsweredCorrectly(isCorrect);
    setShowResult(true);

    // Calculate score using sophisticated system
    const scoreResult = calculateQuestionScore({
      isCorrect,
      timeRemaining,
      timeLimit,
      currentStreak: isCorrect ? currentStreak : 0,
      difficulty,
    });

    setScoreBreakdown(scoreResult.breakdown);

    if (isCorrect) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setLongestStreak(Math.max(longestStreak, newStreak));
      setCorrectCount(correctCount + 1);
      setScore(score + scoreResult.points);
    } else {
      setCurrentStreak(0);
      // Apply penalty if any (currently 0 in config)
      setScore(Math.max(0, score + scoreResult.points));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnsweredCorrectly(false);
      setScoreBreakdown(null);
    } else {
      // Pass additional stats to results screen
      onGameEnd(score, questions.length, {
        correctCount,
        longestStreak,
        difficulty,
      });
    }
  };

  const getButtonClass = (index) => {
    const baseClass =
      'w-full p-3 sm:p-4 rounded-lg text-left font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation min-h-[56px] flex items-center';

    if (!showResult) {
      return `${baseClass} bg-white border-2 border-purple-300 hover:border-purple-500 hover:shadow-lg text-gray-800`;
    }

    if (index === currentQuestion.correctAnswer) {
      return `${baseClass} bg-green-500 text-white border-2 border-green-600 animate-correct`;
    }

    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return `${baseClass} bg-red-500 text-white border-2 border-red-600 animate-incorrect`;
    }

    return `${baseClass} bg-gray-200 text-gray-500 border-2 border-gray-300 opacity-50`;
  };

  return (
    <div className='bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 touch-manipulation select-none'>
      {/* Header */}
      <div className='mb-4 sm:mb-6'>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-4'>
          <div className='text-center sm:text-left'>
            <p className='text-xs sm:text-sm text-gray-600'>Player</p>
            <p className='text-lg sm:text-xl font-bold text-kenya-red'>{playerName}</p>
          </div>
          
          {/* Timer Display */}
          {timeLimit && (
            <div className='text-center'>
              <p className='text-xs sm:text-sm text-gray-600'>Time Left</p>
              <div className={`flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold ${
                timeRemaining <= 5 ? 'text-red-600 animate-pulse' : 
                timeRemaining <= 10 ? 'text-orange-500' : 'text-kenya-green'
              }`}>
                <Timer className='w-5 h-5 sm:w-6 sm:h-6' />
                {timeRemaining}s
              </div>
            </div>
          )}
          
          <div className='text-center sm:text-right'>
            <p className='text-xs sm:text-sm text-gray-600'>Score</p>
            <p className='text-lg sm:text-2xl font-bold text-kenya-green'>
              {formatScore(score)}
            </p>
            {currentStreak >= 3 && (
              <div className='flex items-center justify-center sm:justify-end gap-1 mt-1'>
                <Zap className='w-4 h-4 text-yellow-500' />
                <span className='text-xs font-bold text-yellow-600'>{currentStreak}x Streak!</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className='w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner'>
          <div
            className='bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green h-full transition-all duration-500 ease-out rounded-full'
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className='text-xs sm:text-sm text-gray-600 mt-2 text-center font-semibold'>
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Category Badge */}
      <div className='mb-4 sm:mb-6'>
        <span className='inline-block px-3 py-2 sm:px-4 bg-gradient-to-r from-kenya-green/20 to-kenya-red/20 text-kenya-black border-2 border-kenya-green rounded-md text-xs sm:text-sm font-bold shadow-sm'>
          📚 {currentQuestion.category}
        </span>
      </div>

      {/* Question */}
      <div className='mb-6 sm:mb-8'>
        <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-relaxed'>
          {currentQuestion.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className='space-y-3 sm:space-y-4 mb-6'>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(index)}
            disabled={showResult}
            className={getButtonClass(index)}>
            <div className='flex items-center justify-between w-full'>
              <span className='text-sm sm:text-base lg:text-lg flex-1 pr-2'>{option}</span>
              {showResult && index === currentQuestion.correctAnswer && (
                <CheckCircle className='w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0' />
              )}
              {showResult &&
                index === selectedAnswer &&
                index !== currentQuestion.correctAnswer && (
                  <XCircle className='w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0' />
                )}
            </div>
          </button>
        ))}
      </div>

      {/* Result Feedback */}
      {showResult && (
        <div
          className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 ${
            answeredCorrectly
              ? 'bg-green-100 border-2 border-green-500'
              : selectedAnswer === null
              ? 'bg-orange-100 border-2 border-orange-500'
              : 'bg-red-100 border-2 border-red-500'
          }`}>
          <p
            className={`text-center font-bold text-base sm:text-lg ${
              answeredCorrectly ? 'text-green-700' : 
              selectedAnswer === null ? 'text-orange-700' : 'text-red-700'
            }`}>
            {answeredCorrectly
              ? `🎉 Correct! +${formatScore(scoreBreakdown?.total || 0)} points`
              : selectedAnswer === null
              ? '⏰ Time\'s up! No answer selected.'
              : '❌ Incorrect! Better luck next time!'}
          </p>
          {answeredCorrectly && scoreBreakdown && (
            <div className='mt-3 space-y-1 text-xs sm:text-sm'>
              <div className='flex justify-between text-green-700'>
                <span>Base Points:</span>
                <span className='font-bold'>+{scoreBreakdown.base}</span>
              </div>
              {scoreBreakdown.timeBonus > 0 && (
                <div className='flex justify-between text-blue-700'>
                  <span>⚡ Speed Bonus:</span>
                  <span className='font-bold'>+{scoreBreakdown.timeBonus}</span>
                </div>
              )}
              {scoreBreakdown.streakBonus > 0 && (
                <div className='flex justify-between text-yellow-700'>
                  <span>🔥 Streak Bonus ({currentStreak}x):</span>
                  <span className='font-bold'>+{scoreBreakdown.streakBonus}</span>
                </div>
              )}
              {scoreBreakdown.difficultyMultiplier > 1 && (
                <div className='flex justify-between text-purple-700'>
                  <span>💪 Difficulty Multiplier:</span>
                  <span className='font-bold'>×{scoreBreakdown.difficultyMultiplier}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <button
          onClick={handleNextQuestion}
          className='w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-6 sm:px-8 rounded-lg font-bold text-lg sm:text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl touch-manipulation min-h-[56px]'>
          {currentQuestionIndex < questions.length - 1
            ? 'Next Question ➡️'
            : 'See Results 🏆'}
        </button>
      )}
    </div>
  );
}

export default GameScreen;
