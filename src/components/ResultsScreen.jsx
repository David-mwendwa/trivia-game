import { useEffect, useRef } from 'react';
import {
  Trophy,
  Star,
  RotateCcw,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Home,
} from 'lucide-react';
import {
  calculateAccuracy,
  formatScore,
  getPerformanceColor,
} from '../utils/scoringSystem';
import { updateLevelProgress, isLevelPassed } from '../utils/levelSystem';
import { saveScore } from '../utils/scoresManager';

function ResultsScreen({
  playerName,
  score,
  totalQuestions,
  correctAnswers = 0,
  difficulty = 'casual',
  onRestart,
  currentUser,
  levelId,
  onNextLevel,
  onBackToLevels,
}) {
  const hasSaved = useRef(false);

  // Ensure correct answers never exceeds total questions
  const validCorrectAnswers = Math.min(correctAnswers, totalQuestions);

  // Calculate sophisticated accuracy metrics
  const accuracy = calculateAccuracy(validCorrectAnswers, totalQuestions);
  const percentage = Math.min(accuracy.percentage, 100); // Cap at 100%

  useEffect(() => {
    // Prevent duplicate saves (React StrictMode runs twice)
    if (hasSaved.current) return;
    hasSaved.current = true;

    // Update level progress
    updateLevelProgress(
      levelId,
      score,
      percentage,
      validCorrectAnswers,
      totalQuestions
    );

    // Save score to Supabase (also saves to localStorage as fallback)
    const saveToDB = async () => {
      try {
        const result = await saveScore({
          playerName,
          levelId,
          score,
          percentage,
          correctAnswers: validCorrectAnswers,
          totalQuestions,
          difficulty
        });
        
        if (result.success) {
          console.log('✅ Score saved to Supabase successfully');
        } else {
          console.warn('⚠️ Score saved to localStorage only:', result.error);
        }
      } catch (error) {
        console.error('❌ Error saving score:', error);
      }
    };
    
    saveToDB();
  }, []);

  const getPerformanceMessage = () => {
    return {
      text: `${accuracy.rating}! ${accuracy.grade}`,
      emoji:
        accuracy.stars >= 5
          ? '🎉'
          : accuracy.stars >= 4
          ? '😄'
          : accuracy.stars >= 3
          ? '😊'
          : accuracy.stars >= 2
          ? '😐'
          : '😅',
      color: getPerformanceColor(percentage),
    };
  };

  const performance = getPerformanceMessage();

  // Render stars
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 sm:w-6 sm:h-6 inline ${
          i < accuracy.stars
            ? 'text-yellow-500 fill-yellow-500'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className='bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 transform animate-bounce-subtle touch-manipulation select-none'>
      <div className='text-center'>
        {/* Trophy Icon */}
        <div className='flex justify-center mb-4 sm:mb-6'>
          <Trophy
            className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${performance.color} animate-pulse-slow`}
          />
        </div>

        {/* Performance Message */}
        <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2'>
          {performance.text}
        </h1>
        <p className='text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6'>
          {performance.emoji}
        </p>

        {/* Player Name */}
        <p className='text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8'>
          Great game,{' '}
          <span className='font-bold text-kenya-green'>{playerName}</span>! 🇰🇪
        </p>

        {/* Stars Rating */}
        <div className='mb-4 sm:mb-6'>{renderStars()}</div>

        {/* Grade Badge */}
        <div className='inline-block mb-4 sm:mb-6'>
          <div className='bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg'>
            <p className='text-2xl sm:text-3xl font-bold'>
              Grade: {accuracy.grade}
            </p>
          </div>
        </div>

        {/* Score Display */}
        <div className='bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-2 border-kenya-green rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
            <div className='flex flex-col items-center'>
              <Zap className='w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2' />
              <p className='text-xs sm:text-sm text-gray-600 mb-1'>
                Total Score
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-purple-600'>
                {formatScore(score)}
              </p>
            </div>

            <div className='flex flex-col items-center'>
              <TrendingUp className='w-6 h-6 sm:w-8 sm:h-8 text-kenya-green mb-2' />
              <p className='text-xs sm:text-sm text-gray-600 mb-1'>Accuracy</p>
              <p className='text-2xl sm:text-3xl font-bold text-kenya-green'>
                {percentage}%
              </p>
            </div>

            <div className='flex flex-col items-center'>
              <Trophy className='w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mb-2' />
              <p className='text-xs sm:text-sm text-gray-600 mb-1'>
                Correct Answers
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-yellow-600'>
                {validCorrectAnswers}/{totalQuestions}
              </p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className='bg-kenya-green/10 border-2 border-kenya-green rounded-lg p-3 sm:p-4 mb-6 sm:mb-8'>
          <p className='text-xs sm:text-sm text-kenya-black font-semibold'>
            💡 <strong>Performance:</strong> {accuracy.rating} - You answered{' '}
            {validCorrectAnswers} questions correctly about Kenya!
            {percentage === 100 && " You're a true Kenya Expert! 🎓🇰🇪"}
            {percentage >= 80 &&
              percentage < 100 &&
              ' Outstanding performance! 🌟'}
            {percentage < 80 && ` Keep practicing to improve your score! 🚀`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='space-y-3 sm:space-y-4'>
          {/* Next Level button (only if passed) */}
          {isLevelPassed(percentage) && (
            <button
              onClick={onNextLevel}
              className='w-full bg-gradient-to-r from-kenya-green to-kenya-black text-white py-4 px-6 sm:px-8 rounded-lg font-bold text-lg sm:text-xl hover:from-kenya-black hover:to-kenya-green transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 touch-manipulation min-h-[56px]'>
              Next Level
              <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6' />
            </button>
          )}

          <button
            onClick={onRestart}
            className='w-full bg-gradient-to-r from-kenya-red to-kenya-green text-white py-4 px-6 sm:px-8 rounded-lg font-bold text-lg sm:text-xl hover:from-kenya-green hover:to-kenya-red transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 touch-manipulation min-h-[56px]'>
            <RotateCcw className='w-5 h-5 sm:w-6 sm:h-6' />
            Retry Level
          </button>

          {/* Back to Level Select */}
          <button
            onClick={onBackToLevels}
            className='w-full bg-gray-200 text-gray-800 py-3 px-6 sm:px-8 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-300 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center justify-center gap-3 touch-manipulation min-h-[44px]'>
            <Home className='w-4 h-4 sm:w-5 sm:h-5' />
            Level Select
          </button>
        </div>

        {/* Encouragement */}
        <p className='mt-4 sm:mt-6 text-gray-500 text-xs sm:text-sm font-semibold'>
          {isLevelPassed(percentage) ? (
            <>✅ Level Complete! Your progress has been saved! 🎯🇰🇪</>
          ) : (
            <>❌ Need 60% or higher to unlock next level. Try again! 💪🇰🇪</>
          )}
        </p>
      </div>
    </div>
  );
}

export default ResultsScreen;
