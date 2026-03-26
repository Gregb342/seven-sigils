import type { BlazonRepository, BestScoreStore, RandomProvider } from '../../domain/ports'
import type { GameSettings, RoundResult, SessionSnapshot } from '../../domain/models/types'
import { createQuestion } from './questionFactory'

const RECENT_WINDOW_SIZE = 8

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

  private recentIds: string[]

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
    this.recentIds = []
  }

  getSnapshot(): SessionSnapshot {
    return this.snapshot
  }

  async start(settings: GameSettings): Promise<SessionSnapshot> {
    const pool = await this.repository.getByDifficulty(settings.difficulty)

    this.snapshot = {
      status: 'running',
      settings,
      score: 0,
      bestScore: this.bestScoreStore.getBestScore(),
      roundIndex: 1,
      question: createQuestion(pool, settings.difficulty, this.random, this.recentIds),
      answerLocked: false,
      selectedAnswer: null,
      lastResult: null,
    }

    if (this.snapshot.question) {
      this.trackRecent(this.snapshot.question.blazon.id)
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
    if (isFixedMode && this.snapshot.roundIndex >= this.snapshot.settings.fixedRounds) {
      this.finish()
      return this.snapshot
    }

    const pool = await this.repository.getByDifficulty(this.snapshot.settings.difficulty)
    const nextQuestion = createQuestion(
      pool,
      this.snapshot.settings.difficulty,
      this.random,
      this.recentIds,
    )

    this.trackRecent(nextQuestion.blazon.id)

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

  private trackRecent(id: string): void {
    this.recentIds = [...this.recentIds, id].slice(-RECENT_WINDOW_SIZE)
  }
}

export type { RoundResult }
