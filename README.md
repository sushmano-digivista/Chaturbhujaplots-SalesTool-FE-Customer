# Customer Frontend — Anjana Paradise Platform

**Read-only, no-authentication** customer-facing lead generation site for Anjana Paradise plotted development near Amaravati, Andhra Pradesh.

## Tech Stack
- React 18 · Vite · Framer Motion
- TanStack Query (data fetching)
- React Hook Form (lead forms)
- MSW + Vitest + Testing Library (tests)

## Port
`3000`

## Key Design Decisions
- **No auth** — entirely public, read-only data display
- **No availability status** — plots shown by category (facing + corner), not Available/Sold/Hold
- **CMS-driven** — all content (hero, highlights, amenities, contact) fetched from dashboard-service
- **5 lead touchpoints** — Hero CTAs, per-category enquiry, contact form, sticky bar, floating WhatsApp

## Running Locally
```bash
npm install
npm run dev
# Requires dashboard-service on :8082 and plot-service on :8083
```

## Running Tests
```bash
npm test                  # run all
npm run test:watch        # watch mode
npm run test:coverage     # with coverage report
```

## Lead Touchpoints
| # | Where | Source Tag |
|---|-------|-----------|
| 1 | Hero section CTAs | `HERO_CTA` |
| 2 | Per-category expand → Enquire button | `CATEGORY_ENQUIRY` |
| 3 | Contact section buttons | `CONTACT_FORM` |
| 4 | Mobile sticky bottom bar | `STICKY_BAR` |
| 5 | Floating WhatsApp button | `FLOATING_BUTTON` |

## Part of Anjana Paradise Platform
| Service | Port |
|---------|------|
| common-service | 8081 |
| dashboard-service | 8082 |
| plot-service | 8083 |
| **customer-frontend** | 3000 ← this repo |
