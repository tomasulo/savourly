import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './search-bar'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      search: 'Search recipes...',
    }
    return translations[key] || key
  },
}))

// Mock i18n routing
const mockReplace = vi.fn()
const mockPathname = '/recipes'
const mockSearchParams = new URLSearchParams()

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => mockPathname,
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}))

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input', () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText('Search recipes...')
    expect(input).toBeInTheDocument()
  })

  it('renders search icon', () => {
    const { container } = render(<SearchBar />)
    // Check for the SVG icon instead of emoji
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('updates input value when user types', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('Search recipes...')
    await user.type(input, 'pasta')

    expect(input).toHaveValue('pasta')
  })

  it('debounces search and updates URL', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('Search recipes...')
    await user.type(input, 'pasta')

    // Should not call immediately
    expect(mockReplace).not.toHaveBeenCalled()

    // Should call after debounce delay (400ms)
    await waitFor(
      () => {
        expect(mockReplace).toHaveBeenCalledWith('/recipes?q=pasta')
      },
      { timeout: 500 }
    )
  })

  it('clears search param when input is emptied', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('Search recipes...')

    // Type something
    await user.type(input, 'pasta')
    await waitFor(() => expect(mockReplace).toHaveBeenCalled(), { timeout: 500 })

    // Clear the input
    await user.clear(input)

    await waitFor(
      () => {
        const lastCall = mockReplace.mock.calls[mockReplace.mock.calls.length - 1]
        expect(lastCall[0]).toBe('/recipes?')
      },
      { timeout: 500 }
    )
  })

  it('initializes with empty value when no search param', () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText('Search recipes...')
    expect(input).toHaveValue('')
  })
})
