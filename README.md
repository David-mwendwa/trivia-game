# 🇰🇪 Kenya Trivia Challenge

Jambo! A fun and interactive trivia game built with React and Vite! Test your knowledge about Kenya across multiple categories including Geography, History, Culture, Wildlife, Sports, and Economy. Now with enhanced mobile experience and advanced scoring system!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 🌎 Live Demo

**Play the game here:** [https://david-mwendwa.github.io/trivia-game/](https://david-mwendwa.github.io/trivia-game/)

## ✨ Features

### 👍 Core Gameplay
- **🎯 100+ Questions** across 6+ categories
- **🎓 Multiple Difficulty Levels** from Casual to Kenyan Pro
- **🕒 Timed Challenges** with dynamic scoring
- **📈 Progress Tracking** with detailed statistics
- **💰 In-Game Currency** for unlocking special features

### 💻 Technical Highlights
- **📱 Mobile-First Design** with perfect touch targets (44px+)
- **🕹️ Offline Support** with intelligent caching
- **📡 Real-time Multiplayer** (coming soon)
- **🔍 Advanced Search** by category, difficulty, and tags
- **📜 Comprehensive Documentation** for developers

### 🔮 Smart Features
- **🔑 Cross-Device Sync** using Supabase
- **📈 Performance Analytics** with custom dashboards
- **🛠️ Dark/Light Mode** with system preference detection
- **🛡️ Keyboard Shortcuts** for power users
- **👤 User Profiles** with avatars and achievements

## 🚀 Getting Started

### 📖 Prerequisites

- Node.js (v16.14.0 or higher)
- npm (v8.3.1 or higher) or yarn (v1.22.0 or higher)
- Git (for version control)

### 🛠️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/David-mwendwa/trivia-game.git
   cd trivia-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in your browser**
   ```
   http://localhost:5173
   ```

### 🐛 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate test coverage report
npm run test:coverage
```

## 🏁 How to Play

### 💬 Basic Gameplay
1. **📝 Register/Login** - Create an account or sign in to track your progress
2. **🎮 Select Difficulty** - Choose from 4 difficulty levels
3. **📓 Answer Questions** - Test your knowledge of Kenya
4. **📈 Track Progress** - Watch your score and stats in real-time
5. **🏆 Earn Badges** - Unlock achievements as you play

### 📋 Game Modes

#### 🎯 Classic Mode
- 20 questions per round
- Timer-based scoring
- Progressive difficulty

#### 🔥 Survival Mode
- Answer until you get one wrong
- Increasing difficulty
- Global leaderboards

#### 📊 Challenge Mode
- Custom question sets
- Time attack challenges
- Weekly special events

## 🏆 Advanced Scoring System

### 📈 Score Components
- **Base Points**: 100 per correct answer
- **Time Bonus**: Up to 100 additional points based on speed
- **Streak Multiplier**: Up to 2.5x for consecutive correct answers
- **Difficulty Bonus**: Up to 2.0x multiplier for harder levels
- **Comeback Kid**: 2x points after 3+ wrong answers
- **Lucky Guess**: Random 100-500 points (5% chance)

> 📝 For detailed scoring rules, see [SCORING_SYSTEM.md](SCORING_SYSTEM.md)

## 📜 Project Structure

```
trivia-game/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # Reusable UI components
│   │   ├── auth/               # Authentication components
│   │   ├── game/               # Game-specific components
│   │   └── ui/                 # General UI components
│   ├── context/                # React context providers
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── pages/                  # Page components
│   │   ├── Home.jsx            # Landing page
│   │   ├── Game.jsx            # Main game screen
│   │   └── Profile.jsx         # User profile
│   ├── services/               # API services
│   │   ├── supabase.js         # Supabase client
│   │   └── questions.js        # Question management
│   ├── styles/                 # Global styles
│   ├── utils/                  # Helper functions
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # App entry point
├── .env.example               # Environment variables example
├── .eslintrc.js               # ESLint config
├── .gitignore                 # Git ignore file
├── index.html                 # HTML template
├── package.json               # Project dependencies
├── postcss.config.js          # PostCSS config
├── README.md                  # This file
└── vite.config.js             # Vite configuration
```

## 🖥️ Tech Stack

### Frontend
- **⚙️ React 18** - UI library with hooks
- **⚡ Vite 4** - Next-gen frontend tooling
- **💄 Tailwind CSS** - Utility-first CSS framework
- **🛠️ Framer Motion** - Smooth animations
- **🛡️ React Router** - Client-side routing

### Backend
- **💻 Supabase** - Authentication & database
- **📈 PostgreSQL** - Relational database
- **👥 Row Level Security** - Data protection
- **📡 Realtime Subscriptions** - Live updates

### Development Tools
- **🛠️ ESLint** - Code quality
- **🐟 Prettier** - Code formatting
- **🔮 TypeScript** - Type checking
- **🛠️ Jest & Testing Library** - Testing

## 💻 Development

### 📝 Adding Questions

1. **Single Question**
   ```json
   {
     "id": "unique-id",
     "question": "What is the capital of Kenya?",
     "options": ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
     "correctAnswer": 0,
     "category": "Geography",
     "difficulty": "easy",
     "tags": ["capital", "cities"],
     "explanation": "Nairobi has been Kenya's capital since 1907."
   }
   ```

2. **Bulk Import**
   Use the `scripts/import-questions.js` script to import from CSV/JSON.

### 🎨 Theming

Customize the look and feel by editing:
- `tailwind.config.js` - Theme colors and variants
- `src/styles/theme.css` - CSS variables
- `src/components/ui/ThemeProvider.jsx` - Theme switching logic

### 🚧 Environment Variables

Create a `.env` file with:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎉 Furahia! (Enjoy!)

Have fun testing your knowledge about Kenya and competing for the highest score! Learn about Kenya's rich history, diverse culture, amazing wildlife, and beautiful geography while playing! 🇰🇪🦁🌍

## 👋 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚙️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm test` - Run tests

## 📑 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ❤️ Acknowledgements

- [Open Trivia DB](https://opentdb.com/) - For the question database
- [Kenya National Archives](https://www.kenyarchives.go.ke/) - For historical references
- [Unsplash](https://unsplash.com/) - For beautiful Kenyan photography

## 👋 Connect

- [GitHub](https://github.com/David-mwendwa)
- [Twitter](https://twitter.com/yourhandle)
- [LinkedIn](https://linkedin.com/in/yourprofile)

## 🎉 Furahia! (Enjoy!)

We hope you enjoy playing the Kenya Trivia Challenge as much as we enjoyed building it! Whether you're a Kenya expert or just starting to learn, there's always something new to discover about this amazing country. 🇰🇪

> "Travel is the only thing you buy that makes you richer." - Anonymous
