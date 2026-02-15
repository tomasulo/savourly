import { test, expect } from '@playwright/test'

test.describe('Recipe Editing Flow', () => {
  let recipeId: string

  test.beforeEach(async ({ page }) => {
    // Create a recipe to edit
    await page.goto('/en/recipes/new')

    // Fill basic info
    await page.fill('#title', 'Recipe to Edit')
    await page.fill('#description', 'Original description')
    await page.fill('#cuisine', 'Italian')
    await page.fill('#prep_time_minutes', '10')
    await page.fill('#cook_time_minutes', '20')
    await page.fill('#servings', '4')

    // Fill ingredient
    const ingredientNameInputs = page.locator('input[name="ingredient_name"]')
    await ingredientNameInputs.nth(0).fill('Original Ingredient')

    // Fill instruction
    const instructionInputs = page.locator('textarea[name="instruction"]')
    await instructionInputs.nth(0).fill('Original instruction')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for navigation to recipe detail page
    await page.waitForURL(/\/en\/recipes\/\d+/)

    // Extract recipe ID from URL
    const url = page.url()
    const match = url.match(/\/recipes\/(\d+)/)
    recipeId = match ? match[1] : ''
  })

  test('should navigate to edit page from recipe detail', async ({ page }) => {
    // Click Edit button
    await page.click('text=Edit')

    // Should be on edit page
    await expect(page).toHaveURL(`/en/recipes/${recipeId}/edit`)
    await expect(page.locator('h1')).toContainText('Edit Recipe')
  })

  test('should pre-populate form with existing recipe data', async ({ page }) => {
    await page.goto(`/en/recipes/${recipeId}/edit`)

    // Verify title is pre-filled
    await expect(page.locator('#title')).toHaveValue('Recipe to Edit')

    // Verify description is pre-filled
    await expect(page.locator('#description')).toHaveValue('Original description')

    // Verify cuisine is pre-filled
    await expect(page.locator('#cuisine')).toHaveValue('Italian')

    // Verify times are pre-filled
    await expect(page.locator('#prep_time_minutes')).toHaveValue('10')
    await expect(page.locator('#cook_time_minutes')).toHaveValue('20')

    // Verify servings is pre-filled
    await expect(page.locator('#servings')).toHaveValue('4')

    // Verify ingredient is pre-filled
    const ingredientNameInputs = page.locator('input[name="ingredient_name"]')
    await expect(ingredientNameInputs.nth(0)).toHaveValue('Original Ingredient')

    // Verify instruction is pre-filled
    const instructionInputs = page.locator('textarea[name="instruction"]')
    await expect(instructionInputs.nth(0)).toHaveValue('Original instruction')
  })

  test('should update recipe successfully', async ({ page }) => {
    await page.goto(`/en/recipes/${recipeId}/edit`)

    // Modify title
    await page.fill('#title', 'Updated Recipe Title')

    // Modify description
    await page.fill('#description', 'Updated description')

    // Modify times
    await page.fill('#prep_time_minutes', '15')
    await page.fill('#cook_time_minutes', '25')

    // Modify first ingredient
    const ingredientNameInputs = page.locator('input[name="ingredient_name"]')
    await ingredientNameInputs.nth(0).fill('Updated Ingredient')

    // Add a second ingredient
    await page.click('text=+ Ingredient')
    const ingredientAmountInputs = page.locator('input[name="ingredient_amount"]')
    const ingredientUnitInputs = page.locator('input[name="ingredient_unit"]')
    await ingredientAmountInputs.nth(1).fill('100')
    await ingredientUnitInputs.nth(1).fill('g')
    await ingredientNameInputs.nth(1).fill('New Ingredient')

    // Modify instruction
    const instructionInputs = page.locator('textarea[name="instruction"]')
    await instructionInputs.nth(0).fill('Updated instruction')

    // Add a second instruction
    await page.click('text=+ Step')
    await instructionInputs.nth(1).fill('New instruction step')

    // Submit form
    await page.click('button[type="submit"]:has-text("Save")')

    // Should redirect to recipe detail page
    await page.waitForURL(`/en/recipes/${recipeId}`)

    // Verify updated content is displayed
    await expect(page.locator('h1')).toContainText('Updated Recipe Title')
    await expect(page.locator('text=Updated description')).toBeVisible()
    await expect(page.locator('text=15 min')).toBeVisible()
    await expect(page.locator('text=25 min')).toBeVisible()
    await expect(page.locator('text=Updated Ingredient')).toBeVisible()
    await expect(page.locator('text=New Ingredient')).toBeVisible()
    await expect(page.locator('text=Updated instruction')).toBeVisible()
    await expect(page.locator('text=New instruction step')).toBeVisible()
  })

  test('should cancel editing and go back', async ({ page }) => {
    await page.goto(`/en/recipes/${recipeId}/edit`)

    // Modify title
    await page.fill('#title', 'Should Not Save')

    // Click Cancel
    await page.click('text=Cancel')

    // Should go back to recipe detail page
    await page.waitForURL(`/en/recipes/${recipeId}`)

    // Title should not be changed
    await expect(page.locator('h1')).toContainText('Recipe to Edit')
    await expect(page.locator('h1')).not.toContainText('Should Not Save')
  })

  test('should show validation error for empty title', async ({ page }) => {
    await page.goto(`/en/recipes/${recipeId}/edit`)

    // Clear title
    await page.fill('#title', '')

    // Submit form
    await page.click('button[type="submit"]:has-text("Save")')

    // Should still be on edit page (browser validation prevents submission)
    await expect(page).toHaveURL(`/en/recipes/${recipeId}/edit`)
  })

  test('should delete recipe with confirmation', async ({ page }) => {
    await page.goto(`/en/recipes/${recipeId}/edit`)

    // Set up dialog handler to accept confirmation
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm')
      expect(dialog.message()).toContain('Recipe to Edit')
      await dialog.accept()
    })

    // Click Delete button
    await page.click('text=Delete')

    // Should redirect to recipe list
    await page.waitForURL('/en/recipes')
    await expect(page).toHaveURL('/en/recipes')
  })

  test('should not delete recipe when confirmation is cancelled', async ({ page }) => {
    await page.goto(`/en/recipes/${recipeId}/edit`)

    // Set up dialog handler to dismiss confirmation
    page.on('dialog', async (dialog) => {
      await dialog.dismiss()
    })

    // Click Delete button
    await page.click('text=Delete')

    // Should still be on edit page
    await expect(page).toHaveURL(`/en/recipes/${recipeId}/edit`)

    // Navigate to recipe detail to verify it still exists
    await page.goto(`/en/recipes/${recipeId}`)
    await expect(page.locator('h1')).toContainText('Recipe to Edit')
  })

  test('should allow adding and removing ingredients during edit', async ({ page }) => {
    await page.goto(`/en/recipes/${recipeId}/edit`)

    // Should have 1 ingredient initially
    let ingredientRows = page.locator('input[name="ingredient_name"]')
    await expect(ingredientRows).toHaveCount(1)

    // Add 2 more ingredients
    await page.click('text=+ Ingredient')
    await page.click('text=+ Ingredient')

    // Should have 3 now
    ingredientRows = page.locator('input[name="ingredient_name"]')
    await expect(ingredientRows).toHaveCount(3)

    // Remove one
    const removeButtons = page.locator('button[aria-label="Delete"]')
    await removeButtons.nth(2).click()

    // Should have 2 now
    ingredientRows = page.locator('input[name="ingredient_name"]')
    await expect(ingredientRows).toHaveCount(2)
  })

  test('should allow adding and removing instructions during edit', async ({ page }) => {
    await page.goto(`/en/recipes/${recipeId}/edit`)

    // Should have 1 instruction initially
    let instructionRows = page.locator('textarea[name="instruction"]')
    await expect(instructionRows).toHaveCount(1)

    // Add 2 more instructions
    await page.click('text=+ Step')
    await page.click('text=+ Step')

    // Should have 3 now
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

  test('should handle image URL update', async ({ page }) => {
    await page.goto(`/en/recipes/${recipeId}/edit`)

    // Add image URL
    await page.fill('#image_url', 'https://example.com/new-image.jpg')

    // Submit form
    await page.click('button[type="submit"]:has-text("Save")')

    // Wait for redirect
    await page.waitForURL(`/en/recipes/${recipeId}`)

    // Verify image is displayed (check for img element with the src)
    const image = page.locator('img[alt="Recipe to Edit"]')
    await expect(image).toBeVisible()
  })
})
