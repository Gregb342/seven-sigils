import type { BlazonRepository, BestScoreStore, RandomProvider } from '../../domain/ports'
import type { GameSettings, RoundResult, SessionSnapshot } from '../../domain/models/types'
import { createQuestion } from './questionFactory'

const EASY_MODE_MAX_ROUNDS = 30

const defaultSettings: GameSettings = {
  mode: 'fixed',
  difficulty: 'easy',
  fixedRounds: 10,
}

export class QuizGameService {
  private readonly repository: BlazonRepository

  private readonly bestScoreStore: BestScoreStore

  private readonly random: RandomProvider

  private snapshot: SessionSnapshot

  private seenIds: Set<string>

  private sessionMaxRounds: number

  constructor(repository: BlazonRepository, bestScoreStore: BestScoreStore, random: RandomProvider) {
    this.repository = repository
    this.bestScoreStore = bestScoreStore
    this.random = random
    this.snapshot = {
      status: 'idle',
      settings: defaultSettings,
      score: 0,
      bestScore: this.bestScoreStore.getBestScore(),
      roundIndex: 0,
      question: null,
      answerLocked: false,
      selectedAnswer: null,
      lastResult: null,
    }
    this.seenIds = new Set<string>()
    this.sessionMaxRounds = 0
  }

  getSnapshot(): SessionSnapshot {
    return this.snapshot
  }

  async start(settings: GameSettings): Promise<SessionSnapshot> {
    const pool = await this.repository.getByDifficulty(settings.difficulty)
    this.seenIds = new Set<string>()
    this.sessionMaxRounds =
      settings.difficulty === 'easy' ? Math.min(EASY_MODE_MAX_ROUNDS, pool.length) : pool.length

    const effectiveSettings: GameSettings = {
      ...settings,
      fixedRounds:
        settings.mode === 'fixed'
          ? Math.min(settings.fixedRounds, this.sessionMaxRounds)
          : settings.fixedRounds,
    }

    const firstQuestion = createQuestion(
      pool,
      effectiveSettings.difficulty,
      this.random,
      [...this.seenIds],
    )
    this.markSeen(firstQuestion.blazon.id)

    this.snapshot = {
      status: 'running',
      settings: effectiveSettings,
      score: 0,
      bestScore: this.bestScoreStore.getBestScore(),
      roundIndex: 1,
      question: firstQuestion,
      answerLocked: false,
      selectedAnswer: null,
      lastResult: null,
    }

    return this.snapshot
  }

  answer(option: string): SessionSnapshot {
    if (this.snapshot.status !== 'running' || this.snapshot.answerLocked || !this.snapshot.question) {
      return this.snapshot
    }

    const isCorrect = option === this.snapshot.question.correctOption
    const nextScore = isCorrect ? this.snapshot.score + 1 : this.snapshot.score

    this.snapshot = {
      ...this.snapshot,
      score: nextScore,
      selectedAnswer: option,
      answerLocked: true,
      lastResult: {
        isCorrect,
        correctOption: this.snapshot.question.correctOption,
      },
    }

    return this.snapshot
  }

  async nextRound(): Promise<SessionSnapshot> {
    if (this.snapshot.status !== 'running') {
      return this.snapshot
    }

    if (!this.snapshot.answerLocked) {
      return this.snapshot
    }

    const isFixedMode = this.snapshot.settings.mode === 'fixed'
    const hasReachedRoundLimit = isFixedMode
      ? this.snapshot.roundIndex >= this.snapshot.settings.fixedRounds
      : this.snapshot.roundIndex >= this.sessionMaxRounds

    if (hasReachedRoundLimit) {
      this.finish()
      return this.snapshot
    }

    const pool = await this.repository.getByDifficulty(this.snapshot.settings.difficulty)
    let nextQuestion
    try {
      nextQuestion = createQuestion(
        pool,
        this.snapshot.settings.difficulty,
        this.random,
        [...this.seenIds],
      )
    } catch {
      this.finish()
      return this.snapshot
    }

    this.markSeen(nextQuestion.blazon.id)

    this.snapshot = {
      ...this.snapshot,
      roundIndex: this.snapshot.roundIndex + 1,
      question: nextQuestion,
      answerLocked: false,
      selectedAnswer: null,
      lastResult: null,
    }

    return this.snapshot
  }

  stop(): SessionSnapshot {
    if (this.snapshot.status === 'running') {
      this.finish()
    }

    return this.snapshot
  }

  goToMenu(): SessionSnapshot {
    this.seenIds.clear()
    this.sessionMaxRounds = 0

    this.snapshot = {
      status: 'idle',
      settings: this.snapshot.settings,
      score: 0,
      bestScore: this.bestScoreStore.getBestScore(),
      roundIndex: 0,
      question: null,
      answerLocked: false,
      selectedAnswer: null,
      lastResult: null,
    }

    return this.snapshot
  }

  private finish(): void {
    const best = Math.max(this.snapshot.score, this.snapshot.bestScore)
    if (best > this.snapshot.bestScore) {
      this.bestScoreStore.saveBestScore(best)
    }

    this.snapshot = {
      ...this.snapshot,
      status: 'finished',
      bestScore: best,
    }
  }

  private markSeen(id: string): void {
    this.seenIds.add(id)
  }
}

export type { RoundResult }
