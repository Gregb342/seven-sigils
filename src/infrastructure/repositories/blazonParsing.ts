import type { Attribution, Blazon } from '../../domain/models/types'
import { toFamilyLabel } from '../../domain/services/familyLabel'
import { attributionBySlug, defaultAttribution, hintsBySlug } from './attributionMap'

const FILE_PATTERN = /^Blason-(.+)-2014-v01-256px\.png$/i

export function extractFileName(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1]
}

export function isAltVariant(slug: string): boolean {
  return slug === 'alt' || /^alt\d*$/.test(slug) || slug.endsWith('-alt')
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

export function toBlazon(filePath: string, imageUrl: string): Blazon | null {
  const fileName = extractFileName(filePath)
  const matches = fileName.match(FILE_PATTERN)

  if (!matches) {
    return null
  }

  const familySlug = matches[1]
  if (isAltVariant(familySlug)) {
    return null
  }

  const familyLabel = toFamilyLabel(familySlug)
  const sourcePageUrl = buildSourcePageUrl(fileName)
  const housePageUrl = buildHousePageUrl(familyLabel)

  return {
    id: familySlug,
    familySlug,
    familyLabel,
    fileName,
    imageUrl,
    housePageUrl,
    hints: hintsBySlug[familySlug] ?? [],
    attribution: buildAttribution(familySlug, sourcePageUrl),
  }
}
