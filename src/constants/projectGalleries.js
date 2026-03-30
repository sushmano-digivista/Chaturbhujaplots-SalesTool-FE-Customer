/**
 * projectGalleries.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses Vite's import.meta.glob to auto-detect ALL images and videos.
 * No hardcoded filenames — just drop files in the correct folder.
 *
 * Gallery images:  src/assets/gallery/chaturbhuja/<project>/
 * Videos:          src/assets/videos/chaturbhuja/<project>/
 *
 * Supported image formats: .jpg .jpeg .png .webp .avif
 * Supported video formats: .mp4 .webm .mov
 *
 * Folder → project ID mapping:
 *   paritala/     → anjana
 *   varaha/       → varaha
 *   chevitikallu/ → aparna
 *   trimbak/      → trimbak  (create folder when images are ready)
 */

// ── Auto-glob all images ───────────────────────────────────────────────────
const imageModules = {
  ...import.meta.glob('/src/assets/gallery/chaturbhuja/**/*.{jpg,jpeg,png,webp,avif}', { eager: true }),
}

// ── Auto-glob all videos ───────────────────────────────────────────────────
const videoModules = {
  ...import.meta.glob('/src/assets/videos/chaturbhuja/**/*.{mp4,webm,mov}', { eager: true }),
}

// Folder name → project ID
const FOLDER_TO_ID = {
  paritala:     'anjana',
  varaha:       'varaha',
  chevitikallu: 'aparna',
  trimbak:      'trimbak',
}

// Human-readable project labels per folder
const FOLDER_LABELS = {
  paritala:     'Anjana Paradise @ Paritala',
  varaha:       'Varaha Virtue @ Pamarru',
  chevitikallu: 'Aparna Legacy @ Chevitikallu',
  trimbak:      'Trimbak Oaks @ Penamaluru',
}

function buildMap(modules) {
  const result = {}

  Object.keys(modules).sort((a, b) => a.localeCompare(b)).forEach((path) => {
    const parts     = path.split('/')
    const folder    = parts[parts.length - 2]
    const projId    = FOLDER_TO_ID[folder]
    if (!projId) return

    const url    = modules[path].default
    const name   = parts[parts.length - 1]
    // File label: clean filename (strip number prefix + extension)
    const fileLabel = name
      .replace(/\.\w+$/, '')
      .replace(/^\d+[-_]?/, '')
      .replace(/[-_]/g, ' ')
      .trim()
    // Title shown to user: cleaned filename OR project location label
    const title   = fileLabel || FOLDER_LABELS[folder] || name
    const subtitle = FOLDER_LABELS[folder] || ''

    if (!result[projId]) result[projId] = []
    result[projId].push({ src: url, label: title, subtitle, name })
  })

  return result
}

const galleryMap = buildMap(imageModules)
const videoMap   = buildMap(videoModules)

/**
 * getProjectGallery(projectId: string) → Array<{ src, label }>
 * Returns sorted image list for the project. Empty array if none found.
 */
export function getProjectGallery(projectId) {
  return galleryMap[projectId] || []
}

/**
 * getProjectVideos(projectId: string) → Array<{ src, label, name }>
 * Returns sorted video list for the project. Empty array if none found.
 */
export function getProjectVideos(projectId) {
  return videoMap[projectId] || []
}

// Legacy named export for GallerySection.jsx (home page gallery)
export const PROJECT_GALLERIES = galleryMap
