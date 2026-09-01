/**
 * Proactively warms and prefetches Kids destination page bundles and media assets
 * in the background during idle time, eliminating any first-click delay or network lag.
 */
let hasPreloaded = false

export function preloadKidsPages() {
  if (typeof window === 'undefined' || hasPreloaded) return
  hasPreloaded = true

  const runPreload = () => {
    // 1. Warm primary hub destinations in browser cache during idle time
    try {
      import('../Pages/Kids/CourseHub').catch(() => {})
      import('../Pages/Kids/Videos').catch(() => {})
      import('../Pages/Kids/Challenges').catch(() => {})
      import('../Pages/Kids/BadgeHall').catch(() => {})
    } catch (e) {
      // Ignore
    }

    // 2. Warm essential shared assets gracefully
    const imagesToWarm = [
      '/module.webp?v=2',
      '/videos.webp?v=2',
      '/games.webp?v=2',
      '/badges/badge_hall.webp?v=3',
    ]

    imagesToWarm.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runPreload, { timeout: 2500 })
  } else {
    setTimeout(runPreload, 1200)
  }
}
