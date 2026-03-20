import { http, HttpResponse } from 'msw'

// ── Fixtures ──────────────────────────────────────────────────────────────────

export const MOCK_CONTENT = {
  id: 'CONTENT',
  hero: {
    headline: 'Premium Plots',
    subheadline: 'Amaravati',
    description: 'Secure your land 8 km from Andhra Pradesh\'s new capital.',
    approvalBadges: ['CRDA Approved · LP No: 35/2025', 'AP RERA · P06060125894'],
  },
  highlights: [
    { icon: '🛣️', title: 'Near National Highway', description: 'NH-16 access.', sortOrder: 1 },
    { icon: '🏛️', title: '8 km from Amaravati',  description: 'New capital city.', sortOrder: 2 },
  ],
  amenities: [
    { tab: 'INFRA',     icon: '🏛️', label: 'Grand Entrance Arch',      sortOrder: 1, featured: false },
    { tab: 'INFRA',     icon: '🙏', label: 'Hanuman Temple',            sortOrder: 2, featured: true,
      featuredDesc: 'A magnificent Hanuman temple nearby.' },
    { tab: 'LIFESTYLE', icon: '🏃', label: 'Jogging Track',             sortOrder: 1, featured: false },
    { tab: 'UTILITIES', icon: '🌐', label: 'Fibre Internet Ready',      sortOrder: 1, featured: false },
  ],
  distances: [
    { icon: '🏛️', name: 'Amaravati Capital', subtitle: 'New State Capital', distance: '8 km',  sortOrder: 1 },
    { icon: '🛣️', name: 'NH-16 Highway',     subtitle: 'Direct access',    distance: '3 km',  sortOrder: 2 },
    { icon: '✈️', name: 'Vijayawada Airport',subtitle: 'Air connectivity', distance: '22 km', sortOrder: 3 },
  ],
  quote: {
    investLine1: 'Invest ₹2 Today —',
    investLine2: 'Receive ₹20 Tomorrow',
    quote: 'If you invest 2 rupees now, it will be 10 times your investment.',
    stats: [
      { value: '10×', label: 'Expected Return' },
      { value: '5–7', label: 'Years Horizon' },
      { value: 'Safe', label: 'CRDA + RERA' },
    ],
  },
  stats: [
    { value: '120+', label: 'Total Plots' },
    { value: '8 km', label: 'From Amaravati' },
  ],
  contact: {
    phone: '+91 99999 99999',
    whatsapp: '919999999999',
    email: 'info@anjanaparadise.in',
    address: 'Paritala, Krishna District, AP',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Paritala',
    mapOpenUrl: 'https://maps.google.com/?q=Paritala',
  },
}

export const MOCK_PLOT_SUMMARY = {
  id: 'SUMMARY',
  totalPlots: 24,
  eastFacing: {
    label: 'East-Facing', count: 8,
    plotNumbers: ['P-001','P-003','P-005','P-010','P-013','P-017','P-018','P-023'],
    priceFrom: '₹23.9L', priceTo: '₹48.1L',
    description: 'Morning sunlight — ideal for Vaastu and wellness.',
  },
  westFacing: {
    label: 'West-Facing', count: 5,
    plotNumbers: ['P-002','P-007','P-011','P-015','P-019'],
    priceFrom: '₹23.9L', priceTo: '₹48.1L',
    description: 'Evening sunlight with open western views.',
  },
  northFacing: {
    label: 'North-Facing', count: 5,
    plotNumbers: ['P-004','P-008','P-012','P-016','P-020'],
    priceFrom: '₹23.9L', priceTo: '₹48.1L',
    description: 'Premium Vaastu orientation.',
  },
  southFacing: {
    label: 'South-Facing', count: 3,
    plotNumbers: ['P-006','P-014','P-022'],
    priceFrom: '₹23.9L', priceTo: '₹48.1L',
    description: 'South-facing with road access.',
  },
  cornerPlots: {
    label: 'Corner Plots', count: 5,
    plotNumbers: ['P-001','P-006','P-009','P-015','P-022'],
    priceFrom: '₹23.9L', priceTo: '₹48.1L',
    description: 'Premium corner plots with maximum road frontage.',
  },
  byDimension: [
    { dimension: '30×40', count: 8, areaLabel: '133 Sq Yd', priceFrom: '₹23.9L' },
    { dimension: '33×50', count: 8, areaLabel: '183 Sq Yd', priceFrom: '₹32.9L' },
    { dimension: '40×60', count: 8, areaLabel: '267 Sq Yd', priceFrom: '₹48.1L' },
  ],
  priceRangeLabel: '₹23.9L – ₹48.1L',
}

export const MOCK_LEAD_RESPONSE = {
  id: 'lead-test-1',
  name: 'Ravi Kumar',
  phone: '9876543210',
  source: 'HERO_CTA',
  status: 'NEW',
}

// ── MSW Handlers ──────────────────────────────────────────────────────────────

export const handlers = [
  // Content
  http.get('/api/dashboard/content', () =>
    HttpResponse.json(MOCK_CONTENT)),

  // Plot summary
  http.get('/api/plots/summary', () =>
    HttpResponse.json(MOCK_PLOT_SUMMARY)),

  // Lead submit
  http.post('/api/dashboard/leads', () =>
    HttpResponse.json(MOCK_LEAD_RESPONSE, { status: 201 })),
]

// Error handlers for negative tests
export const errorHandlers = {
  contentError: http.get('/api/dashboard/content', () =>
    HttpResponse.json({ message: 'Server error' }, { status: 500 })),

  plotSummaryError: http.get('/api/plots/summary', () =>
    HttpResponse.json({ message: 'Server error' }, { status: 500 })),

  leadSubmitValidationError: http.post('/api/dashboard/leads', () =>
    HttpResponse.json({ message: 'Validation failed' }, { status: 400 })),
}
