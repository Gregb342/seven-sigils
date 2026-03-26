import type { HouseHint } from '../../domain/models/types'
import db from './blazonDb.json'

export interface BlazonDbEntry {
  label?: string
  kind?: 'family' | 'special' | 'variant'
  variantOf?: string
  includeInHard?: boolean
  housePageUrl?: string
  motto?: string
  domain?: string
  translation?: string
  hints?: HouseHint[]
}

interface BlazonDbSchema {
  easyModeSlugs: string[]
  entries: Record<string, BlazonDbEntry>
}

const blazonDb = db as BlazonDbSchema

export const EASY_MODE_SLUGS: string[] = blazonDb.easyModeSlugs

export function getBlazonDbEntry(slug: string): BlazonDbEntry | undefined {
  return blazonDb.entries[slug]
}
