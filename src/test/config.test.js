/**
 * tests for src/constants/config.js
 * Verifies every exported constant has the correct value.
 */
import { describe, it, expect } from 'vitest'
import {
  DEFAULT_WA_NUMBER,
  DEFAULT_PHONE,
  BUSINESS_HOURS,
  CALLBACK_MINUTES,
} from '../constants/config'

describe('config constants', () => {
  it('DEFAULT_WA_NUMBER is a digits-only phone number', () => {
    expect(DEFAULT_WA_NUMBER).toBe('919948709041')
    expect(/^\d+$/.test(DEFAULT_WA_NUMBER)).toBe(true)
    expect(DEFAULT_WA_NUMBER.length).toBeGreaterThan(9)
  })

  it('DEFAULT_PHONE includes + prefix and country code', () => {
    expect(DEFAULT_PHONE).toBe('+91 99487 09041')
    expect(DEFAULT_PHONE.startsWith('+')).toBe(true)
  })

  it('BUSINESS_HOURS is a non-empty string', () => {
    expect(typeof BUSINESS_HOURS).toBe('string')
    expect(BUSINESS_HOURS.length).toBeGreaterThan(0)
  })

  it('CALLBACK_MINUTES is a positive number', () => {
    expect(typeof CALLBACK_MINUTES).toBe('number')
    expect(CALLBACK_MINUTES).toBeGreaterThan(0)
  })

  it('CALLBACK_MINUTES is 30', () => {
    expect(CALLBACK_MINUTES).toBe(30)
  })
})
