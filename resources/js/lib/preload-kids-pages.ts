/**
 * Proactively warms and prefetches Kids destination page bundles and media assets
 * in the background during idle time, eliminating any first-click delay or network lag.
 */
let hasPreloaded = false

export function preloadKidsPages() {
  if (typeof window === 'undefined' || hasPreloaded) return
  hasPreloaded = true

  const runPreload = () => {
    // 1. Warm page JS chunks in browser cache
    try {
      import('../Pages/Kids/BadgeHall').catch(() => {})
      import('../Pages/Kids/Challenges').catch(() => {})
      import('../Pages/Kids/CourseHub').catch(() => {})
      import('../Pages/Kids/Videos').catch(() => {})
      import('../Pages/Kids/TaskMaster').catch(() => {})
      import('../Pages/Kids/Games/RightCall').catch(() => {})
      import('../Pages/Kids/ModuleOne').catch(() => {})
      import('../Pages/Kids/ModuleTwo').catch(() => {})
      import('../Pages/Kids/ModuleThree').catch(() => {})
      import('../Pages/Kids/ModuleFour').catch(() => {})
      import('../Pages/Kids/ModuleFive').catch(() => {})
      import('../Pages/Profile').catch(() => {})
    } catch (e) {
      // Ignore
    }

    // 2. Warm destination media assets
    const imagesToWarm = [
      '/badges/badge_hall.webp?v=3',
      '/games.webp?v=2',
      '/videos.webp?v=2',
      '/task_master.webp',
      '/therightcall_kids.webp',
      '/module.webp?v=2',
      '/edith.webp?v=3',
      '/fire_safety_quiz.webp',
      '/memory_game.webp',
      '/smoke_crawl.webp',
      '/hotornot.webp',
      '/hazard_blitz.webp',
      '/standard.webp',
      '/focus.webp',
    ]

    imagesToWarm.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runPreload, { timeout: 1500 })
  } else {
    setTimeout(runPreload, 400)
  }
}
