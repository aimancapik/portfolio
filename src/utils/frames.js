export function getFrameUrls(folder, total) {
  return Array.from({ length: total }, (_, i) =>
    `${folder}/frame_${String(i + 1).padStart(3, '0')}.jpg`
  )
}
