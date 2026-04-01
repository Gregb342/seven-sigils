import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { SessionSnapshot } from '../../domain/models/types'
import { GameScreen } from '../../presentation/components/GameScreen'

const snapshot: SessionSnapshot = {
  status: 'running',
  settings: { mode: 'fixed', difficulty: 'easy', fixedRounds: 10 },
  score: 3,
  bestScore: 7,
  roundIndex: 2,
  answerLocked: false,
  selectedAnswer: null,
  lastResult: null,
  question: {
    blazon: {
      id: 'stark',
      familySlug: 'stark',
      familyLabel: 'Stark',
      fileName: 'Blason-stark-2014-v01-256px.png',
      imageUrl: '/All Blasons/Blason-stark-2014-v01-256px.png',
      housePageUrl: 'https://lagardedenuit.com/wiki/index.php?title=Maison_Stark',
      hints: [{ title: 'Origine', value: 'Le Nord.' }],
      attribution: {
        author: 'Evrach',
        sourcePageUrl:
          'https://lagardedenuit.com/wiki/index.php?title=Fichier:Blason-stark-2014-v01-256px.png',
        licenseLabel: 'Creative Commons BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
    options: ['Stark', 'Lannister', 'Targaryen', 'Baratheon'],
    correctOption: 'Stark',
  },
}

describe('GameScreen', () => {
  it('hides source links before submitting an answer', () => {
    render(
      <GameScreen
        snapshot={snapshot}
        onAnswer={vi.fn()}
        onNext={vi.fn().mockResolvedValue(undefined)}
        onStop={vi.fn()}
        onMainMenu={vi.fn()}
      />,
    )

    expect(screen.queryByRole('link', { name: /source fichier/i })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /article La Garde de Nuit/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getAllByRole('button', {
        name: /Maison Stark|Maison Lannister|Maison Targaryen|Maison Baratheon/,
      }),
    ).toHaveLength(4)
    expect(screen.getByRole('button', { name: /Afficher un indice/i })).toBeInTheDocument()
  })

  it('shows source links after submitting an answer', () => {
    const lockedSnapshot: SessionSnapshot = {
      ...snapshot,
      answerLocked: true,
      selectedAnswer: 'Lannister',
      lastResult: { isCorrect: false, correctOption: 'Stark' },
    }

    render(
      <GameScreen
        snapshot={lockedSnapshot}
        onAnswer={vi.fn()}
        onNext={vi.fn().mockResolvedValue(undefined)}
        onStop={vi.fn()}
        onMainMenu={vi.fn()}
      />,
    )

    expect(screen.getByText(/Auteur: Evrach/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /source fichier/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /article La Garde de Nuit/i })).toBeInTheDocument()
  })
})
