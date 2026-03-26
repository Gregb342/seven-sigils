import type { Blazon, Difficulty } from './models/types'

export interface RandomProvider {
  next(): number
}

export interface BlazonRepository {
  getAll(): Promise<Blazon[]>
  getByDifficulty(difficulty: Difficulty): Promise<Blazon[]>
}

export interface BestScoreStore {
  getBestScore(): number
  saveBestScore(score: number): void
}
