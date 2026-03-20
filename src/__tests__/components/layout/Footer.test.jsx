import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { Footer, StickyBar, FloatingWA } from '@/components/layout/Footer'
import { MOCK_CONTENT } from '../utils/handlers'

const mockOnEnquire = vi.fn()

beforeEach(() => {
  mockOnEnquire.mockClear()
  // Setup scroll target sections
  const ids = ['plots','amenities','gallery','location','contact']
  ids.forEach(id => {
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('div')
      el.id = id
      el.scrollIntoView = vi.fn()
      document.body.appendChild(el)
    }
  })
})

// ── Footer ────────────────────────────────────────────────────────────────────

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Footer content={MOCK_CONTENT} />)
    expect(screen.getByText('Anjana')).toBeInTheDocument()
    expect(screen.getByText('Paradise')).toBeInTheDocument()
  })

  it('renders CRDA badge', () => {
    render(<Footer content={MOCK_CONTENT} />)
    expect(screen.getByText('CRDA Approved')).toBeInTheDocument()
  })

  it('renders RERA badge', () => {
    render(<Footer content={MOCK_CONTENT} />)
    expect(screen.getByText(/RERA/i)).toBeInTheDocument()
  })

  it('renders all quick links', () => {
    render(<Footer content={MOCK_CONTENT} />)
    expect(screen.getByRole('button', { name: 'Explore Plots' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Amenities' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gallery' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Location' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Contact' })).toBeInTheDocument()
  })

  it('renders phone number from CMS', () => {
    render(<Footer content={MOCK_CONTENT} />)
    expect(screen.getByText('📞 +91 99999 99999')).toBeInTheDocument()
  })

  it('renders email from CMS', () => {
    render(<Footer content={MOCK_CONTENT} />)
    expect(screen.getByText('✉️ info@anjanaparadise.in')).toBeInTheDocument()
  })

  it('renders address from CMS', () => {
    render(<Footer content={MOCK_CONTENT} />)
    expect(screen.getByText(/Paritala/i)).toBeInTheDocument()
  })

  it('renders copyright notice', () => {
    render(<Footer content={MOCK_CONTENT} />)
    expect(screen.getByText(/2025 Chaturbhuja Properties/i)).toBeInTheDocument()
  })

  it('clicking Explore Plots scrolls to #plots', async () => {
    const user = userEvent.setup()
    render(<Footer content={MOCK_CONTENT} />)

    const section = document.getElementById('plots')
    await user.click(screen.getByRole('button', { name: 'Explore Plots' }))

    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('phone link has tel: href', () => {
    render(<Footer content={MOCK_CONTENT} />)
    const phoneLink = document.querySelector('a[href^="tel"]')
    expect(phoneLink).toBeInTheDocument()
  })

  it('WhatsApp link has wa.me href', () => {
    render(<Footer content={MOCK_CONTENT} />)
    const waLink = document.querySelector('a[href*="wa.me"]')
    expect(waLink).toBeInTheDocument()
    expect(waLink.href).toContain('919999999999')
  })

  it('renders with empty content gracefully (no crash)', () => {
    render(<Footer content={{}} />)
    expect(screen.getByText(/2025 Chaturbhuja Properties/i)).toBeInTheDocument()
  })
})

// ── StickyBar ─────────────────────────────────────────────────────────────────

describe('StickyBar', () => {
  it('renders Call, WhatsApp and Enquire buttons', () => {
    render(<StickyBar contact={MOCK_CONTENT.contact} onEnquire={mockOnEnquire} />)
    expect(screen.getByText('Call')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Enquire')).toBeInTheDocument()
  })

  it('Call link has tel: href', () => {
    render(<StickyBar contact={MOCK_CONTENT.contact} onEnquire={mockOnEnquire} />)
    const callLink = document.querySelector('a[href^="tel"]')
    expect(callLink).toBeInTheDocument()
  })

  it('Enquire button calls onEnquire with STICKY_BAR source', async () => {
    const user = userEvent.setup()
    render(<StickyBar contact={MOCK_CONTENT.contact} onEnquire={mockOnEnquire} />)

    await user.click(screen.getByRole('button', { name: /Enquire/i }))

    expect(mockOnEnquire).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'STICKY_BAR' })
    )
  })

  it('WhatsApp button opens wa.me link', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<StickyBar contact={MOCK_CONTENT.contact} onEnquire={mockOnEnquire} />)

    await user.click(screen.getByRole('button', { name: /WhatsApp/i }))

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('wa.me/919999999999'),
      '_blank'
    )
    openSpy.mockRestore()
  })

  it('renders with fallback phone when contact is empty', () => {
    render(<StickyBar contact={{}} onEnquire={mockOnEnquire} />)
    expect(screen.getByText('Call')).toBeInTheDocument()
  })
})

// ── FloatingWA ────────────────────────────────────────────────────────────────

describe('FloatingWA', () => {
  it('renders the floating button', () => {
    render(<FloatingWA contact={MOCK_CONTENT.contact} onEnquire={mockOnEnquire} />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('title', 'Chat on WhatsApp')
  })

  it('renders WhatsApp emoji', () => {
    render(<FloatingWA contact={MOCK_CONTENT.contact} onEnquire={mockOnEnquire} />)
    expect(screen.getByText('💬')).toBeInTheDocument()
  })

  it('clicking opens WhatsApp with correct number', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<FloatingWA contact={MOCK_CONTENT.contact} onEnquire={mockOnEnquire} />)

    await user.click(screen.getByRole('button'))

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('wa.me/919999999999'),
      '_blank'
    )
    openSpy.mockRestore()
  })

  it('clicking also triggers onEnquire with FLOATING_BUTTON source', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<FloatingWA contact={MOCK_CONTENT.contact} onEnquire={mockOnEnquire} />)

    await user.click(screen.getByRole('button'))

    expect(mockOnEnquire).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'FLOATING_BUTTON' })
    )
  })

  it('uses fallback number when contact has no whatsapp', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<FloatingWA contact={{}} onEnquire={mockOnEnquire} />)

    await user.click(screen.getByRole('button'))

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('wa.me/919999999999'),
      '_blank'
    )
    openSpy.mockRestore()
  })
})
