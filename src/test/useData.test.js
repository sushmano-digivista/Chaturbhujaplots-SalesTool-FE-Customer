/**
 * tests for src/hooks/useData.js
 * Achieves 100% coverage on useContent, usePlotSummary, useSubmitLead.
 * @tanstack/react-query and toast are mocked.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ────────────────────────────────────────────────────────────────────
const mockUseQuery    = vi.fn()
const mockUseMutation = vi.fn()
vi.mock('@tanstack/react-query', () => ({
  useQuery:    (...args) => mockUseQuery(...args),
  useMutation: (...args) => mockUseMutation(...args),
}))

const mockToastSuccess = vi.fn()
const mockToastError   = vi.fn()
vi.mock('react-hot-toast', () => ({
  default: {
    success: (...args) => mockToastSuccess(...args),
    error:   (...args) => mockToastError(...args),
  },
}))

vi.mock('../api/index.js', () => ({
  contentApi:     { getAll:     vi.fn() },
  plotSummaryApi: { getSummary: vi.fn() },
  leadApi:        { submit:     vi.fn() },
}))

import { useContent, usePlotSummary, useSubmitLead } from '../hooks/useData'
import { contentApi, plotSummaryApi, leadApi } from '../api/index.js'

describe('useContent', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls useQuery with the correct queryKey and queryFn', () => {
    mockUseQuery.mockReturnValue({ data: null, isLoading: true })
    useContent()
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['content'],
        queryFn:  contentApi.getAll,
      })
    )
  })

  it('returns whatever useQuery returns', () => {
    const fakeResult = { data: { hero: {} }, isLoading: false }
    mockUseQuery.mockReturnValue(fakeResult)
    const result = useContent()
    expect(result).toBe(fakeResult)
  })
})

describe('usePlotSummary', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls useQuery with queryKey plot-summary and staleTime', () => {
    mockUseQuery.mockReturnValue({ data: null })
    usePlotSummary()
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['plot-summary'],
        queryFn:  plotSummaryApi.getSummary,
        staleTime: 60_000,
      })
    )
  })

  it('returns whatever useQuery returns', () => {
    const fakeResult = { data: { totalPlots: 50 } }
    mockUseQuery.mockReturnValue(fakeResult)
    expect(usePlotSummary()).toBe(fakeResult)
  })
})

describe('useSubmitLead', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls useMutation with leadApi.submit as mutationFn', () => {
    mockUseMutation.mockReturnValue({ mutate: vi.fn() })
    useSubmitLead()
    const [[options]] = mockUseMutation.mock.calls
    expect(options.mutationFn).toBe(leadApi.submit)
  })

  it('onSuccess calls toast.success', () => {
    mockUseMutation.mockReturnValue({ mutate: vi.fn() })
    useSubmitLead()
    const [[{ onSuccess }]] = mockUseMutation.mock.calls
    onSuccess()
    expect(mockToastSuccess).toHaveBeenCalledWith(
      'Thank you! Our team will contact you shortly.'
    )
  })

  it('onError calls toast.error with the API error message', () => {
    mockUseMutation.mockReturnValue({ mutate: vi.fn() })
    useSubmitLead()
    const [[{ onError }]] = mockUseMutation.mock.calls
    onError({ response: { data: { message: 'Custom error' } } })
    expect(mockToastError).toHaveBeenCalledWith('Custom error')
  })

  it('onError falls back to default message when no API message', () => {
    mockUseMutation.mockReturnValue({ mutate: vi.fn() })
    useSubmitLead()
    const [[{ onError }]] = mockUseMutation.mock.calls
    onError({})
    expect(mockToastError).toHaveBeenCalledWith(
      'Submission failed. Please try again.'
    )
  })

  it('returns whatever useMutation returns', () => {
    const fakeMutation = { mutate: vi.fn(), isPending: false }
    mockUseMutation.mockReturnValue(fakeMutation)
    expect(useSubmitLead()).toBe(fakeMutation)
  })
})
