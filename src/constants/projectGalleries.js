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
const imageModules = import.meta.glob(
  '../assets/gallery/chaturbhuja/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
)

// ── Auto-glob all videos ───────────────────────────────────────────────────
const videoModules = import.meta.glob(
  '../assets/videos/chaturbhuja/**/*.{mp4,webm,mov}',
  { eager: true }
)

// Folder name → project ID
const FOLDER_TO_ID = {
  paritala:     'anjana',
  varaha:       'varaha',
  chevitikallu: 'aparna',
  trimbak:      'trimbak',
}

function buildMap(modules) {
  const result = {}

  Object.keys(modules).sort().forEach((path) => {
    // Extract folder name from path: ../assets/gallery/chaturbhuja/paritala/001.jpeg
    const parts  = path.split('/')
    const folder = parts[parts.length - 2]   // e.g. 'paritala'
    const projId = FOLDER_TO_ID[folder]
    if (!projId) return                        // skip root-level files

    const url    = modules[path].default       // Vite resolves to hashed URL
    const name   = parts[parts.length - 1]     // e.g. '001.jpeg'
    const label  = name
      .replace(/\.\w+$/, '')                   // strip extension
      .replace(/^\d+[-_]?/, '')                // strip leading number
      .replace(/[-_]/g, ' ')                   // hyphens/underscores → spaces
      .trim() || name.replace(/\.\w+$/, '')    // fallback: filename without ext

    if (!result[projId]) result[projId] = []
    result[projId].push({ src: url, label, name })
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
