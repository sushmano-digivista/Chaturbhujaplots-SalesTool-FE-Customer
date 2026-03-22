/**
 * projectGalleries.js
 * Direct ES module imports for each project's gallery images.
 * Add new images: drop file in the folder and add an import + entry below.
 */

// ── Anjana Paradise — Paritala ────────────────────────────────────────────────
import ap01 from '@/assets/gallery/chaturbhuja/paritala/001.jpeg'
import ap02 from '@/assets/gallery/chaturbhuja/paritala/002.jpeg'
import ap03 from '@/assets/gallery/chaturbhuja/paritala/003.jpeg'
import ap04 from '@/assets/gallery/chaturbhuja/paritala/004.jpeg'
import ap05 from '@/assets/gallery/chaturbhuja/paritala/005.jpeg'
import ap06 from '@/assets/gallery/chaturbhuja/paritala/006.jpeg'
import ap07 from '@/assets/gallery/chaturbhuja/paritala/007.jpeg'
import ap08 from '@/assets/gallery/chaturbhuja/paritala/008.jpeg'
import ap09 from '@/assets/gallery/chaturbhuja/paritala/009.jpeg'

// ── Varaha Virtue — Pamarru ───────────────────────────────────────────────────
import vv01 from '@/assets/gallery/chaturbhuja/varaha/001.jpeg'
import vv02 from '@/assets/gallery/chaturbhuja/varaha/002.jpeg'
import vv03 from '@/assets/gallery/chaturbhuja/varaha/003.jpeg'
import vv04 from '@/assets/gallery/chaturbhuja/varaha/004.jpeg'
import vv05 from '@/assets/gallery/chaturbhuja/varaha/005.jpeg'
import vv06 from '@/assets/gallery/chaturbhuja/varaha/006.jpeg'
import vv07 from '@/assets/gallery/chaturbhuja/varaha/007.jpeg'
import vv08 from '@/assets/gallery/chaturbhuja/varaha/008.jpeg'
import vv09 from '@/assets/gallery/chaturbhuja/varaha/009.jpeg'
import vv10 from '@/assets/gallery/chaturbhuja/varaha/010.jpeg'
import vv11 from '@/assets/gallery/chaturbhuja/varaha/011.jpeg'
import vv12 from '@/assets/gallery/chaturbhuja/varaha/012.jpeg'
import vv13 from '@/assets/gallery/chaturbhuja/varaha/013.jpeg'
import vv14 from '@/assets/gallery/chaturbhuja/varaha/014.jpeg'
import vv15 from '@/assets/gallery/chaturbhuja/varaha/015.jpeg'
import vv16 from '@/assets/gallery/chaturbhuja/varaha/016.jpeg'

// ── Aparna Legacy — Chevitikallu ──────────────────────────────────────────────
import al01 from '@/assets/gallery/chaturbhuja/chevitikallu/001.jpeg'
import al02 from '@/assets/gallery/chaturbhuja/chevitikallu/002.jpeg'
import al03 from '@/assets/gallery/chaturbhuja/chevitikallu/003.jpeg'
import al04 from '@/assets/gallery/chaturbhuja/chevitikallu/004.jpeg'
import al05 from '@/assets/gallery/chaturbhuja/chevitikallu/005.jpeg'

const makeItems = (srcs) => srcs.map((src, i) => ({ src, label: `Photo ${i + 1}` }))

export const PROJECT_GALLERIES = {
  anjana:  makeItems([ap01,ap02,ap03,ap04,ap05,ap06,ap07,ap08,ap09]),
  varaha:  makeItems([vv01,vv02,vv03,vv04,vv05,vv06,vv07,vv08,vv09,vv10,vv11,vv12,vv13,vv14,vv15,vv16]),
  aparna:  makeItems([al01,al02,al03,al04,al05]),
  trimbak: [],   // add images to src/assets/gallery/chaturbhuja/trimbak/ when available
}
