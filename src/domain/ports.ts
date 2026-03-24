import type { Blazon } from './models/types'

export interface RandomProvider {
  next(): number
}

export interface BlazonRepository {
  getAll(): Promise<Blazon[]>
}

export interface BestScoreStore {
  getBestScore(): number
  saveBestScore(score: number): void
}
