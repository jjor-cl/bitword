# BitWord - Bitcoin Word Guessing Game

BitWord is an educational word guessing game focused on Bitcoin terminology. Players learn about Bitcoin concepts, economics, and technical aspects through engaging gameplay across three difficulty levels.

## 🎯 Features

- **Three Difficulty Levels**:
  - **Beginner**: Basic Bitcoin terms (wallet, mining, blockchain, etc.)
  - **Intermediate**: Bitcoin economics and strategy (deflation, hodling, adoption, etc.)
  - **Advanced**: Technical concepts (UTXO, Schnorr, Lightning Network, etc.)

- **Educational Content**: Each word includes detailed definitions, helpful hints, and fun facts
- **Daily Challenges**: One word per difficulty level per day
- **Statistics Tracking**: Win rates, streaks, and average completion times
- **Social Sharing**: Share your results with proper emoji support
- **Replay Prevention**: Completed levels show results instead of allowing replay
- **Extensive Database**: 90 authentic Bitcoin terms across all difficulty levels

## 🚀 Live Demo

[Play BitWord](https://365a861c-2902-480c-9e20-c2ebe5659e89-00-udu34ags80am.picard.replit.dev)

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence
- **Zod** for runtime validation

### Development Tools
- **Vite** for development and building
- **ESBuild** for fast compilation
- **tsx** for TypeScript execution

## 📁 Project Structure

```
bitword/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── pages/          # Page components
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bitword
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/bitword
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=bitword
   PGUSER=your_username
   PGPASSWORD=your_password
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📊 Database Schema

### Tables

- **games**: Stores individual game sessions
- **game_stats**: Tracks player statistics per difficulty
- **bit_words**: Contains all Bitcoin terminology with definitions

### Key Features

- **Daily Game Logic**: Prevents multiple games per difficulty per day
- **Statistics Tracking**: Comprehensive win/loss tracking with streaks
- **Word Management**: Categorized Bitcoin terms with educational content

## 🎮 Game Mechanics

### Hangman-Style Gameplay
- Players guess letters to reveal Bitcoin terms
- 3 wrong attempts allowed per game
- Hints available with point penalties
- Time tracking for performance metrics

### Scoring System
- Base score varies by difficulty level
- Time bonuses for quick solutions
- Penalties for wrong attempts and hint usage
- Difficulty multipliers enhance advanced play

### Educational Focus
- Each word includes definition and context
- Hint system provides learning guidance
- Fun facts enhance Bitcoin knowledge
- Progressive difficulty builds understanding

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Tailwind CSS for utility-first styling

## 🚀 Deployment

### Replit Deployment
This project is optimized for Replit deployment:
1. Import project to Replit
2. Set environment variables in Secrets
3. Run `npm run dev` 
4. Deploy using Replit's deployment feature

### Manual Deployment
1. Build the project: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start the server: `npm start`

## 📈 Features Roadmap

- [ ] User authentication and profiles
- [ ] Leaderboards and competitions
- [ ] More Bitcoin terminology categories
- [ ] Multilingual support
- [ ] Mobile app version
- [ ] Achievement system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Word Database

The game features 90 carefully curated Bitcoin terms:
- **30 Beginner terms**: Basic concepts and terminology
- **30 Intermediate terms**: Economics, strategy, and market concepts  
- **30 Advanced terms**: Technical implementations and protocols

All terms include:
- Accurate definitions
- Educational hints
- Interesting fun facts
- Proper categorization

## 🔒 Security & Privacy

- No personal data collection
- Local statistics storage
- Secure API endpoints
- Input validation and sanitization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bitcoin community for educational resources
- Open source libraries and frameworks
- Replit platform for hosting and development tools

---

**Ready to test your Bitcoin knowledge? Start playing BitWord today!**