import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Blazon } from '../../domain/models/types'
import { EncyclopediaScreen } from '../../presentation/components/EncyclopediaScreen'

const makeBlazon = (overrides: Partial<Blazon> = {}): Blazon => ({
  id: 'dunk',
  familySlug: 'dunk',
  familyLabel: 'Dunk',
  displayName: 'Chevalier Errant Duncan Le Grand',
  fileName: 'Blason-dunk-2014-v01-256px.png',
  imageUrl: '/All Blasons/Blason-dunk-2014-v01-256px.png',
  housePageUrl: 'https://lagardedenuit.com/wiki/index.php?title=Duncan_Le_Grand',
  hints: [
    {
      title: 'Type',
      value: 'Blason personnel, pas une maison hereditaire.',
    },
    {
      title: 'Region',
      value: 'Non attribuee',
    },
  ],
  kind: 'special',
  attribution: {
    author: 'Evrach',
    sourcePageUrl: 'https://example.com/source.png',
    licenseLabel: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  ...overrides,
})

describe('EncyclopediaScreen', () => {
  afterEach(() => {
    cleanup()
  })

  it('finds a blazon by slug and by display name', async () => {
    const user = userEvent.setup()
    const entries = [
      makeBlazon(),
      makeBlazon({
        id: 'stark',
        familySlug: 'stark',
        familyLabel: 'Stark',
        displayName: undefined,
        kind: undefined,
        hints: [{ title: 'Region', value: 'Le Nord' }],
      }),
    ]

    render(
      <EncyclopediaScreen entries={entries} loading={false} error={null} onBack={vi.fn()} />,
    )

    expect(screen.getByText(/2 resultat\(s\)/i)).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: /Rechercher un blason/i }), 'dunk')
    expect(screen.getByText(/Chevalier Errant Duncan Le Grand/i)).toBeInTheDocument()
    expect(screen.getByText(/Slug:/i)).toBeInTheDocument()
    expect(screen.getByText(/Special/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Non attribuee/i).length).toBeGreaterThan(0)

    await user.clear(screen.getByRole('searchbox', { name: /Rechercher un blason/i }))
    await user.type(screen.getByRole('searchbox', { name: /Rechercher un blason/i }), 'duncan')

    expect(screen.getByText(/Chevalier Errant Duncan Le Grand/i)).toBeInTheDocument()
    expect(screen.queryByText(/^Maison Stark$/i)).not.toBeInTheDocument()
  })

  it('groups results by alphabetical sections and paginates after four entries', async () => {
    const user = userEvent.setup()
    const entries = [
      makeBlazon({ id: 'arryn', familySlug: 'arryn', familyLabel: 'Arryn', displayName: undefined, hints: [] }),
      makeBlazon({ id: 'appleton', familySlug: 'appleton', familyLabel: 'Appleton', displayName: undefined, hints: [] }),
      makeBlazon({ id: 'baratheon', familySlug: 'baratheon', familyLabel: 'Baratheon', displayName: undefined, hints: [] }),
      makeBlazon({ id: 'clegane', familySlug: 'clegane', familyLabel: 'Clegane', displayName: undefined, hints: [] }),
      makeBlazon({ id: 'dunk', familySlug: 'dunk', familyLabel: 'Dunk' }),
      makeBlazon({ id: 'stark', familySlug: 'stark', familyLabel: 'Stark', displayName: undefined, hints: [] }),
    ]

    render(
      <EncyclopediaScreen entries={entries} loading={false} error={null} onBack={vi.fn()} />,
    )

    expect(screen.getByRole('heading', { name: 'A', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'B', level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/Page 1 \/ 2/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Page suivante/i }))

    expect(screen.getByText(/Page 2 \/ 2/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'D', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'S', level: 2 })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'A', level: 2 })).not.toBeInTheDocument()
  })

  it('jumps directly to a letter using the alphabetical rail', async () => {
    const user = userEvent.setup()
    const entries = [
      makeBlazon({ id: 'arryn', familySlug: 'arryn', familyLabel: 'Arryn', displayName: undefined, hints: [] }),
      makeBlazon({ id: 'appleton', familySlug: 'appleton', familyLabel: 'Appleton', displayName: undefined, hints: [] }),
      makeBlazon({ id: 'baratheon', familySlug: 'baratheon', familyLabel: 'Baratheon', displayName: undefined, hints: [] }),
      makeBlazon({ id: 'clegane', familySlug: 'clegane', familyLabel: 'Clegane', displayName: undefined, hints: [] }),
      makeBlazon({ id: 'dunk', familySlug: 'dunk', familyLabel: 'Dunk' }),
      makeBlazon({ id: 'stark', familySlug: 'stark', familyLabel: 'Stark', displayName: undefined, hints: [] }),
    ]

    render(
      <EncyclopediaScreen entries={entries} loading={false} error={null} onBack={vi.fn()} />,
    )

    expect(screen.getByText(/Page 1 \/ 2/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Aller a la lettre S/i }))

    expect(screen.getByText(/Page 2 \/ 2/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'S', level: 2 })).toBeInTheDocument()
  })
})
