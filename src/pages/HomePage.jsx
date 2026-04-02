import { useState, useEffect, useCallback } from 'react'

import { useContent, usePricing }   from '@/hooks/useData'
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
import { useLocation } from 'react-router-dom'


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
export default function HomePage() {
  const location = useLocation()

useEffect(() => {
  const params = new URLSearchParams(location.search)
  const scrollTarget = params.get('scrollTo')
  if (scrollTarget) {
    setTimeout(() => {
      const el = document.getElementById(scrollTarget)
      if (!el) return
      const navHeight = document.querySelector('[class*="navbar"]')?.offsetHeight || 68
      window.scrollTo({ top: el.offsetTop - navHeight, behavior: 'smooth' })
    }, 300)
  }
}, [location.search])
  const { data: content, isLoading, isError } = useContent()
  const { data: pricingMap } = usePricing()
  const [leadCtx,     setLeadCtx]     = useState(null)
  const openEnquiry  = useCallback((ctx) => setLeadCtx(ctx), [])
  const closeEnquiry = useCallback(() => setLeadCtx(null),   [])

  // Show full-screen loader only on the very first load (not on API error)
  if (isLoading && !isError) return <PageLoader />

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
        <PortfolioSection pricingMap={pricingMap}  content={activeContent} onEnquire={openEnquiry} />
        <GallerySection    content={activeContent} />
        <VideosSection     content={activeContent} />
        <QuoteSection      content={activeContent} onEnquire={openEnquiry} />
        <HighlightsSection content={activeContent} />
        <PlotGrid pricingMap={pricingMap}                                  onEnquire={openEnquiry} />
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

