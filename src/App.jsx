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
  PortfolioSection,
  GallerySection,
  VideosSection,
  HighlightsSection,
  AmenitiesSection,
  QuoteSection,
  LocationSection,
  ContactSection,
} from '@/components/sections/Sections'

import '@/styles/globals.css'

// ── Fallback content ─────────────────────────────────────────
const FALLBACK_CONTENT = {
  hero: {
    headline:    'Premium Plots Near',
    subheadline: 'Amaravati',
    description: 'Own a piece of Andhra Pradesh\'s fastest-growing capital corridor. CRDA Proposed Layout with 100% Clear Title in Paritala — just 8 km from Amaravati, the New State Capital. Avenue-lined roads, 24/7 water, overhead electricity & ready for immediate construction. 242 thoughtfully planned plots, priced to invest today.',
    approvalBadges: ['CRDA Approved · LP No: 35/2025', 'AP RERA · P06060125894', 'Ready for Construction'],
  },
  urgency: {
    plotsLeft:         14,
    soldThisMonth:     6,
    priceRisePercent:  18,
    openProjects:      4,
    completedProjects: 6,
    happyFamilies:     '1000+',
  },
  stats: [
    { value: '242',  label: 'Total Plots'    },
    { value: '8 km', label: 'From Amaravati' },
    { value: '2025', label: 'CRDA Approved'  },
  ],
  portfolio: {
    stats: [
      { value: '10+',   label: 'Projects'  },
      { value: '1000+', label: 'Families'  },
      { value: '15+',   label: 'Years'     },
      { value: '100%',  label: 'Approved'  },
    ],
    active: [
      {
        id: 'anjana', name: 'Anjana Paradise', loc: 'Paritala, Near Amaravati',
        color: 'c1', available: 14, total: 242, starting: 'Rs.23.9L',
        approvals: ['CRDA Proposed', 'AP RERA', 'Clear Title', 'Vaasthu'],
        highlights: ['Adjacent to NH-16', '8km from Amaravati', 'Ready to Build', 'Avenue Lined Roads'],
      },
      {
        id: 'trimbak', name: 'Trimbak Oaks', loc: 'Penamaluru, Near Vijayawada',
        color: 'c2', available: 18, total: 48, starting: 'Rs.28L',
        approvals: ['CRDA Approved', 'RERA Registered', 'Clear Title'],
        highlights: ['5km from Vijayawada', 'NH-16 Access', 'Gated Security', 'Water & Electricity'],
      },
      {
        id: 'aparna', name: 'Aparna Legacy', loc: 'Chevitikallu',
        color: 'c3', available: 16, total: 28, starting: 'Rs.26L',
        approvals: ['CRDA Approved', 'Vaastu Compliant', 'East-Facing'],
        highlights: ['East-Facing Plots', 'Park Facing Options', 'Corner Plots Available', 'Water & Electricity'],
      },
      {
        id: 'varaha', name: 'Varaha Virtue', loc: 'Pamarru, Near NH-16',
        color: 'c4', available: 20, total: 32, starting: 'Rs.25L',
        approvals: ['CRDA Approved', 'NH-16 Access', 'Industrial Corridor'],
        highlights: ['Direct NH-16 Access', 'Industrial Corridor Zone', 'Gated Security 24/7', 'Jogging Track'],
      },
    ],
    completed: [
      { name: 'Nandana Vihar', loc: 'Kanumuru'   },
      { name: 'County',        loc: 'Edupugallu'  },
      { name: 'Pearl',         loc: 'Kankipadu'   },
      { name: 'Empire',        loc: 'Penamaluru'  },
      { name: 'Pride',         loc: 'Nepalli'     },
      { name: 'Prime',         loc: 'Kankipadu'   },
    ],
  },
  gallery: [
    { label: 'Grand Entrance Arch',   icon: '🏛️' },
    { label: 'Avenue Lined Roads',    icon: '🛣️' },
    { label: 'Green Parks & Gardens', icon: '🌿' },
    { label: 'Plot Layout View',      icon: '🏞️' },
    { label: 'Tree Avenue',           icon: '🌴' },
    { label: 'Floral Gardens',        icon: '🌺' },
    { label: 'Security Gate',         icon: '🔒' },
  ],
  videos: [
    { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Anjana Paradise — Project Overview',    subtitle: 'Full property walkthrough & amenities' },
    { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Location & Connectivity',               subtitle: 'Paritala to Amaravati route explained'  },
    { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Amenities Showcase',                    subtitle: 'Infrastructure, parks & lifestyle'       },
  ],
  highlights: [
    { icon: '🛣️', title: 'Near National Highway',    description: 'Direct access to NH-16, connecting major cities.',          sortOrder: 1 },
    { icon: '🏛️', title: '8 km from Amaravati',      description: 'Minutes from AP\'s new capital city.',                      sortOrder: 2 },
    { icon: '🚆', title: 'Road & Rail Connectivity', description: 'Proposed express highway and railway expansion.',            sortOrder: 3 },
    { icon: '🏭', title: 'Logistic Hub, Paritala',   description: 'Upcoming industrial and logistics corridor.',               sortOrder: 4 },
    { icon: '🎓', title: 'Educational & Medical',    description: 'SRM, NRI Medical College within 10 km.',                    sortOrder: 5 },
    { icon: '🏏', title: 'Mulapadu Stadium',         description: 'International-grade cricket stadium nearby.',               sortOrder: 6 },
  ],
  amenities: [
    { tab: 'INFRA',     icon: '🏛️', label: 'Grand Entrance Arch',      sortOrder: 1, featured: false },
    { tab: 'INFRA',     icon: '🛤️', label: '60ft & 40ft Roads',         sortOrder: 2, featured: false },
    { tab: 'INFRA',     icon: '💡', label: 'Underground Electricity',   sortOrder: 3, featured: false },
    { tab: 'INFRA',     icon: '💧', label: 'Water Pipeline',            sortOrder: 4, featured: false },
    { tab: 'INFRA',     icon: '🅿️', label: 'Visitor Parking',           sortOrder: 5, featured: false },
    { tab: 'INFRA',     icon: '🔒', label: 'Gated Security',            sortOrder: 6, featured: false },
    { tab: 'INFRA',     icon: '🙏', label: 'Hanuman Temple Nearby',     sortOrder: 7, featured: true,
      featuredDesc: 'A magnificent large Hanuman statue temple is located just minutes from Anjana Paradise.' },
    { tab: 'LIFESTYLE', icon: '🏃', label: 'Jogging Track',             sortOrder: 1, featured: false },
    { tab: 'LIFESTYLE', icon: '☮️', label: '100% Vaastu Compliant',     sortOrder: 2, featured: false },
    { tab: 'LIFESTYLE', icon: '🗿', label: 'Buddha Statue',             sortOrder: 3, featured: false },
    { tab: 'LIFESTYLE', icon: '🌸', label: 'Floral Gardens',            sortOrder: 4, featured: false },
    { tab: 'UTILITIES', icon: '🌐', label: 'Fibre Internet Ready',      sortOrder: 1, featured: false },
    { tab: 'UTILITIES', icon: '⚡', label: 'Solar Street Lights',       sortOrder: 2, featured: false },
    { tab: 'UTILITIES', icon: '📡', label: 'CCTV Surveillance',         sortOrder: 3, featured: false },
  ],
  distances: [
    { icon: '🏛️', name: 'Amaravati Capital',      subtitle: 'New State Capital City',  distance: '8 km',  sortOrder: 1 },
    { icon: '🛣️', name: 'National Highway NH-16', subtitle: 'Direct connectivity',     distance: '3 km',  sortOrder: 2 },
    { icon: '🎓', name: 'SRM University',          subtitle: 'Engineering & Medical',   distance: '6 km',  sortOrder: 3 },
    { icon: '🏥', name: 'NRI Medical College',     subtitle: 'Healthcare hub',          distance: '7 km',  sortOrder: 4 },
    { icon: '🏏', name: 'Mulapadu Stadium',        subtitle: 'International facility',  distance: '4 km',  sortOrder: 5 },
    { icon: '✈️', name: 'Vijayawada Airport',      subtitle: 'Air connectivity',        distance: '22 km', sortOrder: 6 },
  ],
  quote: {
    investLine1: 'Invest ₹2 Today —',
    investLine2: 'Receive ₹20 Tomorrow',
    quote: 'If you invest 2 rupees now, in a few years it will be 10 times your investment.',
    stats: [
      { value: '10×',  label: 'Expected Return' },
      { value: '5–7',  label: 'Years Horizon'   },
      { value: 'Safe', label: 'CRDA + RERA'     },
    ],
  },
  contact: {
    phone:       '+91 99999 99999',
    whatsapp:    '919999999999',
    email:       'info@anjanaparadise.in',
    address:     'Paritala, Krishna District, Andhra Pradesh 521180',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Paritala,Andhra+Pradesh,India&t=k&z=14&ie=UTF8&iwloc=&output=embed',
    mapOpenUrl:  'https://maps.google.com/?q=Paritala,Krishna+District,Andhra+Pradesh',
  },
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000, throwOnError: false },
  },
})

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

function CustomerSite() {
  const { data: content, isLoading, isError } = useContent()
  const [leadCtx, setLeadCtx] = useState(null)

  const openEnquiry  = useCallback(ctx => setLeadCtx(ctx), [])
  const closeEnquiry = useCallback(() => setLeadCtx(null), [])

  const activeContent = content || FALLBACK_CONTENT
  const contact       = activeContent?.contact || {}

  if (isLoading && !isError) return <PageLoader />

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <Navbar contact={contact} onEnquire={openEnquiry} />

      <main>
        <Hero              content={activeContent} onEnquire={openEnquiry} />
        <PortfolioSection  content={activeContent} onEnquire={openEnquiry} />
        <GallerySection    content={activeContent} />
        <VideosSection     content={activeContent} />
        <QuoteSection      content={activeContent} onEnquire={openEnquiry} />
        <HighlightsSection content={activeContent} />
        <PlotGrid          onEnquire={openEnquiry} />
        <AmenitiesSection  content={activeContent} />
        <LocationSection   content={activeContent} />
        <ContactSection    content={activeContent} onEnquire={openEnquiry} />
      </main>

      <Footer    content={activeContent} />
      <StickyBar contact={contact}       onEnquire={openEnquiry} />
      <FloatingWA contact={contact} />

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
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--cream)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid var(--green-light)',
        borderTop: '3px solid var(--green)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
