import type { BlazonRepository } from '../../domain/ports'
import type { Blazon, Difficulty } from '../../domain/models/types'
import { EASY_MODE_SLUGS, getBlazonDbEntry } from '../data/blazonDatabase'
import { extractFamilySlug, isAltVariant, toBlazon } from './blazonParsing'

interface DifficultyPools {
  easy: Blazon[]
  hard: Blazon[]
}

const easySlugSet = new Set(EASY_MODE_SLUGS)

export class StaticBlazonRepository implements BlazonRepository {
  private cache: DifficultyPools | null = null

  async getAll(): Promise<Blazon[]> {
    return this.getByDifficulty('hard')
  }

  async getByDifficulty(difficulty: Difficulty): Promise<Blazon[]> {
    if (!this.cache) {
      this.cache = this.buildPools()
    }

    return this.cache[difficulty]
  }

  private buildPools(): DifficultyPools {
    const modules = import.meta.glob('/All Blasons/*.png', {
      eager: true,
      import: 'default',
    }) as Record<string, string>

    const hard = Object.entries(modules)
      .map(([path, url]) => {
        const fileName = path.split('/').pop() ?? ''
        const slug = extractFamilySlug(fileName)
        if (!slug) {
          return null
        }

        const catalogEntry = getBlazonDbEntry(slug)
        const includeInHard = catalogEntry?.includeInHard ?? !isAltVariant(slug)
        if (!includeInHard) {
          return null
        }

        return toBlazon(path, url, {
          allowAltVariant: includeInHard,
          familyLabel: catalogEntry?.label,
          housePageUrl: catalogEntry?.housePageUrl,
          hints: catalogEntry?.hints,
          kind: catalogEntry?.kind,
          variantOf: catalogEntry?.variantOf,
          motto: catalogEntry?.motto,
          domain: catalogEntry?.domain,
          translation: catalogEntry?.translation,
        })
      })
      .filter((item): item is Blazon => item !== null)
      .sort((a, b) => a.familyLabel.localeCompare(b.familyLabel, 'fr'))

    const easy = hard.filter((item) => easySlugSet.has(item.familySlug))

    if (hard.length < 4) {
      throw new Error('Dataset invalide: moins de 4 blasons jouables en mode difficile.')
    }

    if (easy.length < 4) {
      throw new Error('Dataset invalide: moins de 4 blasons jouables en mode facile.')
    }

    return { easy, hard }
  }
}
