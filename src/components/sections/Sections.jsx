/**
 * Sections.jsx — backwards-compatibility re-export shim.
 *
 * All implementations have been split into individual files.
 * Import directly from the individual files for new code, e.g.:
 *
 *   import PortfolioSection  from '@/components/sections/PortfolioSection'
 *   import GallerySection    from '@/components/sections/GallerySection'
 *
 * Or use the barrel index:
 *   import { PortfolioSection, GallerySection, ... } from '@/components/sections'
 *
 * Section files:
 *   Hero.jsx              — two-column hero with urgency card
 *   PortfolioSection.jsx  — tabbed active/completed projects grid
 *   GallerySection.jsx    — masonry gallery with lightbox
 *   VideosSection.jsx     — video thumbnails with modal player
 *   HighlightsSection.jsx — location advantages grid
 *   AmenitiesSection.jsx  — tabbed amenities (INFRA / LIFESTYLE / UTILITIES)
 *   QuoteSection.jsx      — investment opportunity banner
 *   LocationSection.jsx   — embedded map + distance cards
 *   ContactSection.jsx    — contact info + CTA buttons
 *   PlotGrid.jsx          — plot category cards + SVG layout map
 */

export { default as PortfolioSection }   from './PortfolioSection'
export { default as GallerySection }     from './GallerySection'
export { default as VideosSection }      from './VideosSection'
export { default as HighlightsSection }  from './HighlightsSection'
export { default as AmenitiesSection }   from './AmenitiesSection'
export { default as QuoteSection }       from './QuoteSection'
export { default as LocationSection }    from './LocationSection'
export { default as ContactSection }     from './ContactSection'
