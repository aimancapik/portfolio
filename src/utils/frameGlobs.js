// Frames live in public/frames/ — served as static assets, no Vite processing
export function getChapterFrameUrls(chapter) {
  const { frameFolder, totalFrames } = chapter
  return Array.from({ length: totalFrames }, (_, i) =>
    `${frameFolder}/frame_${String(i).padStart(3, '0')}.webp`
  )
}

// Map of chapterId → URL array (built once at module load)
import { CHAPTERS } from '../data/chapters'
export const FRAME_URLS = Object.fromEntries(
  CHAPTERS.map(c => [c.id, getChapterFrameUrls(c)])
)
