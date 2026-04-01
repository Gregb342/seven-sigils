import { useRef } from 'react'
import './App.css'
import type { GameSettings } from './domain/models/types'
import { CreditsFooter } from './presentation/components/CreditsFooter'
import { EndScreen } from './presentation/components/EndScreen'
import { GameScreen } from './presentation/components/GameScreen'
import { StartScreen } from './presentation/components/StartScreen'
import { useQuizController } from './presentation/hooks/useQuizController'

function App() {
  const { snapshot, loading, error, start, answer, nextRound, stop, goToMenu, resetError } = useQuizController()
  const lastSettingsRef = useRef<GameSettings>({
    mode: 'fixed',
    difficulty: 'easy',
    fixedRounds: 10,
  })

  const onStart = async (mode: GameSettings['mode'], difficulty: GameSettings['difficulty'], fixedRounds: number) => {
    const maxFixedRounds = difficulty === 'easy' ? 30 : 40
    const safeFixedRounds = Number.isFinite(fixedRounds)
      ? Math.max(5, Math.min(maxFixedRounds, Math.round(fixedRounds)))
      : 10

    const settings: GameSettings = {
      mode,
      difficulty,
      fixedRounds: safeFixedRounds,
    }

    lastSettingsRef.current = settings
    await start(settings.mode, settings.difficulty, settings.fixedRounds)
  }

  const onReplay = async () => {
    const { mode, difficulty, fixedRounds } = lastSettingsRef.current
    await start(mode, difficulty, fixedRounds)
  }

  return (
    <div className="app-shell">
      <main className="main-content">
        {snapshot.status === 'idle' && (
          <StartScreen bestScore={snapshot.bestScore} loading={loading} onStart={onStart} />
        )}

        {snapshot.status === 'running' && (
          <GameScreen
            key={snapshot.question?.blazon.id ?? 'no-question'}
            snapshot={snapshot}
            onAnswer={answer}
            onNext={nextRound}
            onStop={stop}
            onMainMenu={goToMenu}
          />
        )}

        {snapshot.status === 'finished' && (
          <EndScreen snapshot={snapshot} onReplay={onReplay} onMainMenu={goToMenu} />
        )}

        {error && (
          <div className="error-banner" role="alert">
            <p>{error}</p>
            <button type="button" className="ghost-btn" onClick={resetError}>
              Fermer
            </button>
          </div>
        )}
      </main>

      <CreditsFooter />
    </div>
  )
}

export default App
