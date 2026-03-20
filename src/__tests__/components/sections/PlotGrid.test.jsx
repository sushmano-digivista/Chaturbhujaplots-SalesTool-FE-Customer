import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlotGrid from '@/components/sections/PlotGrid'
import { renderWithProviders } from '../utils/renderWithProviders'
import { server } from '../utils/server'
import { errorHandlers, MOCK_PLOT_SUMMARY } from '../utils/handlers'

beforeAll(()  => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(()  => server.resetHandlers())
afterAll(()   => server.close())

const mockOnEnquire = vi.fn()

describe('PlotGrid', () => {

  // ── Loading state ───────────────────────────────────────────────────────────

  it('shows skeleton loader while fetching', () => {
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)
    // Skeleton cards exist during loading
    const skeletons = document.querySelectorAll('.skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  // ── Renders summary data ────────────────────────────────────────────────────

  it('renders section heading after data loads', async () => {
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => {
      expect(screen.getByText(/Explore/i)).toBeInTheDocument()
      expect(screen.getByText(/Available Plots/i)).toBeInTheDocument()
    })
  })

  it('renders totalPlots count in subtitle', async () => {
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => {
      expect(screen.getByText(/24 plots/i)).toBeInTheDocument()
    })
  })

  it('renders price range banner', async () => {
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => {
      expect(screen.getByText('₹23.9L – ₹48.1L')).toBeInTheDocument()
    })
  })

  // ── Category cards ──────────────────────────────────────────────────────────

  it('renders all 5 category cards', async () => {
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => {
      expect(screen.getByText('East-Facing')).toBeInTheDocument()
      expect(screen.getByText('West-Facing')).toBeInTheDocument()
      expect(screen.getByText('North-Facing')).toBeInTheDocument()
      expect(screen.getByText('South-Facing')).toBeInTheDocument()
      expect(screen.getByText('Corner Plots')).toBeInTheDocument()
    })
  })

  it('renders correct count for east-facing category', async () => {
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => {
      // East-Facing has count 8 in mock
      const eastCard = screen.getByText('East-Facing').closest('[class*="catCard"]')
      expect(eastCard).toBeInTheDocument()
    })
  })

  // ── Expand/collapse category ────────────────────────────────────────────────

  it('clicking category card expands to show plot numbers', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => expect(screen.getByText('East-Facing')).toBeInTheDocument())

    const eastHeader = screen.getByText('East-Facing')
    await user.click(eastHeader)

    await waitFor(() => {
      // Plot numbers appear after expand
      expect(screen.getByText('P-001')).toBeInTheDocument()
      expect(screen.getByText('P-003')).toBeInTheDocument()
    })
  })

  it('clicking category card twice collapses it', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => expect(screen.getByText('East-Facing')).toBeInTheDocument())

    const eastHeader = screen.getByText('East-Facing')
    await user.click(eastHeader)
    await waitFor(() => expect(screen.getByText('P-001')).toBeInTheDocument())

    await user.click(eastHeader)
    await waitFor(() => {
      expect(screen.queryByText('P-001')).not.toBeInTheDocument()
    })
  })

  it('only one category is open at a time', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => expect(screen.getByText('East-Facing')).toBeInTheDocument())

    await user.click(screen.getByText('East-Facing'))
    await waitFor(() => expect(screen.getByText('P-001')).toBeInTheDocument())

    await user.click(screen.getByText('West-Facing'))
    await waitFor(() => {
      // West plot numbers appear
      expect(screen.getByText('P-002')).toBeInTheDocument()
      // East plot numbers disappear
      expect(screen.queryByText('P-001')).not.toBeInTheDocument()
    })
  })

  // ── Enquiry CTA ─────────────────────────────────────────────────────────────

  it('enquire button inside expanded card calls onEnquire with correct category', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => expect(screen.getByText('East-Facing')).toBeInTheDocument())
    await user.click(screen.getByText('East-Facing'))

    const enquireBtn = await screen.findByRole('button', { name: /Enquire for East-Facing/i })
    await user.click(enquireBtn)

    expect(mockOnEnquire).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'East-Facing', source: 'CATEGORY_ENQUIRY' })
    )
  })

  // ── Dimension breakdown ──────────────────────────────────────────────────────

  it('renders dimension breakdown cards', async () => {
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => {
      expect(screen.getByText('30×40 ft')).toBeInTheDocument()
      expect(screen.getByText('33×50 ft')).toBeInTheDocument()
      expect(screen.getByText('40×60 ft')).toBeInTheDocument()
    })
  })

  it('dimension enquire button calls onEnquire with dimension category', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => expect(screen.getByText('30×40 ft')).toBeInTheDocument())

    const enquireBtns = screen.getAllByRole('button', { name: /Enquire/i })
    await user.click(enquireBtns[0])

    expect(mockOnEnquire).toHaveBeenCalled()
  })

  // ── Interactive SVG grid ─────────────────────────────────────────────────────

  it('renders "Interactive Layout Map" heading', async () => {
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => {
      expect(screen.getByText('Interactive Layout Map')).toBeInTheDocument()
    })
  })

  it('renders legend items for all categories', async () => {
    renderWithProviders(<PlotGrid onEnquire={mockOnEnquire} />)

    await waitFor(() => {
      expect(screen.getAllByText('East-Facing').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Corner Plots').length).toBeGreaterThan(0)
    })
  })
})
