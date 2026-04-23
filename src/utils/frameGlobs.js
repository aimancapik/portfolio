const genesisGlob  = import.meta.glob('/src/assets/frames/genesis/*.{png,jpg,jpeg}',  { eager: true })
const thegrindGlob = import.meta.glob('/src/assets/frames/thegrind/*.{png,jpg,jpeg}', { eager: true })
const arsenalGlob  = import.meta.glob('/src/assets/frames/arsenal/*.{png,jpg,jpeg}',  { eager: true })
const thecallGlob  = import.meta.glob('/src/assets/frames/thecall/*.{png,jpg,jpeg}',  { eager: true })

function sortedUrls(glob) {
  return Object.keys(glob).sort().map(k => glob[k].default)
}

export const FRAME_URLS = {
  genesis:  sortedUrls(genesisGlob),
  thegrind: sortedUrls(thegrindGlob),
  arsenal:  sortedUrls(arsenalGlob),
  thecall:  sortedUrls(thecallGlob),
}
