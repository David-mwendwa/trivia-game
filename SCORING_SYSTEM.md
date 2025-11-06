# Advanced Scoring System

## Overview
The Kenya Trivia Challenge features a sophisticated multi-factor scoring system that rewards accuracy, speed, and consistency across multiple difficulty levels and game modes. This document details how scores are calculated and how players can maximize their performance.

## Scoring Components

### 1. **Base Points**
- **100 points** per correct answer
- Only awarded for correct answers
- Provides the foundation for all other score calculations

### 2. **Time Bonus (0-50 points)**
- **Awarded for** answering quickly in Challenge and Blitz modes
- **Calculation**: `bonus = floor(50 × log₂(1 + timePercentage))`
- **Minimum 25%** of time remaining required for any bonus
- **Time Percentage** is calculated based on remaining time vs total time
- **Maximum Bonus**: 50 points (for answering instantly)
- **Not available** in Casual mode

### 3. **Streak Bonus**
- **Activation**: After 3 consecutive correct answers
- **Bonus**: +25 points per question in the streak
- **Maximum Multiplier**: 2.0x (capped at 8+ consecutive correct answers)
- **Resets** on:
  - Incorrect answer
  - Timeout
  - Starting a new game
- **Visual Indicator**: Streak counter shows current multiplier

### 4. **Difficulty Multipliers**
- **Casual Mode (1.0x)**
  - No time limit
  - Standard scoring
  - Perfect for learning and practice
  
- **Challenge Mode (1.3x)**
  - 20 seconds per question
  - 30% score multiplier
  - Time bonus available
  
- **Blitz Mode (1.5x)**
  - 10 seconds per question
  - 50% score multiplier
  - Maximum time bonus potential
  - For expert players

### 5. **Perfect Game Bonus**
- **+500 points** for 100% accuracy
- Only awarded when all questions in a level are answered correctly
- Stackable with other bonuses
- Special visual recognition in results

## Scoring Examples

### Example 1: Casual Mode (No Time Bonus)
- Base: 100 points
- Time bonus: 0 (not applicable)
- Streak: 0 (first question)
- Difficulty: ×1.0
- **Total: 100 points**

### Example 2: Challenge Mode with Streak
- Base: 100 points
- Time bonus: 35 points (answered in 5s)
- Streak: 50 points (5-question streak)
- Subtotal: 185 points
- Difficulty: ×1.3
- **Total: 240.5 points (rounded down to 240)**

### Example 3: Blitz Mode Perfect Game
- Base: 20 × 100 = 2000 points
- Average Time Bonus: 40 × 20 = 800 points
- Streak Bonus: 25 × 15 = 375 points (15 extra from streak)
- Perfect Game Bonus: 500 points
- Subtotal: 3675 points
- Difficulty: ×1.5
- **Final Score: 5,512 points**
- **Rating**: ★★★★★ (100% accuracy)
- Average per question: ~250 points
- 20 questions: ~5,000 points
- Perfect bonus: +500 points
- **Total: ~5,500 points**

## Accuracy Grading

### Grade Scale
| Percentage | Grade | Rating | Stars |
|------------|-------|--------|-------|
| 100% | A+ | Perfect | ⭐⭐⭐⭐⭐ |
| 90-99% | A | Excellent | ⭐⭐⭐⭐⭐ |
| 80-89% | B+ | Very Good | ⭐⭐⭐⭐ |
| 70-79% | B | Good | ⭐⭐⭐⭐ |
| 60-69% | C+ | Above Average | ⭐⭐⭐ |
| 50-59% | C | Average | ⭐⭐⭐ |
| 40-49% | D | Below Average | ⭐⭐ |
| 0-39% | F | Needs Improvement | ⭐ |

## Performance Ratings
Based on total score across all questions:

- **Master:** 3,000+ points
- **Expert:** 2,000-2,999 points
- **Advanced:** 1,000-1,999 points
- **Intermediate:** 500-999 points
- **Beginner:** 0-499 points

## Visual Feedback

### During Game
- **Real-time score display** with formatted numbers (e.g., "2,450")
- **Streak indicator** appears after 3+ consecutive correct answers
- **Score breakdown** shown after each answer:
  - Base points
  - Speed bonus (if earned)
  - Streak bonus (if applicable)
  - Difficulty multiplier

### Results Screen
- **Star rating** (1-5 stars)
- **Letter grade** (F to A+)
- **Performance rating** (text description)
- **Detailed statistics:**
  - Total score (formatted)
  - Accuracy percentage
  - Correct answers count

## Strategy Tips

1. **Speed Matters:** Answer quickly for time bonuses
2. **Build Streaks:** 3+ correct answers unlock streak bonuses
3. **Choose Wisely:** Higher difficulty = higher rewards
4. **Aim for Perfect:** 100% accuracy earns a massive bonus

## Technical Implementation

- Uses `scoringSystem.js` utility module
- Logarithmic time bonus prevents exploitation
- Streak tracking with state management
- Grade calculation with multiple metrics
- Formatted score display with thousands separators
