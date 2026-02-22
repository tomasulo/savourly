import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeCard } from './recipe-card'
import type { RecipeListItem } from '@/lib/types'

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
      recipe: {
        private: 'Private',
        public: 'Public',
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

const mockRecipe: RecipeListItem = {
  id: 1,
  user_id: '1',
  title: 'Classic Carbonara',
  description: 'Authentic Italian pasta dish',
  tags: ['dinner'],
  difficulty: 'medium',
  prep_time_minutes: 10,
  cook_time_minutes: 20,
  servings: 4,
  image_url: '/images/carbonara.jpg',
  is_public: 1,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  is_own: true,
  is_favorited: false,
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

  it('renders tag badge when tags provided', () => {
    const { container } = render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.getByText('dinner')).toBeInTheDocument()
    // Verify there's a Tag icon near the tag badge
    const icon = container.querySelector('.lucide-tag')
    expect(icon).toBeInTheDocument()
  })

  it('renders image when image_url is provided', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    const image = screen.getByAltText('Classic Carbonara')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/carbonara.jpg')
  })

  it('renders placeholder icon when no image_url', () => {
    const recipeWithoutImage = { ...mockRecipe, image_url: null }
    const { container } = render(<RecipeCard recipe={recipeWithoutImage} />)
    // Check for the SVG icon instead of emoji
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
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

  it('shows lock badge for private recipes', () => {
    const privateRecipe = { ...mockRecipe, is_public: 0 }
    render(<RecipeCard recipe={privateRecipe} />)
    expect(screen.getByText('Private')).toBeInTheDocument()
  })

  it('does not show lock badge for public recipes', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    expect(screen.queryByText('Private')).not.toBeInTheDocument()
  })

  it('shows bookmark icon when is_favorited is true', () => {
    const favoritedRecipe = { ...mockRecipe, is_favorited: true }
    const { container } = render(<RecipeCard recipe={favoritedRecipe} />)
    const bookmarkIcon = container.querySelector('.lucide-bookmark')
    expect(bookmarkIcon).toBeInTheDocument()
  })

  it('does not show bookmark icon when not favorited', () => {
    const { container } = render(<RecipeCard recipe={mockRecipe} />)
    const bookmarkIcon = container.querySelector('.lucide-bookmark')
    expect(bookmarkIcon).not.toBeInTheDocument()
  })
})
