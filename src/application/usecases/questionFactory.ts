import type { Blazon, Difficulty, Question } from '../../domain/models/types'
import type { RandomProvider } from '../../domain/ports'
import { shuffle } from '../../domain/services/shuffle'

function pickOne<T>(items: T[], random: RandomProvider): T {
  return items[Math.floor(random.next() * items.length)]
}

function hardCandidates(pool: Blazon[], correct: Blazon): Blazon[] {
  const sameInitial = pool.filter((item) => item.familySlug[0] === correct.familySlug[0])
  const similarLength = pool.filter(
    (item) => Math.abs(item.familySlug.length - correct.familySlug.length) <= 2,
  )

  const merged = [...sameInitial, ...similarLength]
  const uniqueById = new Map(merged.map((item) => [item.id, item]))
  return [...uniqueById.values()].filter((item) => item.id !== correct.id)
}

function buildDistractors(
  pool: Blazon[],
  correct: Blazon,
  difficulty: Difficulty,
  random: RandomProvider,
): Blazon[] {
  const base = pool.filter((item) => item.id !== correct.id)
  const preferred = difficulty === 'hard' ? hardCandidates(pool, correct) : base

  const source = preferred.length >= 3 ? preferred : base
  const shuffled = shuffle(source, random)
  return shuffled.slice(0, 3)
}

export function createQuestion(
  pool: Blazon[],
  difficulty: Difficulty,
  random: RandomProvider,
  excludedIds: string[],
): Question {
  if (pool.length < 4) {
    throw new Error('Not enough blazons to generate a question.')
  }

  const targetPool = pool.filter((item) => !excludedIds.includes(item.id))

  if (targetPool.length === 0) {
    throw new Error('No unseen blazons remaining for this session.')
  }

  const correct = pickOne(targetPool, random)
  const distractors = buildDistractors(pool, correct, difficulty, random)

  if (distractors.length < 3) {
    throw new Error('Not enough distractors to generate a question.')
  }

  const options = shuffle(
    [correct.familyLabel, ...distractors.map((item) => item.familyLabel)],
    random,
  )

  return {
    blazon: correct,
    options,
    correctOption: correct.familyLabel,
  }
}
