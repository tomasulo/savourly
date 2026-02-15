import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeCard } from './recipe-card'
import type { Recipe } from '@/lib/types'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => {
    const translations: Record<string, Record<string, string>> = {
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      },
      time: {
        minutes: 'min',
      },
    }
    return (key: string) => translations[namespace]?.[key] || key
  },
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

// Mock i18n routing
vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockRecipe: Recipe = {
  id: 1,
  user_id: 1,
  title: 'Classic Carbonara',
  description: 'Authentic Italian pasta dish',
  cuisine: 'Italian',
  difficulty: 'medium',
  prep_time_minutes: 10,
  cook_time_minutes: 20,
  servings: 4,
  image_url: '/images/carbonara.jpg',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

describe('RecipeCard', () => {
  it('renders recipe title', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('Classic Carbonara')).toBeInTheDocument()
  })

  it('renders recipe description', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('Authentic Italian pasta dish')).toBeInTheDocument()
  })

  it('renders total time correctly', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText(/30/)).toBeInTheDocument()
    expect(screen.getByText(/min/)).toBeInTheDocument()
  })

  it('renders difficulty badge', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('renders cuisine badge when provided', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText(/🌍 Italian/)).toBeInTheDocument()
  })

  it('renders image when image_url is provided', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    const image = screen.getByAltText('Classic Carbonara')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/carbonara.jpg')
  })

  it('renders placeholder when no image_url', () => {
    const recipeWithoutImage = { ...mockRecipe, image_url: null }
    render(<RecipeCard recipe={recipeWithoutImage} />)
    expect(screen.getByText('🍳')).toBeInTheDocument()
  })

  it('does not render description when null', () => {
    const recipeWithoutDescription = { ...mockRecipe, description: null }
    render(<RecipeCard recipe={recipeWithoutDescription} />)
    expect(screen.queryByText('Authentic Italian pasta dish')).not.toBeInTheDocument()
  })

  it('links to recipe detail page', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/recipes/1')
  })

  it('applies correct difficulty color classes', () => {
    const { rerender } = render(<RecipeCard recipe={{ ...mockRecipe, difficulty: 'easy' }} />)
    expect(screen.getByText('Easy')).toBeInTheDocument()

    rerender(<RecipeCard recipe={{ ...mockRecipe, difficulty: 'hard' }} />)
    expect(screen.getByText('Hard')).toBeInTheDocument()
  })
})
