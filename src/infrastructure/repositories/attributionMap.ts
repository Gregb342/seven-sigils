import type { Attribution } from '../../domain/models/types'

const CC_BY_SA_4_LABEL = 'Creative Commons BY-SA 4.0'
const CC_BY_SA_4_URL = 'https://creativecommons.org/licenses/by-sa/4.0/'

export const defaultAttribution = (sourcePageUrl: string): Attribution => ({
  author: 'Evrach',
  sourcePageUrl,
  licenseLabel: CC_BY_SA_4_LABEL,
  licenseUrl: CC_BY_SA_4_URL,
  notes: 'Source: La Garde de Nuit, sauf mention contraire.',
})

export const attributionBySlug: Record<string, Omit<Attribution, 'sourcePageUrl'>> = {
  targaryen: {
    author: 'Evrach',
    licenseLabel: CC_BY_SA_4_LABEL,
    licenseUrl: CC_BY_SA_4_URL,
    notes:
      'Le wiki indique qu\'une partie des meubles peut provenir de sources tierces. Attribution affichée selon la page fichier.',
  },
}
