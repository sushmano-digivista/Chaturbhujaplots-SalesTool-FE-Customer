import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import {
  HighlightsSection,
  AmenitiesSection,
  QuoteSection,
  LocationSection,
  ContactSection,
} from '@/components/sections/Sections'
import { MOCK_CONTENT } from '../utils/handlers'

const mockOnEnquire = vi.fn()

beforeEach(() => mockOnEnquire.mockClear())

// ── HighlightsSection ─────────────────────────────────────────────────────────

describe('HighlightsSection', () => {
  it('renders section heading', () => {
    render(<HighlightsSection content={MOCK_CONTENT} />)
    expect(screen.getByText(/Location/i)).toBeInTheDocument()
    expect(screen.getByText(/Advantages/i)).toBeInTheDocument()
  })

  it('renders all highlight cards from CMS data', () => {
    render(<HighlightsSection content={MOCK_CONTENT} />)
    // MOCK_CONTENT has 2 highlights
    expect(screen.getByText('Near National Highway')).toBeInTheDocument()
    expect(screen.getByText('8 km from Amaravati')).toBeInTheDocument()
  })

  it('renders highlight description text', () => {
    render(<HighlightsSection content={MOCK_CONTENT} />)
    expect(screen.getByText('NH-16 access.')).toBeInTheDocument()
  })

  it('renders highlight icons', () => {
    render(<HighlightsSection content={MOCK_CONTENT} />)
    expect(screen.getByText('🛣️')).toBeInTheDocument()
    expect(screen.getByText('🏛️')).toBeInTheDocument()
  })

  it('renders empty grid when no highlights in CMS', () => {
    render(<HighlightsSection content={{ highlights: [] }} />)
    expect(screen.queryByText('Near National Highway')).not.toBeInTheDocument()
  })

  it('renders sorted by sortOrder', () => {
    const content = {
      highlights: [
        { icon: '🅱️', title: 'Second',  description: 'desc', sortOrder: 2 },
        { icon: '🅰️', title: 'First',   description: 'desc', sortOrder: 1 },
      ],
    }
    render(<HighlightsSection content={content} />)
    const titles = screen.getAllByRole('heading', { level: 4 })
    expect(titles[0].textContent).toBe('First')
    expect(titles[1].textContent).toBe('Second')
  })
})

// ── AmenitiesSection ──────────────────────────────────────────────────────────

describe('AmenitiesSection', () => {
  it('renders INFRA tab active by default', () => {
    render(<AmenitiesSection content={MOCK_CONTENT} />)
    const infraBtn = screen.getByRole('button', { name: 'Infrastructure' })
    expect(infraBtn.className).toMatch(/active/i)
  })

  it('renders amenity items for default INFRA tab', () => {
    render(<AmenitiesSection content={MOCK_CONTENT} />)
    expect(screen.getByText('Grand Entrance Arch')).toBeInTheDocument()
  })

  it('renders featured Hanuman temple card in INFRA tab', () => {
    render(<AmenitiesSection content={MOCK_CONTENT} />)
    expect(screen.getByText('Hanuman Temple')).toBeInTheDocument()
    expect(screen.getByText('A magnificent Hanuman temple nearby.')).toBeInTheDocument()
    expect(screen.getByText('Nearby')).toBeInTheDocument()
  })

  it('switching to LIFESTYLE tab shows lifestyle items', async () => {
    const user = userEvent.setup()
    render(<AmenitiesSection content={MOCK_CONTENT} />)

    await user.click(screen.getByRole('button', { name: 'Lifestyle' }))

    await waitFor(() => {
      expect(screen.getByText('Jogging Track')).toBeInTheDocument()
      expect(screen.queryByText('Grand Entrance Arch')).not.toBeInTheDocument()
    })
  })

  it('switching to UTILITIES tab shows utility items', async () => {
    const user = userEvent.setup()
    render(<AmenitiesSection content={MOCK_CONTENT} />)

    await user.click(screen.getByRole('button', { name: 'Utilities' }))

    await waitFor(() => {
      expect(screen.getByText('Fibre Internet Ready')).toBeInTheDocument()
    })
  })

  it('all 3 tab buttons are rendered', () => {
    render(<AmenitiesSection content={MOCK_CONTENT} />)
    expect(screen.getByRole('button', { name: 'Infrastructure' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lifestyle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Utilities' })).toBeInTheDocument()
  })

  it('renders empty tab gracefully when no items', async () => {
    const user = userEvent.setup()
    const noAmenities = { ...MOCK_CONTENT, amenities: [] }
    render(<AmenitiesSection content={noAmenities} />)
    // No crash — section renders
    expect(screen.getByText('Infrastructure')).toBeInTheDocument()
  })
})

// ── QuoteSection ──────────────────────────────────────────────────────────────

describe('QuoteSection', () => {
  it('renders invest line 1 from CMS', () => {
    render(<QuoteSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)
    expect(screen.getByText('Invest ₹2 Today —')).toBeInTheDocument()
  })

  it('renders invest line 2 from CMS', () => {
    render(<QuoteSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)
    expect(screen.getByText('Receive ₹20 Tomorrow')).toBeInTheDocument()
  })

  it('renders quote text', () => {
    render(<QuoteSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)
    expect(screen.getByText(/10x returns expected/i)).toBeInTheDocument()
  })

  it('renders all stats from CMS', () => {
    render(<QuoteSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)
    expect(screen.getByText('10×')).toBeInTheDocument()
    expect(screen.getByText('Expected Return')).toBeInTheDocument()
    expect(screen.getByText('5–7')).toBeInTheDocument()
    expect(screen.getByText('Safe')).toBeInTheDocument()
  })

  it('Secure Your Plot CTA calls onEnquire', async () => {
    const user = userEvent.setup()
    render(<QuoteSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)

    await user.click(screen.getByRole('button', { name: /Secure Your Plot Now/i }))

    expect(mockOnEnquire).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'HERO_CTA' })
    )
  })

  it('renders fallback quote when CMS quote is absent', () => {
    render(<QuoteSection content={{ quote: null }} onEnquire={mockOnEnquire} />)
    expect(screen.getByText(/10 times your investment/i)).toBeInTheDocument()
  })
})

// ── LocationSection ───────────────────────────────────────────────────────────

describe('LocationSection', () => {
  it('renders section heading', () => {
    render(<LocationSection content={MOCK_CONTENT} />)
    expect(screen.getByText(/Location/i)).toBeInTheDocument()
    expect(screen.getByText(/Connectivity/i)).toBeInTheDocument()
  })

  it('renders all distance cards from CMS', () => {
    render(<LocationSection content={MOCK_CONTENT} />)
    expect(screen.getByText('Amaravati Capital')).toBeInTheDocument()
    expect(screen.getByText('NH-16 Highway')).toBeInTheDocument()
    expect(screen.getByText('Vijayawada Airport')).toBeInTheDocument()
  })

  it('renders distance badges', () => {
    render(<LocationSection content={MOCK_CONTENT} />)
    expect(screen.getByText('8 km')).toBeInTheDocument()
    expect(screen.getByText('3 km')).toBeInTheDocument()
    expect(screen.getByText('22 km')).toBeInTheDocument()
  })

  it('renders Google Maps iframe with embed URL', () => {
    render(<LocationSection content={MOCK_CONTENT} />)
    const iframe = document.querySelector('iframe')
    expect(iframe).toBeInTheDocument()
    expect(iframe.src).toContain('maps.google.com')
  })

  it('renders project name in popup card', () => {
    render(<LocationSection content={MOCK_CONTENT} />)
    expect(screen.getByText('📍 Anjana Paradise')).toBeInTheDocument()
  })

  it('Get Directions button opens Google Maps', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<LocationSection content={MOCK_CONTENT} />)

    await user.click(screen.getByRole('button', { name: /Get Directions/i }))

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('Paritala'),
      '_blank'
    )
    openSpy.mockRestore()
  })

  it('renders subtitle for each distance item', () => {
    render(<LocationSection content={MOCK_CONTENT} />)
    expect(screen.getByText('New State Capital')).toBeInTheDocument()
    expect(screen.getByText('Air connectivity')).toBeInTheDocument()
  })
})

// ── ContactSection ────────────────────────────────────────────────────────────

describe('ContactSection', () => {
  it('renders section heading', () => {
    render(<ContactSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)
    expect(screen.getByText(/Secure Your/i)).toBeInTheDocument()
    expect(screen.getByText(/Plot Today/i)).toBeInTheDocument()
  })

  it('renders phone number from CMS contact', () => {
    render(<ContactSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)
    expect(screen.getByText('+91 99999 99999')).toBeInTheDocument()
  })

  it('renders all 4 perks', () => {
    render(<ContactSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)
    expect(screen.getByText(/Free site visit/i)).toBeInTheDocument()
    expect(screen.getByText(/No-obligation/i)).toBeInTheDocument()
    expect(screen.getByText(/Flexible payment/i)).toBeInTheDocument()
    expect(screen.getByText(/Home loan/i)).toBeInTheDocument()
  })

  it('Get Callback button calls onEnquire with CONTACT_FORM source', async () => {
    const user = userEvent.setup()
    render(<ContactSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)

    await user.click(screen.getByRole('button', { name: /Get Callback/i }))

    expect(mockOnEnquire).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'CONTACT_FORM', type: 'CALLBACK' })
    )
  })

  it('Schedule Site Visit button calls onEnquire with SITE_VISIT type', async () => {
    const user = userEvent.setup()
    render(<ContactSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)

    await user.click(screen.getByRole('button', { name: /Schedule Site Visit/i }))

    expect(mockOnEnquire).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'CONTACT_FORM', type: 'SITE_VISIT' })
    )
  })

  it('WhatsApp button opens wa.me with phone number', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<ContactSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)

    await user.click(screen.getByRole('button', { name: /Chat on WhatsApp/i }))

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('wa.me/919999999999'),
      '_blank'
    )
    openSpy.mockRestore()
  })

  it('response time note is shown', () => {
    render(<ContactSection content={MOCK_CONTENT} onEnquire={mockOnEnquire} />)
    expect(screen.getByText(/30 minutes/i)).toBeInTheDocument()
  })
})
