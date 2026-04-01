import { useMemo, useState } from 'react'
import type { Difficulty, GameMode, SessionSnapshot } from '../../domain/models/types'
import { QuizGameService } from '../../application/usecases/quizGameService'
import { StaticBlazonRepository } from '../../infrastructure/repositories/StaticBlazonRepository'
import { LocalStorageBestScoreStore } from '../../infrastructure/services/LocalStorageBestScoreStore'
import { MathRandomProvider } from '../../infrastructure/services/MathRandomProvider'

const repository = new StaticBlazonRepository()
const bestScoreStore = new LocalStorageBestScoreStore()
const random = new MathRandomProvider()
const service = new QuizGameService(repository, bestScoreStore, random)

export function useQuizController() {
  const [snapshot, setSnapshot] = useState<SessionSnapshot>(service.getSnapshot())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const actions = useMemo(
    () => ({
      start: async (mode: GameMode, difficulty: Difficulty, fixedRounds: number) => {
        setError(null)
        setLoading(true)
        try {
          const next = await service.start({ mode, difficulty, fixedRounds })
          setSnapshot({ ...next })
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Erreur inconnue')
        } finally {
          setLoading(false)
        }
      },
      answer: (option: string) => {
        const next = service.answer(option)
        setSnapshot({ ...next })
      },
      nextRound: async () => {
        const next = await service.nextRound()
        setSnapshot({ ...next })
      },
      stop: () => {
        const next = service.stop()
        setSnapshot({ ...next })
      },
      goToMenu: () => {
        const next = service.goToMenu()
        setSnapshot({ ...next })
      },
      resetError: () => setError(null),
    }),
    [],
  )

  return {
    snapshot,
    loading,
    error,
    ...actions,
  }
}
