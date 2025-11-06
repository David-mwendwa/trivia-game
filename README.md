# 🇰🇪 Kenya Trivia Challenge

Jambo! A fun and interactive trivia game built with React, Vite, and Supabase! Test your knowledge about Kenya across multiple categories including Geography, History, Culture, Wildlife, Sports, and Economy. Track your progress across devices with user accounts and cloud sync.

## 🌐 Live Demo

**Play the game here:** [https://david-mwendwa.github.io/trivia-game/](https://david-mwendwa.github.io/trivia-game/)

## ✨ Features

- **100+ Kenya-Themed Questions** across multiple categories and difficulty levels
- **Level Progression System** with 5 distinct levels to master
- **Multiple Difficulty Modes**:
  - Casual: No time limit, standard scoring
  - Challenge: 20s per question, 1.3x score multiplier
  - Blitz: 10s per question, 1.5x score multiplier
- **User Authentication** with email/password and social logins
- **Cross-Device Sync** for game progress and scores
- **Beautiful UI** with Kenya's flag colors and smooth animations
- **Responsive Design** optimized for all screen sizes
- **Detailed Statistics** and performance tracking
- **Star Rating System** (1-5 stars) based on performance

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

1. **Sign up** or log in to track your progress across devices
2. **Select a level** - Start with Level 1 and unlock more as you progress
3. **Choose difficulty**:
   - Casual: No time pressure, perfect for learning
   - Challenge: 20s per question for a 1.3x score boost
   - Blitz: 10s per question for a 1.5x score boost
4. Answer 20 questions about Kenya per level
5. Earn stars based on your accuracy (1-5 stars per level)
6. Complete levels to unlock new challenges
7. Track your progress in your profile
8. Compete for the top spots on the global leaderboard!

## 🏆 Scoring System (Alama)

- **Base Score**: Points for correct answers
- **Time Bonus**: Faster answers earn more points
- **Streak Bonus**: Consecutive correct answers multiply your score
- **Difficulty Multipliers**: 
  - Casual: 1.0x
  - Challenge: 1.3x
  - Blitz: 1.5x
- **Star Ratings**:
  - ★★★★★: 95-100% accuracy
  - ★★★★: 85-94% accuracy
  - ★★★: 75-84% accuracy
  - ★★: 65-74% accuracy
  - ★: 60-64% accuracy
- **Perfect Game Bonus**: 500 bonus points for 100% accuracy

## 📁 Project Structure

```
trivia-game/
├── src/
│   ├── components/
│   │   ├── StartScreen.jsx       # Welcome and user authentication
│   │   ├── LevelSelect.jsx       # Level selection interface
│   │   ├── DifficultyScreen.jsx  # Difficulty mode selection
│   │   ├── GameScreen.jsx        # Main game interface
│   │   ├── ResultsScreen.jsx     # Score and level results
│   │   └── HighScores.jsx        # Global and personal leaderboards
│   ├── data/
│   │   └── questions.json        # Trivia questions database
│   ├── lib/
│   │   └── supabase.js          # Supabase client configuration
│   ├── utils/
│   │   ├── levelSystem.js       # Level progression logic
│   │   ├── scoringSystem.js     # Scoring calculations
│   │   ├── scoresManager.js     # Score submission and retrieval
│   │   └── supabaseUserManager.js # User authentication
│   ├── App.jsx                  # Main app component and routing
│   └── main.jsx                 # App entry point
├── SUPABASE_SETUP.sql           # Database schema and setup
├── SUPABASE_SCORES_SETUP.md     # Score tracking documentation
├── CROSS_DEVICE_SYNC_GUIDE.md   # Sync functionality guide
├── package.json
└── vite.config.js
```

## 🎨 Technologies Used

- **React** - UI library with hooks
- **Vite** - Next-gen frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend services (Auth, Database, Storage)
- **Lucide React** - Beautiful, customizable icons
- **React Router** - Client-side routing
- **Local/Cloud Sync** - Hybrid data persistence

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
