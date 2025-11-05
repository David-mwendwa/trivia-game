# Advanced Scoring System

## Overview
The Kenya Trivia Challenge now features a sophisticated multi-factor scoring system that rewards skill, speed, and consistency.

## Scoring Components

### 1. **Base Points**
- **100 points** per correct answer
- Provides a solid foundation for scoring

### 2. **Time Bonus (0-50 points)**
- Awarded for answering quickly
- Uses logarithmic scaling for smooth progression
- Minimum 25% of time remaining required for bonus
- Formula: `bonus = floor(50 × log₂(1 + timePercentage))`

### 3. **Streak Bonus**
- Kicks in after **3 consecutive correct answers**
- **+25 points per question** in the streak
- Maximum multiplier: **2.0x**
- Resets on wrong answer or timeout

### 4. **Difficulty Multipliers**
- **Casual:** 1.0x (standard points, no time limit)
- **Challenge:** 1.3x (30% bonus, 20s per question)
- **Blitz:** 1.5x (50% bonus, 10s per question)

### 5. **Perfect Game Bonus**
- **+500 points** for answering ALL questions correctly
- Only awarded at 100% accuracy

## Scoring Examples

### Example 1: Casual Mode, Normal Speed
- Base: 100 points
- Time bonus: 15 points
- Streak: 0 (first question)
- Difficulty: ×1.0
- **Total: 115 points**

### Example 2: Blitz Mode, Lightning Fast, 5-Question Streak
- Base: 100 points
- Time bonus: 45 points
- Streak: 75 points (3 extra × 25)
- Subtotal: 220 points
- Difficulty: ×1.5
- **Total: 330 points**

### Example 3: Perfect Game (20 questions, Blitz Mode)
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
