import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StartScreen } from '../../presentation/components/StartScreen'

describe('StartScreen', () => {
  it('submits selected settings', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn().mockResolvedValue(undefined)

    render(<StartScreen bestScore={12} loading={false} onStart={onStart} />)

    await user.selectOptions(screen.getByLabelText('Mode de jeu'), 'infinite')
    await user.selectOptions(screen.getByLabelText('Difficulté'), 'hard')
    await user.click(screen.getByRole('button', { name: 'Lancer la partie' }))

    expect(onStart).toHaveBeenCalledWith('infinite', 'hard', 10)
    expect(screen.getByText(/Meilleur score local: 12/i)).toBeInTheDocument()
  })
})
