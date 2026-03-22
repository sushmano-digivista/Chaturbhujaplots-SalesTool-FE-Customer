/**
 * fallbackContent.js — Shown when the backend API is offline.
 * All data sourced from official project brochures.
 */
const FALLBACK_CONTENT = {
  hero: {
    headline:       'Premium Plots Near',
    subheadline:    'Amaravati',
    description:    "A name rooted in integrity — Chaturbhuja Properties & Infra has been shaping Andhra Pradesh's real estate landscape for 25 years. Under the leadership of Mr. Donepudi Durga Prasad, we have placed 1200+ families in homes they are proud of, across 15+ APCRDA & RERA approved ventures in the Krishna–NTR–Guntur corridor.",
    approvalBadges: [
      'APCRDA Proposed Layouts',
      'AP RERA Registered',
      '25 Years · 15+ Projects · 1200+ Families',
    ],
  },

  urgency: {
    plotsLeft:         68,
    soldThisMonth:     8,
    priceRisePercent:  18,
    openProjects:      4,
    completedProjects: 11,
    happyFamilies:     '1200+',
  },

  stats: [
    { value: '731+', label: 'Total Plots'      },
    { value: '8 km', label: 'From Amaravati'   },
    { value: '2025', label: 'APCRDA Approved'  },
  ],

  portfolio: {
    stats: [
      { value: '25+',   label: 'Years in Industry',   icon: '🏆' },
      { value: '15+',   label: 'Projects Delivered',  icon: '🏗' },
      { value: '1200+', label: 'Happy Customers',     icon: '🏠' },
      { value: '100%',  label: 'APCRDA / RERA',       icon: '✅' },
    ],
    active: [], // loaded from projects.js at runtime
    completed: [],
  },

  gallery: [
    { label: 'Grand Entrance Arch',       icon: '🏛️' },
    { label: 'Avenue Lined Roads',        icon: '🛣️' },
    { label: 'Green Parks & Gardens',     icon: '🌿' },
    { label: 'Plot Layout — Aerial View', icon: '🏞️' },
    { label: 'Tree Avenue Plantation',    icon: '🌴' },
    { label: 'Children\'s Play Area',     icon: '🎡' },
    { label: 'Security Gate & Arch',      icon: '🔒' },
  ],

  videos: [
    { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Anjana Paradise — Project Overview',  subtitle: 'Full property walkthrough & amenities' },
    { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Location & Connectivity',             subtitle: 'Paritala to Amaravati route explained'  },
    { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Amenities Showcase',                  subtitle: 'Infrastructure, parks & lifestyle'      },
  ],

  highlights: [
    { icon: '🛣️', title: 'Adjacent to NH-16',         description: 'Direct frontage to National Highway 16.',                    sortOrder: 1 },
    { icon: '🏛️', title: '8–12 km from Amaravati',    description: 'Minutes from AP\'s new capital city.',                       sortOrder: 2 },
    { icon: '🚆', title: 'Railway Connectivity',       description: 'Govt. proposed railway from Amaravati to Paritala.',         sortOrder: 3 },
    { icon: '🏭', title: 'Paritala Logistic Hub',      description: 'Upcoming Govt. proposed industrial & logistics corridor.',   sortOrder: 4 },
    { icon: '🎓', title: 'Educational Institutions',   description: 'Amrita Sai, MVR, NRI Medical College within 10 km.',        sortOrder: 5 },
    { icon: '🏏', title: 'Mulapadu Stadium',           description: 'International-grade cricket stadium nearby.',               sortOrder: 6 },
  ],

  amenities: [
    { tab: 'INFRA',     icon: '🏛️', label: 'Grand Entrance Arch',          sortOrder: 1, featured: false },
    { tab: 'INFRA',     icon: '🛣️', label: 'BT / CC Roads',                sortOrder: 2, featured: false },
    { tab: 'INFRA',     icon: '💡', label: 'Overhead Electricity Lines',    sortOrder: 3, featured: false },
    { tab: 'INFRA',     icon: '💧', label: 'Overhead Tank + Pipeline',      sortOrder: 4, featured: false },
    { tab: 'INFRA',     icon: '🏗️', label: 'Drainage System',               sortOrder: 5, featured: false },
    { tab: 'INFRA',     icon: '🧱', label: 'Compound Wall',                  sortOrder: 6, featured: false },
    { tab: 'INFRA',     icon: '🙏', label: 'Hanuman Temple Nearby',          sortOrder: 7, featured: true,
      featuredDesc: 'A magnificent large Hanuman statue temple is located just minutes from Anjana Paradise.' },
    { tab: 'LIFESTYLE', icon: '🏃', label: 'Jogging Track',                 sortOrder: 1, featured: false },
    { tab: 'LIFESTYLE', icon: '☮️', label: '100% Vaastu Compliant',         sortOrder: 2, featured: false },
    { tab: 'LIFESTYLE', icon: '🎡', label: 'Children\'s Play Area',         sortOrder: 3, featured: false },
    { tab: 'LIFESTYLE', icon: '🌸', label: 'Avenue Plantation',             sortOrder: 4, featured: false },
    { tab: 'LIFESTYLE', icon: '🏞️', label: 'Modern Park / Open Space',     sortOrder: 5, featured: false },
    { tab: 'UTILITIES', icon: '🌐', label: 'Name & Number Board per Plot',  sortOrder: 1, featured: false },
    { tab: 'UTILITIES', icon: '⚡', label: 'LED Street Lights',             sortOrder: 2, featured: false },
    { tab: 'UTILITIES', icon: '🏦', label: 'Home Loans Through Banks',      sortOrder: 3, featured: false },
    { tab: 'UTILITIES', icon: '🚰', label: 'Pure Drinking Water 24/7',     sortOrder: 4, featured: false },
  ],

  distances: [
    { icon: '🏛️', name: 'Amaravati Capital',      subtitle: 'New State Capital City',   distance: '8 km',  sortOrder: 1 },
    { icon: '🛣️', name: 'National Highway NH-16', subtitle: 'Adjacent — direct access', distance: '0 km',  sortOrder: 2 },
    { icon: '🎓', name: 'Engineering Colleges',   subtitle: 'Amrita Sai, MVR, MIC',     distance: '5 km',  sortOrder: 3 },
    { icon: '🏥', name: 'Nimra Medical College',  subtitle: 'Healthcare hub',            distance: '7 km',  sortOrder: 4 },
    { icon: '🏏', name: 'Mulapadu Stadium',       subtitle: 'International facility',   distance: '6 km',  sortOrder: 5 },
    { icon: '✈️', name: 'Vijayawada Airport',     subtitle: 'Air connectivity',         distance: '22 km', sortOrder: 6 },
  ],

  quote: {
    investLine1: 'Invest Today —',
    investLine2: 'Reap 10× Tomorrow',
    quote:       "If you invest in Chaturbhuja plots today, in a few years it will be 10 times your investment — backed by APCRDA approval and the Amaravati growth story.",
    stats: [
      { value: '10×',  label: 'Expected Return' },
      { value: '5–7',  label: 'Years Horizon'   },
      { value: '100%', label: 'APCRDA / RERA'   },
    ],
  },

  contact: {
    phone:       '+91 89772 62683',
    whatsapp:    '918977262683',
    email:       'info@chaturbhuja.in',
    address:     'Flat No. 101, Venkat Meadows, Patamata, Vijayawada – 520007',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Paritala,Andhra+Pradesh,India&t=k&z=14&ie=UTF8&iwloc=&output=embed',
    mapOpenUrl:  'https://maps.google.com/?q=Paritala,Krishna+District,Andhra+Pradesh',
  },
}

export default FALLBACK_CONTENT
