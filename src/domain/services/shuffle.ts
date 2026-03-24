import type { RandomProvider } from '../ports'

export function shuffle<T>(items: T[], random: RandomProvider): T[] {
  const clone = [...items]

  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random.next() * (i + 1))
    ;[clone[i], clone[j]] = [clone[j], clone[i]]
  }

  return clone
}
