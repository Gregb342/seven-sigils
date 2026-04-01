import { describe, expect, it } from 'vitest'
import type { Blazon } from '../../domain/models/types'
import type { RandomProvider } from '../../domain/ports'
import { createQuestion } from '../../application/usecases/questionFactory'

class SequenceRandom implements RandomProvider {
  private index = 0
  private readonly sequence: number[]

  constructor(sequence: number[]) {
    this.sequence = sequence
  }

  next(): number {
    const value = this.sequence[this.index % this.sequence.length]
    this.index += 1
    return value
  }
}

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

const pool = ['stark', 'lannister', 'targaryen', 'arryn', 'greyjoy', 'bolton'].map(makeBlazon)

describe('createQuestion', () => {
  it('returns exactly four options with one correct answer', () => {
    const random = new SequenceRandom([0.11, 0.2, 0.3, 0.4, 0.6, 0.8])
    const question = createQuestion(pool, 'easy', random, [])

    expect(question.options).toHaveLength(4)
    expect(new Set(question.options).size).toBe(4)
    expect(question.options).toContain(question.correctOption)
  })

  it('never picks an excluded blazon as the correct answer', () => {
    const random = new SequenceRandom([0.01, 0.21, 0.31, 0.41, 0.51])
    const excludedIds = ['stark', 'lannister']
    const question = createQuestion(pool, 'hard', random, excludedIds)

    expect(excludedIds).not.toContain(question.blazon.id)
  })
})
