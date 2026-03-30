import { useState, useEffect, useCallback } from 'react'

import { useContent }   from '@/hooks/useData'
import FALLBACK_CONTENT from '@/constants/fallbackContent'

// ── Layout components (each in its own file) ──────────────────────────────────
import { Navbar, Footer, StickyBar, FloatingWA } from '@/components/layout'

// ── Section components (each in its own file) ─────────────────────────────────
import {
  Hero,
  PlotGrid,
  PortfolioSection,
  GallerySection,
  VideosSection,
  HighlightsSection,
  AmenitiesSection,
  QuoteSection,
  LocationSection,
  ContactSection,
} from '@/components/sections'

// ── UI components ─────────────────────────────────────────────────────────────
import { LeadModal } from '@/components/ui'

// ── Common utilities ──────────────────────────────────────────────────────────
import PageLoader from '@/components/common/PageLoader'

/**
 * HomePage — the customer-facing sales page.
 *
 * Composition pattern: this file imports and assembles all section components.
 * Each section is self-contained in its own JSX file and can be:
 *   - Reordered by moving a single line inside <main>
 *   - Removed by commenting out a single line
 *   - Reused elsewhere by importing the same component
 *
 * To add a new section:
 *   1. Create  src/components/sections/YourNewSection.jsx
 *   2. Export  it from src/components/sections/index.js
 *   3. Import + place <YourNewSection /> inside <main> below
 */
const SPLASH_MS = 3000 // match house draw animation duration

export default function HomePage() {
  const { data: content, isLoading, isError } = useContent()
  const [leadCtx,     setLeadCtx]     = useState(null)
  const [splashDone,  setSplashDone]  = useState(false)
  const [mountedAt]                   = useState(() => Date.now())

  const openEnquiry  = useCallback((ctx) => setLeadCtx(ctx), [])
  const closeEnquiry = useCallback(() => setLeadCtx(null),   [])

  // Enforce 3s minimum so the house finishes drawing before we transition
  useEffect(() => {
    const elapsed = Date.now() - mountedAt
    const wait    = Math.max(0, SPLASH_MS - elapsed)
    const t = setTimeout(() => setSplashDone(true), wait)
    return () => clearTimeout(t)
  }, [mountedAt])

  // Show full-screen loader only on the very first load (not on API error)
  if ((isLoading || !splashDone) && !isError) return <PageLoader />

  // Fall back to static content when the API is down
  const activeContent = content || FALLBACK_CONTENT
  const contact       = activeContent?.contact || {}

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>

      {/* ── Persistent chrome ─────────────────────────────────────────── */}
      <Navbar contact={contact} onEnquire={openEnquiry} />

      {/* ── Page sections — add / remove / reorder here ───────────────── */}
      <main>
        <Hero              content={activeContent} onEnquire={openEnquiry} />
        <PortfolioSection  content={activeContent} onEnquire={openEnquiry} />
        <GallerySection    content={activeContent} />
        <VideosSection     content={activeContent} />
        <QuoteSection      content={activeContent} onEnquire={openEnquiry} />
        <HighlightsSection content={activeContent} />
        <PlotGrid                                  onEnquire={openEnquiry} />
        <AmenitiesSection  content={activeContent} />
        <LocationSection   content={activeContent} />
        <ContactSection    content={activeContent} onEnquire={openEnquiry} />
      </main>

      {/* ── Footer chrome ─────────────────────────────────────────────── */}
      <Footer     content={activeContent} />
      <StickyBar  contact={contact}       onEnquire={openEnquiry} />
      <FloatingWA contact={contact} />

      {/* ── Lead capture modal — portal-rendered ──────────────────────── */}
      <LeadModal
        context={leadCtx}
        onClose={closeEnquiry}
        whatsapp={contact.whatsapp}
        content={activeContent}
      />
    </div>
  )
}
