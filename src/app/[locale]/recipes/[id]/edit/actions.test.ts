import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { updateRecipe, deleteRecipe } from './actions'
import { getDb } from '@/db/index'
import type { Client } from '@libsql/client'

// Mock the database module
vi.mock('@/db/index', () => ({
  getDb: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

describe('Recipe Edit Actions', () => {
  let mockDb: {
    execute: ReturnType<typeof vi.fn>
    batch: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockDb = {
      execute: vi.fn().mockResolvedValue({ rows: [], columns: [] }),
      batch: vi.fn().mockResolvedValue([]),
    }

    vi.mocked(getDb).mockResolvedValue(mockDb as unknown as Client)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('updateRecipe', () => {
    it('should update recipe with valid data', async () => {
      const formData = new FormData()
      formData.set('title', 'Updated Carbonara')
      formData.set('description', 'Updated description')
      formData.set('cuisine', 'Italian')
      formData.set('difficulty', 'medium')
      formData.set('prep_time_minutes', '15')
      formData.set('cook_time_minutes', '25')
      formData.set('servings', '6')
      formData.set('image_url', 'https://example.com/updated.jpg')
      formData.append('ingredient_name', 'Pasta')
      formData.append('ingredient_amount', '400')
      formData.append('ingredient_unit', 'g')
      formData.append('instruction', 'Cook pasta')

      try {
        await updateRecipe(1, {}, formData)
      } catch (error) {
        // Expected redirect error
        expect((error as Error).message).toBe('REDIRECT:/recipes/1')
      }

      // Verify batch was called with update and delete statements
      expect(mockDb.batch).toHaveBeenCalled()
      const batchCalls = mockDb.batch.mock.calls[0][0]

      // Check that batch includes UPDATE, DELETE ingredients, DELETE instructions
      expect(batchCalls).toHaveLength(3)
      expect(batchCalls[0].sql).toContain('UPDATE recipes')
      expect(batchCalls[1].sql).toContain('DELETE FROM ingredients')
      expect(batchCalls[2].sql).toContain('DELETE FROM instructions')

      // Verify second batch call for inserts
      expect(mockDb.batch).toHaveBeenCalledTimes(3) // update/delete batch + ingredients batch + instructions batch
    })

    it('should return error when title is missing', async () => {
      const formData = new FormData()
      formData.set('title', '')
      formData.append('ingredient_name', 'Pasta')
      formData.append('instruction', 'Cook')

      const result = await updateRecipe(1, {}, formData)

      expect(result.error).toBe('Title is required.')
      expect(mockDb.batch).not.toHaveBeenCalled()
    })

    it('should return error when difficulty is invalid', async () => {
      const formData = new FormData()
      formData.set('title', 'Test Recipe')
      formData.set('difficulty', 'invalid')
      formData.append('ingredient_name', 'Pasta')
      formData.append('instruction', 'Cook')

      const result = await updateRecipe(1, {}, formData)

      expect(result.error).toBe('Invalid difficulty level.')
      expect(mockDb.batch).not.toHaveBeenCalled()
    })

    it('should return error when no ingredients provided', async () => {
      const formData = new FormData()
      formData.set('title', 'Test Recipe')
      formData.append('ingredient_name', '')
      formData.append('instruction', 'Cook')

      const result = await updateRecipe(1, {}, formData)

      expect(result.error).toBe('At least one ingredient is required.')
      expect(mockDb.batch).not.toHaveBeenCalled()
    })

    it('should return error when no instructions provided', async () => {
      const formData = new FormData()
      formData.set('title', 'Test Recipe')
      formData.append('ingredient_name', 'Pasta')
      formData.append('instruction', '')

      const result = await updateRecipe(1, {}, formData)

      expect(result.error).toBe('At least one instruction step is required.')
      expect(mockDb.batch).not.toHaveBeenCalled()
    })

    it('should handle multiple ingredients and instructions', async () => {
      const formData = new FormData()
      formData.set('title', 'Test Recipe')
      formData.append('ingredient_name', 'Pasta')
      formData.append('ingredient_amount', '400')
      formData.append('ingredient_unit', 'g')
      formData.append('ingredient_name', 'Cheese')
      formData.append('ingredient_amount', '100')
      formData.append('ingredient_unit', 'g')
      formData.append('instruction', 'Boil pasta')
      formData.append('instruction', 'Add cheese')

      try {
        await updateRecipe(1, {}, formData)
      } catch (error) {
        expect((error as Error).message).toBe('REDIRECT:/recipes/1')
      }

      expect(mockDb.batch).toHaveBeenCalled()
    })

    it('should handle optional fields as null', async () => {
      const formData = new FormData()
      formData.set('title', 'Test Recipe')
      formData.append('ingredient_name', 'Pasta')
      formData.append('instruction', 'Cook')

      try {
        await updateRecipe(1, {}, formData)
      } catch (error) {
        expect((error as Error).message).toBe('REDIRECT:/recipes/1')
      }

      expect(mockDb.batch).toHaveBeenCalled()
    })
  })

  describe('deleteRecipe', () => {
    it('should delete recipe and redirect to recipe list', async () => {
      try {
        await deleteRecipe(1)
      } catch (error) {
        expect((error as Error).message).toBe('REDIRECT:/recipes')
      }

      expect(mockDb.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining('DELETE FROM recipes WHERE id = ?'),
        args: [1],
      })
    })

    it('should handle different recipe IDs', async () => {
      try {
        await deleteRecipe(42)
      } catch (error) {
        expect((error as Error).message).toBe('REDIRECT:/recipes')
      }

      expect(mockDb.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining('DELETE FROM recipes WHERE id = ?'),
        args: [42],
      })
    })
  })
})
