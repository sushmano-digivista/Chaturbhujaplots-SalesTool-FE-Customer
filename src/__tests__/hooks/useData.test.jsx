import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useContent, usePlotSummary, useSubmitLead } from '@/hooks/useData'
import { server } from '../utils/server'
import { errorHandlers, MOCK_CONTENT, MOCK_PLOT_SUMMARY } from '../utils/handlers'
import toast from 'react-hot-toast'

beforeAll(()  => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(()  => server.resetHandlers())
afterAll(()   => server.close())

function wrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
}

// ── useContent ────────────────────────────────────────────────────────────────

describe('useContent', () => {
  it('fetches content successfully', async () => {
    const { result } = renderHook(() => useContent(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data.id).toBe('CONTENT')
    expect(result.current.data.hero.headline).toBe('Premium Plots')
  })

  it('isLoading is true initially', () => {
    const { result } = renderHook(() => useContent(), { wrapper: wrapper() })
    expect(result.current.isLoading).toBe(true)
  })

  it('isError is true on server error', async () => {
    server.use(errorHandlers.contentError)
    const { result } = renderHook(() => useContent(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('returns contact info with phone', async () => {
    const { result } = renderHook(() => useContent(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data.contact.phone).toBe('+91 99999 99999')
    expect(result.current.data.contact.whatsapp).toBe('919999999999')
  })
})

// ── usePlotSummary ────────────────────────────────────────────────────────────

describe('usePlotSummary', () => {
  it('fetches plot summary successfully', async () => {
    const { result } = renderHook(() => usePlotSummary(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data.totalPlots).toBe(24)
    expect(result.current.data.eastFacing.count).toBe(8)
    expect(result.current.data.cornerPlots.count).toBe(5)
  })

  it('returns all 5 category stats', async () => {
    const { result } = renderHook(() => usePlotSummary(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const d = result.current.data
    expect(d.eastFacing).toBeDefined()
    expect(d.westFacing).toBeDefined()
    expect(d.northFacing).toBeDefined()
    expect(d.southFacing).toBeDefined()
    expect(d.cornerPlots).toBeDefined()
  })

  it('returns byDimension breakdown', async () => {
    const { result } = renderHook(() => usePlotSummary(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data.byDimension).toHaveLength(3)
    expect(result.current.data.byDimension[0].dimension).toBe('30×40')
  })

  it('isError on server error', async () => {
    server.use(errorHandlers.plotSummaryError)
    const { result } = renderHook(() => usePlotSummary(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useSubmitLead ─────────────────────────────────────────────────────────────

describe('useSubmitLead', () => {
  it('mutate: success → calls toast.success', async () => {
    const { result } = renderHook(() => useSubmitLead(), { wrapper: wrapper() })

    result.current.mutate({
      name: 'Ravi Kumar', phone: '9876543210', source: 'HERO_CTA',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining('contact you shortly')
    )
  })

  it('mutate: error → calls toast.error', async () => {
    server.use(errorHandlers.leadSubmitValidationError)
    const { result } = renderHook(() => useSubmitLead(), { wrapper: wrapper() })

    result.current.mutate({ name: '', phone: '' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalled()
  })

  it('isPending is true while submitting', async () => {
    const { result } = renderHook(() => useSubmitLead(), { wrapper: wrapper() })

    result.current.mutate({ name: 'Test', phone: '9876543210', source: 'HERO_CTA' })

    // Right after calling mutate, isPending should be true
    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
