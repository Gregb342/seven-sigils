# Seven Sigils - Heraldry Quiz

An interactive Game of Thrones heraldry quiz game built with **React 19**, **TypeScript**, and **Vite**. Test your knowledge of house sigils from Westeros and Essos with progressive difficulty modes and dynamic hint system.

## Features

✨ **Interactive Quiz Gameplay**
- Identify house sigils from a lineup of 4 options
- Two difficulty modes: Easy (3 rounds) and Hard (5 rounds)
- Two game modes: Fixed-round and Infinite (play as long as you want)
- Real-time score tracking and feedback

🎯 **Smart Hint System**
- Progressive hint reveal for each question
- Wiki-sourced hints: devise, demeure, origine, and more
- Direct links to **La Garde de Nuit** wiki for each house
- Hints reset per question for fair gameplay

📚 **Attribution & Accuracy**
- All images sourced from **La Garde de Nuit** wiki
- Evrach author attribution with Creative Commons BY-SA 4.0 license
- Transparent source linking under each blazon

🏗️ **Production-Grade Architecture**
- **Layered Clean Architecture**: Domain → Application → Infrastructure → Presentation
- Domain-driven design with type-safe models
- Comprehensive unit, integration, and E2E test coverage
- ESLint + TypeScript strict mode for code quality

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run tests
npm run test              # Unit + integration tests
npm run test:e2e          # End-to-end tests (requires playwright)
npm run test:e2e:install  # Install browser dependencies

# Code quality checks
npm run lint              # ESLint + TypeScript
npm run quality           # Lint + all tests
```

## Project Structure

```
src/
├── domain/              # Business logic & type definitions
│   ├── models/          # Blazon, Question, GameSettings types
│   └── services/        # shuffle, familyLabel utilities
├── application/         # Use cases & workflows
│   └── usecases/        # QuizGameService, questionFactory
├── infrastructure/      # Data access & repositories
│   └── repositories/    # blazonParsing, attributionMap, StaticBlazonRepository
├── presentation/        # React components & hooks
│   ├── components/      # StartScreen, GameScreen, EndScreen, CreditsFooter
│   ├── hooks/           # useQuizController state management
│   └── App.tsx          # Root orchestration
└── test/                # Test suites (unit, integration, E2E)
```

## Tech Stack

- **Frontend**: React 19.2.4 + TypeScript 5.9.3
- **Build**: Vite 8.0.1 with HMR support
- **Testing**: Vitest (unit/integration), Playwright (E2E)
- **Linting**: ESLint 9 + typescript-eslint
- **Coverage**: v8 provider (80%+ thresholds)

## Attribution

All heraldic data and images sourced from **La Garde de Nuit** (French Game of Thrones wiki).

- **License**: Creative Commons BY-SA 4.0
- **Primary Author**: Evrach
- **Wiki Link**: https://lagardedenuit.com/

## Development Notes

This project demonstrates:
- Modern React patterns (hooks, functional components)
- Strict TypeScript configuration
- Clean code principles with layered architecture
- Test-driven development practices
- Production-ready error handling and accessibility

## License

MIT (project code) | Creative Commons BY-SA 4.0 (heraldic data & images from La Garde de Nuit wiki)
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
