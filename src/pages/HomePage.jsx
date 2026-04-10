import { useState, useEffect, useCallback } from 'react'

import { useContent, usePricing } from '@/hooks/useData'
import FALLBACK_CONTENT from '@/constants/fallbackContent'

import { Navbar, Footer, StickyBar, FloatingWA } from '@/components/layout'
import {
  Hero, PlotGrid, PortfolioSection, GallerySection, VideosSection,
  HighlightsSection, AmenitiesSection, QuoteSection, LocationSection, ContactSection,
} from '@/components/sections'
import { LeadModal } from '@/components/ui'
import PageLoader    from '@/components/common/PageLoader'
import LaunchBanner  from '@/components/ui/LaunchBanner'
import LaunchOverlay from '@/components/ui/LaunchOverlay'

// Animation duration in ms -- must match CSS animation total in PageLoader
const LOADER_MIN_MS = 2800

// Use a window-level flag to distinguish real page loads from SPA navigations.
// On real page load (refresh/new tab): flag is absent → clear overlay, set flag.
// On SPA nav back to Home: flag is present → skip.
if (!window.__chaturbhuja_loaded) {
  window.__chaturbhuja_loaded = true
  try {
    sessionStorage.removeItem('home_loader_shown')
    sessionStorage.removeItem('launch_overlay_shown')
  } catch {}
}

function loaderWasShown() { try { return sessionStorage.getItem('home_loader_shown') === '1' } catch { return false } }
function markLoaderShown() { try { sessionStorage.setItem('home_loader_shown', '1') } catch {} }

export default function HomePage() {
  const { data: content, isLoading, isError } = useContent()
  const { data: pricingMap } = usePricing()
  const [leadCtx,     setLeadCtx]     = useState(null)
  const [isFirstVisit] = useState(() => !loaderWasShown())
  const [showLoader,  setShowLoader]  = useState(isFirstVisit)

  const openEnquiry  = useCallback((ctx) => setLeadCtx(ctx), [])
  const closeEnquiry = useCallback(() => setLeadCtx(null),   [])

  // Mark loader as shown immediately so any navigation away + back skips it
  useEffect(() => {
    markLoaderShown()
  }, [])

  // Guarantee the PageLoader shows for at least LOADER_MIN_MS on first visit
  // so the full SVG animation always completes before content appears
  useEffect(() => {
    if (!isFirstVisit) return
    const timer = setTimeout(() => setShowLoader(false), LOADER_MIN_MS)
    return () => clearTimeout(timer)
  }, [])

  // SEO: Set page title
  useEffect(() => {
    document.title = 'ChaturbhujaPlots | Premium APCRDA & RERA Approved Plots Near Amaravati, AP'
  }, [])

  // Show loader until BOTH the timer has elapsed AND data has loaded (first visit only)
  if (isFirstVisit && ((isLoading && !isError) || showLoader)) return <PageLoader />

  const activeContent = content || FALLBACK_CONTENT
  const contact       = activeContent?.contact || {}

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <LaunchOverlay />
      <LaunchBanner />
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

