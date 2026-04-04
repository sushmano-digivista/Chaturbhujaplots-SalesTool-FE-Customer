import { useState, useEffect, useCallback } from 'react'

import { useContent, usePricing } from '@/hooks/useData'
import FALLBACK_CONTENT from '@/constants/fallbackContent'

import { Navbar, Footer, StickyBar, FloatingWA } from '@/components/layout'
import {
  Hero, PlotGrid, PortfolioSection, GallerySection, VideosSection,
  HighlightsSection, AmenitiesSection, QuoteSection, LocationSection, ContactSection,
} from '@/components/sections'
import { LeadModal } from '@/components/ui'
import PageLoader from '@/components/common/PageLoader'

// Animation duration in ms -- must match CSS animation total in PageLoader
const LOADER_MIN_MS = 2800

export default function HomePage() {
  const { data: content, isLoading, isError } = useContent()
  const { data: pricingMap } = usePricing()
  const [leadCtx,     setLeadCtx]     = useState(null)
  const [showLoader,  setShowLoader]  = useState(true)

  const openEnquiry  = useCallback((ctx) => setLeadCtx(ctx), [])
  const closeEnquiry = useCallback(() => setLeadCtx(null),   [])

  // Guarantee the PageLoader shows for at least LOADER_MIN_MS
  // so the full SVG animation always completes before content appears
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), LOADER_MIN_MS)
    return () => clearTimeout(timer)
  }, [])


  // SEO: Set page title
  useEffect(() => {
    document.title = 'ChaturbhujaPlots | Premium DTCP & RERA Approved Plots Near Amaravati, AP'
  }, [])

  // Show loader until BOTH the timer has elapsed AND data has loaded
  if ((isLoading && !isError) || showLoader) return <PageLoader />

  const activeContent = content || FALLBACK_CONTENT
  const contact       = activeContent?.contact || {}

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <Navbar contact={contact} onEnquire={openEnquiry} />
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
      <Footer     content={activeContent} />
      <StickyBar  contact={contact}       onEnquire={openEnquiry} />
      <FloatingWA contact={contact} />
      <LeadModal
        context={leadCtx}
        onClose={closeEnquiry}
        whatsapp={contact.whatsapp}
        content={activeContent}
      />
    </div>
  )
}

