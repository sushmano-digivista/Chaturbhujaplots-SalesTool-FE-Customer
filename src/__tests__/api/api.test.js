import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { contentApi, plotSummaryApi, leadApi } from '@/api/index'
import { server } from '../utils/server'
import { errorHandlers, MOCK_CONTENT, MOCK_PLOT_SUMMARY, MOCK_LEAD_RESPONSE } from '../utils/handlers'

beforeAll(()  => server.listen({ onUnhandledRequest: 'error' }))
afterEach(()  => server.resetHandlers())
afterAll(()   => server.close())

describe('contentApi', () => {
  it('getAll: returns full content object', async () => {
    const result = await contentApi.getAll()

    expect(result.id).toBe('CONTENT')
    expect(result.hero.headline).toBe('Premium Plots')
    expect(result.contact.phone).toBe('+91 99999 99999')
    expect(result.highlights).toHaveLength(2)
    expect(result.amenities).toHaveLength(4)
    expect(result.distances).toHaveLength(3)
  })

  it('getAll: throws on server error', async () => {
    server.use(errorHandlers.contentError)
    await expect(contentApi.getAll()).rejects.toThrow()
  })
})

describe('plotSummaryApi', () => {
  it('getSummary: returns summary with category counts', async () => {
    const result = await plotSummaryApi.getSummary()

    expect(result.totalPlots).toBe(24)
    expect(result.eastFacing.count).toBe(8)
    expect(result.cornerPlots.count).toBe(5)
    expect(result.byDimension).toHaveLength(3)
    expect(result.priceRangeLabel).toBe('₹23.9L – ₹48.1L')
  })

  it('getSummary: eastFacing has plot numbers array', async () => {
    const result = await plotSummaryApi.getSummary()
    expect(result.eastFacing.plotNumbers).toContain('P-001')
    expect(result.eastFacing.plotNumbers).toHaveLength(8)
  })

  it('getSummary: throws on server error', async () => {
    server.use(errorHandlers.plotSummaryError)
    await expect(plotSummaryApi.getSummary()).rejects.toThrow()
  })
})

describe('leadApi', () => {
  it('submit: valid lead → returns created lead with id and status NEW', async () => {
    const result = await leadApi.submit({
      name: 'Ravi Kumar',
      phone: '9876543210',
      source: 'HERO_CTA',
    })

    expect(result.id).toBe('lead-test-1')
    expect(result.status).toBe('NEW')
    expect(result.name).toBe('Ravi Kumar')
  })

  it('submit: throws on validation error', async () => {
    server.use(errorHandlers.leadSubmitValidationError)
    await expect(leadApi.submit({ name: '', phone: '' })).rejects.toThrow()
  })
})
