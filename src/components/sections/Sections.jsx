/**
 * Sections.jsx — backwards-compatibility re-export shim.
 *
 * Each section now lives in its own file for clarity and reusability.
 * Import directly from the individual files for new code:
 *
 *   import HighlightsSection from '@/components/sections/HighlightsSection'
 *   import AmenitiesSection  from '@/components/sections/AmenitiesSection'
 *   import QuoteSection      from '@/components/sections/QuoteSection'
 *   import LocationSection   from '@/components/sections/LocationSection'
 *   import ContactSection    from '@/components/sections/ContactSection'
 *
 * Or use the barrel index:
 *   import { HighlightsSection, AmenitiesSection, ... } from '@/components/sections'
 */

export { default as HighlightsSection } from './HighlightsSection'
export { default as AmenitiesSection }  from './AmenitiesSection'
export { default as QuoteSection }      from './QuoteSection'
export { default as LocationSection }   from './LocationSection'
export { default as ContactSection }    from './ContactSection'
