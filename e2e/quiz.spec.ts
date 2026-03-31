import { expect, test } from '@playwright/test'

test('can start a game and see credits with source', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /Quiz des blasons/i })).toBeVisible()
  await expect(page.getByText(/Creative Commons BY-SA 4.0/i)).toBeVisible()

  await page.getByRole('button', { name: /Lancer la partie/i }).click()

  await expect(page.getByRole('img', { name: /Blason de la maison/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /source fichier/i })).toBeVisible()
  await expect(page.getByText(/Auteur:/i)).toBeVisible()
})
