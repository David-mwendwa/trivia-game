# 🇰🇪 Kenya Trivia Challenge

Jambo! A fun and interactive trivia game built with React and Vite! Test your knowledge about Kenya across multiple categories including Geography, History, Culture, Wildlife, Sports, and Economy.

## ✨ Features

- **20 Kenya-Themed Questions** across multiple categories
- **Beautiful Kenya Flag Colors** (Black, Red, Green, White) throughout the UI
- **Swahili & English Text** for authentic Kenyan experience
- **High Score Tracking** using localStorage (Alama Bora)
- **Real-time Score Updates** with progress tracking
- **Visual Feedback** for correct and incorrect answers
- **Responsive Design** that works on all devices
- **Randomized Questions** for variety in each game
- **Modern Animations** with smooth transitions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. Enter your name (Jina Lako) on the start screen
2. Click "Anza Mchezo" (Start Game) to begin
3. Answer 20 questions about Kenya
4. Click on your answer choice
5. Get instant feedback on whether you're correct
6. Click "Swali Lijalo" (Next) to continue
7. View your final score with Swahili phrases
8. Try to beat your high score and become a Kenya Expert! 🇰🇪

## 🏆 Scoring System (Alama)

- Each correct answer earns 1 point
- Final score is displayed as points and percentage (Usahihi)
- High scores are automatically saved (Alama Bora)
- Top 10 scores are displayed on the leaderboard
- Performance messages in both Swahili and English

## 📁 Project Structure

```
trivia-game/
├── src/
│   ├── components/
│   │   ├── StartScreen.jsx      # Welcome screen
│   │   ├── GameScreen.jsx       # Main game interface
│   │   ├── ResultsScreen.jsx    # Score results
│   │   └── HighScores.jsx       # Leaderboard
│   ├── data/
│   │   └── questions.json       # Trivia questions database
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **localStorage** - High score persistence

## 🔧 Customization

### Adding More Questions

Edit `src/data/questions.json` to add more questions:

```json
{
  "id": 16,
  "question": "Your question here?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0,
  "category": "Category Name"
}
```

### Modifying Styles

The app uses Tailwind CSS. You can customize colors and styles by editing:
- `tailwind.config.js` - Theme configuration
- Component files - Individual component styles

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎉 Furahia! (Enjoy!)

Have fun testing your knowledge about Kenya and competing for the highest score! Learn about Kenya's rich history, diverse culture, amazing wildlife, and beautiful geography while playing! 🇰🇪🦁🌍
