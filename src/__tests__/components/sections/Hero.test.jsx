import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Hero from '@/components/sections/Hero'
import { renderWithProviders } from '../utils/renderWithProviders'
import { server } from '../utils/server'
import { MOCK_CONTENT } from '../utils/handlers'
import { beforeAll, afterAll, afterEach } from 'vitest'

beforeAll(()  => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(()  => server.resetHandlers())
afterAll(()   => server.close())

const mockOnEnquire = vi.fn()

describe('Hero', () => {

  // ── Content rendering ───────────────────────────────────────────────────────

  it('renders headline from CMS content', () => {
    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )
    expect(screen.getByText('Premium Plots')).toBeInTheDocument()
  })

  it('renders subheadline in italic', () => {
    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )
    expect(screen.getByText('Amaravati')).toBeInTheDocument()
  })

  it('renders description text', () => {
    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )
    expect(screen.getByText(/8 km from Andhra Pradesh/i)).toBeInTheDocument()
  })

  it('renders all approval badges from CMS', () => {
    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )
    expect(screen.getByText(/CRDA Approved/i)).toBeInTheDocument()
    expect(screen.getByText(/AP RERA/i)).toBeInTheDocument()
  })

  // ── Fallback content ────────────────────────────────────────────────────────

  it('renders fallback headline when content is undefined', () => {
    renderWithProviders(
      <Hero content={undefined} onEnquire={mockOnEnquire} />
    )
    expect(screen.getByText('Premium Plots')).toBeInTheDocument()
  })

  it('renders fallback description when hero is empty', () => {
    renderWithProviders(
      <Hero content={{ hero: {}, contact: {} }} onEnquire={mockOnEnquire} />
    )
    expect(screen.getByText(/8 km/i)).toBeInTheDocument()
  })

  // ── CTA buttons ─────────────────────────────────────────────────────────────

  it('renders 3 CTA buttons', () => {
    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )
    expect(screen.getByRole('button', { name: /Explore Plots/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Book Site Visit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Get Brochure/i })).toBeInTheDocument()
  })

  it('Explore Plots button scrolls to #plots section', async () => {
    const user = userEvent.setup()
    const section = document.createElement('div')
    section.id = 'plots'
    section.scrollIntoView = vi.fn()
    document.body.appendChild(section)

    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )

    await user.click(screen.getByRole('button', { name: /Explore Plots/i }))
    expect(section.scrollIntoView).toHaveBeenCalled()
    document.body.removeChild(section)
  })

  it('Book Site Visit button calls onEnquire with HERO_CTA source', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )
    await user.click(screen.getByRole('button', { name: /Book Site Visit/i }))

    expect(mockOnEnquire).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'HERO_CTA', type: 'SITE_VISIT' })
    )
  })

  it('Get Brochure button calls onEnquire with BROCHURE type', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )
    await user.click(screen.getByRole('button', { name: /Get Brochure/i }))

    expect(mockOnEnquire).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'BROCHURE' })
    )
  })

  // ── WhatsApp quick-connect ──────────────────────────────────────────────────

  it('renders WhatsApp Chat Now link when whatsapp is in contact', () => {
    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )
    expect(screen.getByText(/Chat Now/i)).toBeInTheDocument()
  })

  it('WhatsApp link has correct href with phone number', () => {
    renderWithProviders(
      <Hero content={MOCK_CONTENT} onEnquire={mockOnEnquire} />
    )
    const waLink = screen.getByText(/Chat Now/i).closest('a')
    expect(waLink.href).toContain('wa.me/919999999999')
  })

  it('does not render WhatsApp link when no whatsapp in contact', () => {
    const noWaContent = { ...MOCK_CONTENT, contact: { phone: '+91 99999 99999' } }
    renderWithProviders(
      <Hero content={noWaContent} onEnquire={mockOnEnquire} />
    )
    expect(screen.queryByText(/Chat Now/i)).not.toBeInTheDocument()
  })
})
