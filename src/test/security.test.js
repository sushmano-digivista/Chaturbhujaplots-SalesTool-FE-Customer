/**
 * security.test.js
 * Unit tests for src/utils/security.js
 *
 * Covers: isSafeExternalUrl, safeOpenExternal, openWhatsApp, openMaps
 * These tests verify the Checkmarx CWE-601 fix is working correctly.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isSafeExternalUrl, safeOpenExternal, openWhatsApp, openMaps } from '../utils/security'

describe('isSafeExternalUrl', () => {
  it('allows https://wa.me/ URLs', () => {
    expect(isSafeExternalUrl('https://wa.me/918977262683?text=Hi')).toBe(true)
  })

  it('allows https://maps.google.com/ URLs', () => {
    expect(isSafeExternalUrl('https://maps.google.com/?q=Paritala')).toBe(true)
  })

  it('allows https://www.google.com/maps URLs', () => {
    expect(isSafeExternalUrl('https://www.google.com/maps?q=test')).toBe(true)
  })

  it('allows https://goo.gl/maps URLs', () => {
    expect(isSafeExternalUrl('https://goo.gl/maps/abc123')).toBe(true)
  })

  it('blocks arbitrary http URLs (CWE-601)', () => {
    expect(isSafeExternalUrl('http://evil.com/redirect')).toBe(false)
  })

  it('blocks javascript: URLs (XSS vector)', () => {
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false)
  })

  it('blocks data: URLs', () => {
    expect(isSafeExternalUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })

  it('blocks empty string', () => {
    expect(isSafeExternalUrl('')).toBe(false)
  })

  it('blocks null / undefined', () => {
    expect(isSafeExternalUrl(null)).toBe(false)
    expect(isSafeExternalUrl(undefined)).toBe(false)
  })

  it('blocks API deep-link that is not a wa.me URL (CWE-601 open redirect)', () => {
    expect(isSafeExternalUrl('https://attacker.com/phish')).toBe(false)
  })
})

describe('safeOpenExternal', () => {
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn())
  })

  it('opens allowed WhatsApp URLs with noopener,noreferrer (S5148)', () => {
    const url = 'https://wa.me/918977262683?text=Hi'
    safeOpenExternal(url)
    expect(window.open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer')
  })

  it('does NOT open disallowed URLs (CWE-601)', () => {
    safeOpenExternal('https://evil.com')
    expect(window.open).not.toHaveBeenCalled()
  })

  it('does NOT open javascript: URLs', () => {
    safeOpenExternal('javascript:alert(1)')
    expect(window.open).not.toHaveBeenCalled()
  })
})

describe('openWhatsApp', () => {
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn())
  })

  it('builds a valid wa.me URL and opens it safely', () => {
    openWhatsApp('918977262683', 'Hello!')
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/918977262683'),
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('URL-encodes the message text', () => {
    openWhatsApp('918977262683', 'Hello World & More')
    const [[calledUrl]] = window.open.mock.calls
    expect(calledUrl).toContain('Hello%20World')
  })
})

describe('openMaps', () => {
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn())
  })

  it('opens google maps URLs safely', () => {
    const url = 'https://maps.google.com/?q=Paritala'
    openMaps(url)
    expect(window.open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer')
  })

  it('does NOT open non-maps URLs passed via openMaps', () => {
    openMaps('https://evil.com/maps')
    expect(window.open).not.toHaveBeenCalled()
  })
})
