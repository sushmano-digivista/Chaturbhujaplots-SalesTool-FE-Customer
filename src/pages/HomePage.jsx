import { useState, useCallback } from 'react'

import { useContent }   from '@/hooks/useData'
import FALLBACK_CONTENT from '@/constants/fallbackContent'

// ── Layout components (each in its own file) ──────────────────────────────────
import { Navbar, Footer, StickyBar, FloatingWA } from '@/components/layout'

// ── Section components (each in its own file) ─────────────────────────────────
import {
  Hero,
  PlotGrid,
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
 *   - Reordered by moving a single line here
 *   - Removed by commenting out a single line
 *   - Added elsewhere by importing the same component
 *
 * To add a new section:
 *   1. Create `src/components/sections/YourNewSection.jsx`
 *   2. Export it from `src/components/sections/index.js`
 *   3. Import it above and place <YourNewSection /> in <main> below
 */
export default function HomePage() {
  const { data: content, isLoading, isError } = useContent()
  const [leadCtx, setLeadCtx] = useState(null)

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
      />
    </div>
  )
}
