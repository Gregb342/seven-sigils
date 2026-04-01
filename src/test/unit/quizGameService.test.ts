import { describe, expect, it } from 'vitest'
import { QuizGameService } from '../../application/usecases/quizGameService'
import type { Blazon, Difficulty } from '../../domain/models/types'
import type { BestScoreStore, BlazonRepository, RandomProvider } from '../../domain/ports'

const makeBlazon = (slug: string): Blazon => ({
  id: slug,
  familySlug: slug,
  familyLabel: slug.charAt(0).toUpperCase() + slug.slice(1),
  fileName: `Blason-${slug}-2014-v01-256px.png`,
  imageUrl: `/assets/${slug}.png`,
  housePageUrl: `https://lagardedenuit.com/wiki/index.php?title=Maison_${slug.charAt(0).toUpperCase()}${slug.slice(1)}`,
  hints: [],
  attribution: {
    author: 'Evrach',
    sourcePageUrl: 'https://example.com',
    licenseLabel: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
})

class InMemoryRepository implements BlazonRepository {
  private readonly blazons: Blazon[]

  constructor(blazons: Blazon[]) {
    this.blazons = blazons
  }

  async getAll(): Promise<Blazon[]> {
    return this.blazons
  }

  async getByDifficulty(difficulty: Difficulty): Promise<Blazon[]> {
    void difficulty
    return this.blazons
  }
}

class InMemoryBestScoreStore implements BestScoreStore {
  private score = 0

  getBestScore(): number {
    return this.score
  }

  saveBestScore(score: number): void {
    this.score = score
  }
}

class FixedRandom implements RandomProvider {
  private index = 0

  next(): number {
    const value = ((this.index * 7 + 3) % 97) / 97
    this.index += 1
    return value
  }
}

describe('QuizGameService', () => {
  it('starts, scores correct answer, and ends fixed game', async () => {
    const repository = new InMemoryRepository(
      ['stark', 'lannister', 'targaryen', 'arryn', 'greyjoy', 'bolton'].map(makeBlazon),
    )
    const store = new InMemoryBestScoreStore()
    const game = new QuizGameService(repository, store, new FixedRandom())

    let snapshot = await game.start({ mode: 'fixed', difficulty: 'easy', fixedRounds: 1 })
    expect(snapshot.status).toBe('running')
    expect(snapshot.question).not.toBeNull()

    snapshot = game.answer(snapshot.question!.correctOption)
    expect(snapshot.score).toBe(1)
    expect(snapshot.answerLocked).toBe(true)

    snapshot = await game.nextRound()
    expect(snapshot.status).toBe('finished')
    expect(snapshot.bestScore).toBe(1)
  })

  it('does not repeat blazons in the same running session', async () => {
    const repository = new InMemoryRepository(
      ['stark', 'lannister', 'targaryen', 'arryn', 'greyjoy', 'bolton'].map(makeBlazon),
    )
    const store = new InMemoryBestScoreStore()
    const game = new QuizGameService(repository, store, new FixedRandom())

    let snapshot = await game.start({ mode: 'fixed', difficulty: 'hard', fixedRounds: 6 })
    const seen = new Set<string>()

    while (snapshot.status === 'running' && snapshot.question) {
      expect(seen.has(snapshot.question.blazon.id)).toBe(false)
      seen.add(snapshot.question.blazon.id)

      snapshot = game.answer(snapshot.question.correctOption)
      snapshot = await game.nextRound()
    }

    expect(seen.size).toBe(6)
    expect(snapshot.status).toBe('finished')
  })

  it('caps easy infinite sessions to 30 rounds', async () => {
    const slugs = Array.from({ length: 50 }, (_, index) => `house${index + 1}`)
    const repository = new InMemoryRepository(slugs.map(makeBlazon))
    const store = new InMemoryBestScoreStore()
    const game = new QuizGameService(repository, store, new FixedRandom())

    let snapshot = await game.start({ mode: 'infinite', difficulty: 'easy', fixedRounds: 50 })
    let playedRounds = 0

    while (snapshot.status === 'running' && snapshot.question) {
      playedRounds += 1
      snapshot = game.answer(snapshot.question.correctOption)
      snapshot = await game.nextRound()
    }

    expect(playedRounds).toBe(30)
    expect(snapshot.status).toBe('finished')
  })
})
