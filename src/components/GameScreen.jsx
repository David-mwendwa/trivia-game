import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Timer } from 'lucide-react';
import questionsData from '../data/questions.json';

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
  const [timeBonus, setTimeBonus] = useState(0);

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
    setTimeBonus(0);
  };

  const calculateTimeBonus = (timeLeft) => {
    if (!timeLimit) return 0;
    // Award bonus points based on time remaining
    const percentageLeft = (timeLeft / timeLimit) * 100;
    if (percentageLeft >= 75) return 3; // Very fast
    if (percentageLeft >= 50) return 2; // Fast
    if (percentageLeft >= 25) return 1; // Moderate
    return 0;
  };

  const handleAnswerClick = (answerIndex) => {
    if (showResult) return; // Prevent multiple clicks

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setAnsweredCorrectly(isCorrect);
    setShowResult(true);

    if (isCorrect) {
      const bonus = calculateTimeBonus(timeRemaining);
      setTimeBonus(bonus);
      setScore(score + 1 + bonus);
    } else {
      setTimeBonus(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnsweredCorrectly(false);
      setTimeBonus(0);
    } else {
      const finalScore = answeredCorrectly ? score : score;
      onGameEnd(finalScore, questions.length);
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
              {score}
            </p>
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
              ? `🎉 Correct! ${timeBonus > 0 ? `+${timeBonus} Time Bonus!` : 'Well done!'}`
              : selectedAnswer === null
              ? '⏰ Time\'s up! No answer selected.'
              : '❌ Incorrect! Better luck next time!'}
          </p>
          {answeredCorrectly && timeBonus > 0 && (
            <p className='text-center text-xs sm:text-sm text-green-600 mt-2 font-semibold'>
              ⚡ Lightning fast! Earned {timeBonus} bonus point{timeBonus > 1 ? 's' : ''}!
            </p>
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
