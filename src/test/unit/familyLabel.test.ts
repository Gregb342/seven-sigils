import { describe, expect, it } from 'vitest'
import { toFamilyLabel } from '../../domain/services/familyLabel'

describe('toFamilyLabel', () => {
  it('capitalizes each slug segment', () => {
    expect(toFamilyLabel('greyjoy')).toBe('Greyjoy')
    expect(toFamilyLabel('filsduguerrier')).toBe('Filsduguerrier')
    expect(toFamilyLabel('tournebaie')).toBe('Tournebaie')
  })

  it('handles compound slugs', () => {
    expect(toFamilyLabel('aemon-rivers')).toBe('Aemon Rivers')
  })
})
