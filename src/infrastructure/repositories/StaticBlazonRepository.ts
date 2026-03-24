import type { BlazonRepository } from '../../domain/ports'
import type { Blazon } from '../../domain/models/types'
import { toBlazon } from './blazonParsing'

export class StaticBlazonRepository implements BlazonRepository {
  private cache: Blazon[] | null = null

  async getAll(): Promise<Blazon[]> {
    if (this.cache) {
      return this.cache
    }

    const modules = import.meta.glob('/All Blasons/*.png', {
      eager: true,
      import: 'default',
    }) as Record<string, string>

    const blazons = Object.entries(modules)
      .map(([path, url]) => toBlazon(path, url))
      .filter((item): item is Blazon => item !== null)
      .sort((a, b) => a.familyLabel.localeCompare(b.familyLabel, 'fr'))

    if (blazons.length < 4) {
      throw new Error('Dataset invalide: moins de 4 blasons jouables après filtrage.')
    }

    this.cache = blazons
    return blazons
  }
}
