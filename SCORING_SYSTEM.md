# 🏆 Advanced Scoring System

## Overview
The Kenya Trivia Challenge features a sophisticated multi-factor scoring system that rewards:
- ✅ Knowledge (correct answers)
- ⚡ Speed (time bonuses)
- 🔥 Consistency (streaks)
- 🎯 Precision (difficulty multipliers)

## 🎯 Scoring Components

### 1. **Base Points**
- **100 points** per correct answer
- No penalties for wrong answers
- Questions weighted equally for fairness

### 2. **Time Bonus (0-100 points)**
- **Max Bonus**: 100 points for instant answers
- **Decay**: Linear decrease over time
- **Minimum Time**: 1 second (prevents cheating)
- **Formula**: 
  ```
  timeBonus = max(0, 100 - (timeTaken / maxTime) * 100)
  ```
- **Visual Indicator**: Progress bar shows remaining bonus

### 3. **Streak Multiplier**
- **Starts at 1.0x** (no bonus)
- **+0.1x** for each consecutive correct answer
- **Max 2.5x** at 15+ correct answers
- **Resets to 1.0x** on wrong answer
- **Visual Feedback**: Flaming streak counter

### 4. **Difficulty Multipliers**
| Difficulty | Multiplier | Time Limit | Features |
|------------|------------|------------|----------|
| **Casual** | 1.0x | No limit | Learn at your own pace |
| **Standard** | 1.3x | 30s | Balanced challenge |
| **Expert** | 1.5x | 15s | For trivia masters |
| **Kenyan Pro** | 2.0x | 10s | Ultimate challenge |

### 5. **Special Bonuses**
- **Perfect Game**: +1000 points (100% accuracy)
- **Speed Demon**: +500 points (average < 5s per question)
- **Comeback Kid**: 2x points after 3+ wrong answers
- **Lucky Guess**: Random 100-500 points (5% chance)

## 🏅 Scoring Examples

### Example 1: Standard Difficulty
```
Base: 100 points
Time Bonus: 75/100 (answered in 7.5s)
Streak: 1.4x (4 correct in a row)
Difficulty: 1.3x
Total: (100 + 75) × 1.4 × 1.3 = 318.5 → 319 points
```

### Example 2: Expert Mode Streak
```
Base: 100 points
Time Bonus: 90/100 (answered in 3s)
Streak: 2.0x (10+ correct)
Difficulty: 1.5x
Bonus: Speed Demon (+500)
Total: ((100 + 90) × 2.0 × 1.5) + 500 = 1,070 points
```

### Example 3: Perfect Kenyan Pro Game
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
