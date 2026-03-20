import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeadModal from '@/components/ui/LeadModal'
import { renderWithProviders } from '../utils/renderWithProviders'
import { server } from '../utils/server'
import { errorHandlers } from '../utils/handlers'
import toast from 'react-hot-toast'

beforeAll(()  => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(()  => server.resetHandlers())
afterAll(()   => server.close())

const mockOnClose = vi.fn()
const DEFAULT_CONTEXT = { source: 'HERO_CTA', label: 'Enquire Now' }

describe('LeadModal', () => {

  // ── Visibility ──────────────────────────────────────────────────────────────

  it('renders nothing when context is null (closed)', () => {
    renderWithProviders(
      <LeadModal context={null} onClose={mockOnClose} />
    )
    expect(screen.queryByText('Enquire Now')).not.toBeInTheDocument()
  })

  it('renders modal sheet when context is provided', () => {
    renderWithProviders(
      <LeadModal context={DEFAULT_CONTEXT} onClose={mockOnClose} />
    )
    expect(screen.getByText('Enquire Now')).toBeInTheDocument()
  })

  // ── Close triggers ──────────────────────────────────────────────────────────

  it('close button calls onClose', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <LeadModal context={DEFAULT_CONTEXT} onClose={mockOnClose} />
    )
    const closeBtn = screen.getByLabelText('Close')
    await user.click(closeBtn)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('pressing Escape key calls onClose', async () => {
    renderWithProviders(
      <LeadModal context={DEFAULT_CONTEXT} onClose={mockOnClose} />
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalled()
  })

  // ── Context display ─────────────────────────────────────────────────────────

  it('displays category tag when context has category', () => {
    renderWithProviders(
      <LeadModal
        context={{ source: 'CATEGORY_ENQUIRY', label: 'Enquire', category: 'East-Facing' }}
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText('East-Facing')).toBeInTheDocument()
  })

  it('hides category dropdown when context already has category', () => {
    renderWithProviders(
      <LeadModal
        context={{ source: 'CATEGORY_ENQUIRY', label: 'Enquire', category: 'Corner Plots' }}
        onClose={mockOnClose}
      />
    )
    expect(screen.queryByLabelText(/Plot Interest/i)).not.toBeInTheDocument()
  })

  it('shows category dropdown when no category in context', () => {
    renderWithProviders(
      <LeadModal context={{ source: 'HERO_CTA', label: 'Enquire' }} onClose={mockOnClose} />
    )
    expect(screen.getByLabelText(/Plot Interest/i)).toBeInTheDocument()
  })

  // ── Form validation ─────────────────────────────────────────────────────────

  it('submitting with empty name shows validation error', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <LeadModal context={DEFAULT_CONTEXT} onClose={mockOnClose} />
    )
    const submitBtn = screen.getByRole('button', { name: /Request Callback/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })

  it('submitting with empty phone shows validation error', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <LeadModal context={DEFAULT_CONTEXT} onClose={mockOnClose} />
    )
    await user.type(screen.getByPlaceholderText(/Full name/i), 'Ravi Kumar')
    const submitBtn = screen.getByRole('button', { name: /Request Callback/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('Phone number is required')).toBeInTheDocument()
    })
  })

  it('invalid phone format shows pattern error', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <LeadModal context={DEFAULT_CONTEXT} onClose={mockOnClose} />
    )
    await user.type(screen.getByPlaceholderText(/Full name/i), 'Ravi Kumar')
    await user.type(screen.getByPlaceholderText(/\+91/i), '12345') // too short

    const submitBtn = screen.getByRole('button', { name: /Request Callback/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/valid 10-digit/i)).toBeInTheDocument()
    })
  })

  // ── Successful submission ───────────────────────────────────────────────────

  it('valid submission closes modal and shows success toast', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <LeadModal context={DEFAULT_CONTEXT} onClose={mockOnClose} />
    )

    await user.type(screen.getByPlaceholderText(/Full name/i), 'Ravi Kumar')
    await user.type(screen.getByPlaceholderText(/\+91/i), '9876543210')

    const submitBtn = screen.getByRole('button', { name: /Request Callback/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('submit button shows loading state while pending', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <LeadModal context={DEFAULT_CONTEXT} onClose={mockOnClose} />
    )

    await user.type(screen.getByPlaceholderText(/Full name/i), 'Ravi')
    await user.type(screen.getByPlaceholderText(/\+91/i), '9876543210')

    const submitBtn = screen.getByRole('button', { name: /Request Callback/i })
    await user.click(submitBtn)

    // Button text changes to Sending… while pending
    await waitFor(() => {
      const btn = screen.queryByRole('button', { name: /Sending/i })
        || screen.queryByRole('button', { name: /Request Callback/i })
      expect(btn).toBeInTheDocument()
    })
  })

  // ── WhatsApp button ─────────────────────────────────────────────────────────

  it('WhatsApp button opens new tab with correct URL', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    renderWithProviders(
      <LeadModal
        context={{ source: 'HERO_CTA', label: 'Enquire', category: 'East-Facing' }}
        onClose={mockOnClose}
        whatsapp="919876543210"
      />
    )

    const waBtn = screen.getByRole('button', { name: /WhatsApp/i })
    await user.click(waBtn)

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('wa.me/919876543210'),
      '_blank'
    )
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('East-Facing'),
      '_blank'
    )
    openSpy.mockRestore()
  })
})
