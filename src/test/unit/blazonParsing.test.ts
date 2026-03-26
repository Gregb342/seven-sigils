import { describe, expect, it } from 'vitest'
import {
  buildSourcePageUrl,
  isAltVariant,
  toBlazon,
} from '../../infrastructure/repositories/blazonParsing'

describe('blazonParsing', () => {
  it('detects alt variants and excludes them', () => {
    expect(isAltVariant('alt')).toBe(true)
    expect(isAltVariant('alt7')).toBe(true)
    expect(isAltVariant('cendregue-alt')).toBe(true)
    expect(isAltVariant('dalt')).toBe(false)
  })

  it('builds source page URL', () => {
    const url = buildSourcePageUrl('Blason-targaryen-2014-v01-256px.png')
    expect(url).toContain('title=Fichier:Blason-targaryen-2014-v01-256px.png')
  })

  it('parses valid blazon and includes known author when available', () => {
    const blazon = toBlazon(
      '/All Blasons/Blason-targaryen-2014-v01-256px.png',
      '/assets/targaryen.png',
    )

    expect(blazon).not.toBeNull()
    expect(blazon?.familySlug).toBe('targaryen')
    expect(blazon?.attribution.author).toBe('Evrach')
    expect(blazon?.housePageUrl).toContain('Maison_Targaryen')
    expect(blazon?.hints.length).toBeGreaterThan(0)
  })

  it('uses Evrach as default author metadata for standard blazons', () => {
    const blazon = toBlazon('/All Blasons/Blason-stark-2014-v01-256px.png', '/assets/stark.png')
    expect(blazon?.attribution.author).toBe('Evrach')
  })

  it('returns null for alt variants', () => {
    const blazon = toBlazon('/All Blasons/Blason-alt-2014-v01-256px.png', '/assets/alt.png')
    expect(blazon).toBeNull()
  })

  it('can include alt variants when explicitly allowed', () => {
    const blazon = toBlazon('/All Blasons/Blason-alt-2014-v01-256px.png', '/assets/alt.png', {
      allowAltVariant: true,
      familyLabel: 'Alt',
    })
    expect(blazon).not.toBeNull()
    expect(blazon?.familySlug).toBe('alt')
  })
})
