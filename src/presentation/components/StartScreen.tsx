import { useState } from 'react'
import type { Difficulty, GameMode } from '../../domain/models/types'

interface StartScreenProps {
  bestScore: number
  loading: boolean
  onStart: (mode: GameMode, difficulty: Difficulty, fixedRounds: number) => Promise<void>
}

export function StartScreen({ bestScore, loading, onStart }: StartScreenProps) {
  const [mode, setMode] = useState<GameMode>('fixed')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [fixedRounds, setFixedRounds] = useState(10)

  return (
    <section className="card intro-card" aria-labelledby="title">
      <p className="eyebrow">Quiz de Blasons</p>
      <h1 id="title">Reconnais les grandes familles de Westeros</h1>
      <p className="intro-text">
        A chaque manche, identifie le blason correct parmi 4 maisons.
      </p>

      <div className="settings-grid">
        <label>
          Mode
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as GameMode)}
            aria-label="Mode de jeu"
          >
            <option value="fixed">Partie fixe</option>
            <option value="infinite">Partie infinie</option>
          </select>
        </label>

        <label>
          Difficulté
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as Difficulty)}
            aria-label="Difficulté"
          >
            <option value="easy">Facile</option>
            <option value="hard">Difficile</option>
          </select>
        </label>

        <label>
          Manches (mode fixe)
          <input
            type="number"
            min={5}
            max={40}
            value={fixedRounds}
            onChange={(event) => setFixedRounds(Number.parseInt(event.target.value, 10) || 10)}
            aria-label="Nombre de manches"
            disabled={mode !== 'fixed'}
          />
        </label>
      </div>

      <button
        type="button"
        className="primary-btn"
        onClick={() => onStart(mode, difficulty, fixedRounds)}
        disabled={loading}
      >
        {loading ? 'Chargement...' : 'Lancer la partie'}
      </button>

      <p className="best-score">Meilleur score local: {bestScore}</p>
    </section>
  )
}
