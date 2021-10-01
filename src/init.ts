export const LS_KEY = 'theme'

function prefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function preferColorSchemeListener(event: MediaQueryListEvent) {
  const theme = localStorage.getItem(LS_KEY)
  if (theme && theme.length > 0) {
    // maybe they set it before this and now we dont need to listen anymore
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', preferColorSchemeListener)
  } else {
    document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light')
  }
}

// interface ThemeChangerOptions {
//   defaultTheme?: string
//   localStorageKey?: string
// }

function init(defaultTheme?: string) {
  const theme = localStorage.getItem(LS_KEY)
  if (theme && theme.length > 0) {
    console.debug(`Got theme=${theme} from LS`)
    document.documentElement.setAttribute('data-theme', theme)
  } else if (defaultTheme) {
    console.debug(`No theme in LS, using default theme=${defaultTheme}`)
    document.documentElement.setAttribute('data-theme', defaultTheme)
  } else if (prefersDark()) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', preferColorSchemeListener)
    console.debug(`No theme in LS, using theme=dark from OS preference.`)
    document.documentElement.setAttribute('data-theme', 'dark')
  }
}

export default init
