export function setupDynamicFavicon() {
    const setFavicon = (isDark: boolean) => {
      // Remove existing favicon if it exists
      const existingFavicon = document.querySelector('link[rel="icon"]')
      if (existingFavicon) {
        existingFavicon.remove()
      }

      // Create and append new favicon
      const favicon = document.createElement('link')
      favicon.rel = 'icon'
      favicon.href = isDark ? '/logo-dark.svg' : '/logo-light.svg'
      document.head.appendChild(favicon)
    }
  
    // Set initial favicon
    setFavicon(window.matchMedia('(prefers-color-scheme: dark)').matches)
  
    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setFavicon(e.matches)
    })
}