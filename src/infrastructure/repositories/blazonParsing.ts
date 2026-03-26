import type { Attribution, Blazon, HouseHint } from '../../domain/models/types'
import { toFamilyLabel } from '../../domain/services/familyLabel'
import { getBlazonDbEntry } from '../data/blazonDatabase'
import { attributionBySlug, defaultAttribution } from './attributionMap'

const FILE_PATTERN = /^Blason-(.+)-2014-v01-256px\.png$/i

interface ToBlazonOptions {
  allowAltVariant?: boolean
  familyLabel?: string
  housePageUrl?: string
  hints?: HouseHint[]
  kind?: Blazon['kind']
  variantOf?: string
  motto?: string
  domain?: string
  translation?: string
}

export function extractFileName(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1]
}

export function isAltVariant(slug: string): boolean {
  return slug === 'alt' || /^alt\d*$/.test(slug) || slug.endsWith('-alt')
}

export function extractFamilySlug(fileName: string): string | null {
  const matches = fileName.match(FILE_PATTERN)
  if (!matches) {
    return null
  }

  return matches[1]
}

export function buildSourcePageUrl(fileName: string): string {
  return `https://lagardedenuit.com/wiki/index.php?title=Fichier:${encodeURIComponent(fileName)}`
}

export function buildHousePageUrl(familyLabel: string): string {
  return `https://lagardedenuit.com/wiki/index.php?title=Maison_${familyLabel.replace(/\s+/g, '_')}`
}

export function buildAttribution(slug: string, sourcePageUrl: string): Attribution {
  const mapped = attributionBySlug[slug]
  if (mapped) {
    return {
      ...mapped,
      sourcePageUrl,
    }
  }

  return defaultAttribution(sourcePageUrl)
}

export function toBlazon(filePath: string, imageUrl: string, options: ToBlazonOptions = {}): Blazon | null {
  const fileName = extractFileName(filePath)
  const familySlug = extractFamilySlug(fileName)

  if (!familySlug) {
    return null
  }

  if (!options.allowAltVariant && isAltVariant(familySlug)) {
    return null
  }

  const dbEntry = getBlazonDbEntry(familySlug)

  const familyLabel = options.familyLabel ?? dbEntry?.label ?? toFamilyLabel(familySlug)
  const sourcePageUrl = buildSourcePageUrl(fileName)
  const housePageUrl = options.housePageUrl ?? dbEntry?.housePageUrl ?? buildHousePageUrl(familyLabel)

  return {
    id: familySlug,
    familySlug,
    familyLabel,
    fileName,
    imageUrl,
    housePageUrl,
    hints: options.hints ?? dbEntry?.hints ?? [],
    kind: options.kind ?? dbEntry?.kind,
    variantOf: options.variantOf ?? dbEntry?.variantOf,
    motto: options.motto ?? dbEntry?.motto,
    domain: options.domain ?? dbEntry?.domain,
    translation: options.translation ?? dbEntry?.translation,
    attribution: buildAttribution(familySlug, sourcePageUrl),
  }
}
