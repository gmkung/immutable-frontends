export function setupDynamicFavicon() {
    const setFavicon = (isDark: boolean) => {
      const favicon = document.createElement('link')
      favicon.rel = 'icon'
      favicon.href = isDark ? '/logo-dark.svg' : '/logo-light.svg'
      document.head.appendChild(favicon)
    }
  
    setFavicon(window.matchMedia('(prefers-color-scheme: dark)').matches)
  
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setFavicon(e.matches)
    })
  }