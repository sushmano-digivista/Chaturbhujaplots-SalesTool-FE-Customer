import { useState, useCallback } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { useContent } from '@/hooks/useData'

import Navbar    from '@/components/layout/Navbar'
import { Footer, StickyBar, FloatingWA } from '@/components/layout/Footer'

import Hero      from '@/components/sections/Hero'
import PlotGrid  from '@/components/sections/PlotGrid'
import LeadModal from '@/components/ui/LeadModal'

import {
  HighlightsSection,
  AmenitiesSection,
  QuoteSection,
  LocationSection,
  ContactSection,
} from '@/components/sections/Sections'

import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
})

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--green)', color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px', borderRadius: '100px', padding: '12px 22px',
          },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#fff' } },
        }}
      />
      <CustomerSite />
    </QueryClientProvider>
  )
}

// ── Customer Site ─────────────────────────────────────────────────────────────
function CustomerSite() {
  const { data: content, isLoading } = useContent()
  const [leadCtx, setLeadCtx] = useState(null)   // null = modal closed

  /**
   * Universal enquiry opener — any component calls this with a context object.
   * context = { source, label, category?, plotNumber?, type? }
   */
  const openEnquiry = useCallback(ctx => setLeadCtx(ctx), [])
  const closeEnquiry = useCallback(() => setLeadCtx(null), [])

  const contact = content?.contact || {}

  if (isLoading) return <PageLoader />

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <Navbar contact={contact} onEnquire={openEnquiry} />

      {/* ── Page sections ───────────────────────────────────────────────── */}
      <main>
        {/* 1. Hero — with Enquire Now, Book Visit, Get Brochure CTAs */}
        <Hero content={content} onEnquire={openEnquiry} />

        {/* 2. Investment quote banner */}
        <QuoteSection content={content} onEnquire={openEnquiry} />

        {/* 3. Location highlights */}
        <HighlightsSection content={content} />

        {/* 4. Interactive plot grid — CORE feature */}
        <PlotGrid onEnquire={openEnquiry} />

        {/* 5. Amenities */}
        <AmenitiesSection content={content} />

        {/* 6. Location map + distances */}
        <LocationSection content={content} />

        {/* 7. Contact / lead capture */}
        <ContactSection content={content} onEnquire={openEnquiry} />
      </main>

      {/* ── Layout chrome ───────────────────────────────────────────────── */}
      <Footer content={content} />

      {/* 5 lead touchpoints: Hero CTA + Per-category + Contact form
          + Sticky bar (below) + Floating WA (below) */}
      <StickyBar   contact={contact} onEnquire={openEnquiry} />
      <FloatingWA  contact={contact} onEnquire={openEnquiry} />

      {/* ── Universal lead modal ────────────────────────────────────────── */}
      <LeadModal
        context={leadCtx}
        onClose={closeEnquiry}
        whatsapp={contact.whatsapp}
      />
    </div>
  )
}

function PageLoader() {
  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'var(--cream)',
    }}>
      <div style={{
        width:40, height:40, borderRadius:'50%',
        border:'3px solid var(--green-light)',
        borderTop:'3px solid var(--green)',
        animation:'spin 0.8s linear infinite',
      }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
