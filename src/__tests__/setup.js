import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Auto-cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock IntersectionObserver (not available in jsdom)
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor(cb) { this.cb = cb }
  observe()    { this.cb([{ isIntersecting: true }]) }
  unobserve()  {}
  disconnect() {}
}

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe()    {}
  unobserve()  {}
  disconnect() {}
}

// Mock window.scrollTo
globalThis.scrollTo = vi.fn()

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: new Proxy({}, {
      get: (_, tag) => {
        const Component = ({ children, ...props }) => {
          // Pass through only valid HTML props
          const {
            whileHover, whileTap, whileInView, animate, initial, exit,
            transition, variants, layout, layoutId, ...htmlProps
          } = props
          const React = require('react')
          return React.createElement(tag, htmlProps, children)
        }
        Component.displayName = `motion.${tag}`
        return Component
      }
    }),
    AnimatePresence: ({ children }) => children,
  }
})

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error:   vi.fn(),
    loading: vi.fn(),
  },
  Toaster: () => null,
}))

// Mock react-countup
vi.mock('react-countup', () => ({
  default: ({ end, suffix = '' }) => `${end}${suffix}`,
}))
