import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import questionsData from '../data/questions.json';

function GameScreen({ playerName, onGameEnd }) {
  const [questions] = useState(() => {
    // Shuffle questions for variety
    return [...questionsData].sort(() => Math.random() - 0.5);
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerClick = (answerIndex) => {
    if (showResult) return; // Prevent multiple clicks

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setAnsweredCorrectly(isCorrect);
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnsweredCorrectly(false);
    } else {
      onGameEnd(score + (answeredCorrectly ? 1 : 0), questions.length);
    }
  };

  const getButtonClass = (index) => {
    const baseClass =
      'w-full p-4 rounded-lg text-left font-semibold transition-all duration-300 transform hover:scale-105';

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
    <div className='bg-white rounded-lg shadow-2xl p-6 md:p-10'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <p className='text-sm text-gray-600'>Player</p>
            <p className='text-xl font-bold text-kenya-red'>{playerName}</p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-gray-600'>Score</p>
            <p className='text-2xl font-bold text-kenya-green'>
              {score} / {questions.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner'>
          <div
            className='bg-gradient-to-r from-kenya-red via-kenya-black to-kenya-green h-full transition-all duration-500 ease-out rounded-full'
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className='text-sm text-gray-600 mt-2 text-center font-semibold'>
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Category Badge */}
      <div className='mb-6'>
        <span className='inline-block px-4 py-2 bg-gradient-to-r from-kenya-green/20 to-kenya-red/20 text-kenya-black border-2 border-kenya-green rounded-md text-sm font-bold shadow-sm'>
          📚 {currentQuestion.category}
        </span>
      </div>

      {/* Question */}
      <div className='mb-8'>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed'>
          {currentQuestion.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className='space-y-3 mb-6'>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(index)}
            disabled={showResult}
            className={getButtonClass(index)}>
            <div className='flex items-center justify-between'>
              <span className='text-lg'>{option}</span>
              {showResult && index === currentQuestion.correctAnswer && (
                <CheckCircle className='w-6 h-6 text-white' />
              )}
              {showResult &&
                index === selectedAnswer &&
                index !== currentQuestion.correctAnswer && (
                  <XCircle className='w-6 h-6 text-white' />
                )}
            </div>
          </button>
        ))}
      </div>

      {/* Result Feedback */}
      {showResult && (
        <div
          className={`p-4 rounded-xl mb-6 ${
            answeredCorrectly
              ? 'bg-green-100 border-2 border-green-500'
              : 'bg-red-100 border-2 border-red-500'
          }`}>
          <p
            className={`text-center font-bold text-lg ${
              answeredCorrectly ? 'text-green-700' : 'text-red-700'
            }`}>
            {answeredCorrectly
              ? '🎉 Correct! Well done!'
              : '❌ Incorrect! Better luck next time!'}
          </p>
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <button
          onClick={handleNextQuestion}
          className='w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-8 rounded-xl font-bold text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl'>
          {currentQuestionIndex < questions.length - 1
            ? 'Next Question ➡️'
            : 'See Results 🏆'}
        </button>
      )}
    </div>
  );
}

export default GameScreen;
