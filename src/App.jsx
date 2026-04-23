import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CHAPTERS } from './data/chapters'
import { FRAME_URLS } from './utils/frameGlobs'
import IntroSplash from './components/IntroSplash'
import LoadingScreen from './components/LoadingScreen'
import ChapterSection from './components/ChapterSection'
import HUD from './components/HUD'
import ScrollProgressBar from './components/ScrollProgressBar'
import NoiseOverlay from './components/NoiseOverlay'

// hysteresis thresholds
const INTRO_HIDE_AT = 80   // scrollY px — hide intro
const INTRO_SHOW_AT = 20   // scrollY px — show intro again

function App() {
  const [loading, setLoading]           = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [showIntro, setShowIntro]       = useState(true)
  const [allFrames, setAllFrames]       = useState({})
  const [activeChapter, setActiveChapter] = useState('01')
  const [activeTag, setActiveTag]         = useState('GENESIS')

  // preload frames
  useEffect(() => {
    const result = {}
    const toLoad = []

    CHAPTERS.forEach(chapter => {
      const urls = FRAME_URLS[chapter.id] || []
      result[chapter.id] = urls.map(url => {
        const img = new Image()
        toLoad.push({ img, url })
        return img
      })
    })

    setAllFrames(result)

    if (toLoad.length === 0) {
      window.scrollTo(0, 0)
      setLoading(false)
      return
    }

    let done = 0
    toLoad.forEach(({ img, url }) => {
      const finish = () => {
        done++
        setLoadProgress(done / toLoad.length)
        if (done === toLoad.length) {
          window.scrollTo(0, 0)
          setLoading(false)
        }
      }
      img.onload = finish
      img.onerror = () => { img._failed = true; finish() }
      img.src = url
    })
  }, [])

  // scroll-driven intro visibility with hysteresis
  useEffect(() => {
    if (loading) return
    const handle = () => {
      const y = window.scrollY
      if (y > INTRO_HIDE_AT) setShowIntro(false)
      else if (y < INTRO_SHOW_AT) setShowIntro(true)
    }
    window.addEventListener('scroll', handle, { passive: true })
    handle()
    return () => window.removeEventListener('scroll', handle)
  }, [loading])

  const handleActive = useCallback((number, tag) => {
    setActiveChapter(prev => prev === number ? prev : number)
    setActiveTag(prev => prev === tag ? prev : tag)
  }, [])

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <AnimatePresence>
        {loading && <LoadingScreen key="loading" progress={loadProgress} />}
      </AnimatePresence>

      {!loading && (
        <>
          <IntroSplash visible={showIntro} />

          <HUD activeChapter={activeChapter} chapterTag={activeTag} />
          <ScrollProgressBar />
          <NoiseOverlay />

          {CHAPTERS.map((chapter, i) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              frames={allFrames[chapter.id] || []}
              onActive={handleActive}
              isLast={i === CHAPTERS.length - 1}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default App
