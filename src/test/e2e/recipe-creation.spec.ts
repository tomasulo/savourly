import { test, expect } from '@playwright/test'

test.describe('Recipe Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
  })

  test('should navigate to recipe creation page', async ({ page }) => {
    await page.goto('/en/recipes/new')
    await expect(page).toHaveURL('/en/recipes/new')
  })

  test('should create a new recipe successfully', async ({ page }) => {
    await page.goto('/en/recipes/new')

    // Fill basic info
    await page.fill('#title', 'E2E Test Carbonara')
    await page.fill('#description', 'A delicious pasta dish tested by E2E')
    await page.fill('#image_url', 'https://example.com/carbonara.jpg')

    // Fill metadata
    await page.fill('#prep_time_minutes', '10')
    await page.fill('#cook_time_minutes', '20')
    await page.fill('#servings', '4')

    // Fill first ingredient
    const ingredientAmountInputs = page.locator('input[name="ingredient_amount"]')
    const ingredientUnitInputs = page.locator('input[name="ingredient_unit"]')
    const ingredientNameInputs = page.locator('input[name="ingredient_name"]')

    await ingredientAmountInputs.nth(0).fill('400')
    await ingredientUnitInputs.nth(0).fill('g')
    await ingredientNameInputs.nth(0).fill('Spaghetti')

    // Add another ingredient
    await page.click('text=+ Ingredient')
    await ingredientAmountInputs.nth(1).fill('200')
    await ingredientUnitInputs.nth(1).fill('g')
    await ingredientNameInputs.nth(1).fill('Guanciale')

    // Fill first instruction
    const instructionInputs = page.locator('textarea[name="instruction"]')
    await instructionInputs.nth(0).fill('Boil pasta in salted water')

    // Add another instruction
    await page.click('text=+ Step')
    await instructionInputs.nth(1).fill('Fry guanciale until crispy')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for navigation to recipe detail page
    await page.waitForURL(/\/en\/recipes\/\d+/)

    // Verify we're on the recipe detail page
    await expect(page.locator('h1')).toContainText('E2E Test Carbonara')
  })

  test('should show validation error for empty title', async ({ page }) => {
    await page.goto('/en/recipes/new')

    // Fill only ingredient and instruction (skip title)
    const ingredientNameInputs = page.locator('input[name="ingredient_name"]')
    await ingredientNameInputs.nth(0).fill('Pasta')

    const instructionInputs = page.locator('textarea[name="instruction"]')
    await instructionInputs.nth(0).fill('Cook pasta')

    // Submit form
    await page.click('button[type="submit"]')

    // Should still be on the form page (browser validation prevents submission)
    await expect(page).toHaveURL('/en/recipes/new')
  })

  test('should allow adding and removing ingredients', async ({ page }) => {
    await page.goto('/en/recipes/new')

    // Initially 1 ingredient row
    let ingredientRows = page.locator('input[name="ingredient_name"]')
    await expect(ingredientRows).toHaveCount(1)

    // Add 2 more ingredients
    await page.click('text=+ Ingredient')
    await page.click('text=+ Ingredient')

    // Now should have 3
    ingredientRows = page.locator('input[name="ingredient_name"]')
    await expect(ingredientRows).toHaveCount(3)

    // Remove one (click the × button in the last row)
    const removeButtons = page.locator('button[aria-label="Delete"]')
    await removeButtons.last().click()

    // Should have 2 now
    ingredientRows = page.locator('input[name="ingredient_name"]')
    await expect(ingredientRows).toHaveCount(2)
  })

  test('should allow adding and removing instructions', async ({ page }) => {
    await page.goto('/en/recipes/new')

    // Initially 1 instruction
    let instructionRows = page.locator('textarea[name="instruction"]')
    await expect(instructionRows).toHaveCount(1)

    // Add 2 more instructions
    await page.click('text=+ Step')
    await page.click('text=+ Step')

    // Now should have 3
    instructionRows = page.locator('textarea[name="instruction"]')
    await expect(instructionRows).toHaveCount(3)

    // Remove one
    const removeButtons = page
      .locator('textarea[name="instruction"]')
      .locator('..')
      .locator('button[aria-label="Delete"]')
    await removeButtons.last().click()

    // Should have 2 now
    instructionRows = page.locator('textarea[name="instruction"]')
    await expect(instructionRows).toHaveCount(2)
  })

  test('should preserve form data while adding ingredients', async ({ page }) => {
    await page.goto('/en/recipes/new')

    // Fill title
    await page.fill('#title', 'Test Recipe')

    // Fill first ingredient
    const ingredientNameInputs = page.locator('input[name="ingredient_name"]')
    await ingredientNameInputs.nth(0).fill('First Ingredient')

    // Add another ingredient
    await page.click('text=+ Ingredient')

    // Verify first ingredient is still there
    await expect(ingredientNameInputs.nth(0)).toHaveValue('First Ingredient')

    // Verify title is still there
    await expect(page.locator('#title')).toHaveValue('Test Recipe')
  })
})
