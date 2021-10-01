import { LS_KEY } from './init'

export default function useThemeChange(node: HTMLElement) {
  const currentTheme = document.documentElement.getAttribute('data-theme')

  let destroy = () => {}

  // using a button/element click to set a theme
  if (node.getAttribute('data-set-theme')) {
    const themeToSet = node.getAttribute('data-set-theme')
    node.addEventListener('click', setThemeHandler)

    const activeClass = node.getAttribute('data-act-class')
    if (activeClass && themeToSet === currentTheme) {
      node.classList.add(activeClass)
    }

    destroy = () => node.removeEventListener('click', setThemeHandler)
  }
  // using a checkbox to toggle 2 theme states
  else if (node.getAttribute('data-toggle-theme')) {
    if (node.nodeName !== 'INPUT' || node.getAttribute('type') !== 'checkbox') {
      throw new Error('Only checkboxes are supported for toggle type')
    }

    const themes = node.getAttribute('data-toggle-theme') as string // already checked we had this attr
    const themesList = themes.split(',').map((s) => s.trim())
    if (themesList.length !== 2) {
      console.error('node', node)
      throw Error(`'data-toggle-theme' elements must have 2 toggle theme states seperated by ","`)
    }

    node.addEventListener('change', toggleThemeHandler)
    if (currentTheme === themesList[1]) {
      ;(node as HTMLInputElement).checked = true
    }

    destroy = () => node.removeEventListener('change', toggleThemeHandler)
  }
  // using a select UI to choose a theme from the dropdown
  else if (node.getAttribute('data-choose-theme') !== null) {
    node.addEventListener('change', chooseThemeHandler)
    if (currentTheme) {
      ;(node as HTMLSelectElement).value = currentTheme
    }

    destroy = () => node.removeEventListener('change', chooseThemeHandler)
  } else {
    console.error('Missing on node: ', node)
    throw new Error(
      `Whoops you forgot to add one of the attributes: "data-set-theme", "data-toggle-theme", "data-choose-theme"`
    )
  }

  return {
    destroy,
  }
}

function setThemeHandler(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement
  const newTheme = el.getAttribute('data-set-theme') as string // already checked we had this attr

  console.debug(`Set data-theme=${newTheme}`)
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem(LS_KEY, newTheme)

  const activeClass = el.getAttribute('data-act-class')
  if (activeClass) {
    document.querySelectorAll('[data-set-theme]').forEach((el) => {
      el.classList.remove(activeClass)
    })
    el.classList.add(activeClass)
  }
}

function toggleThemeHandler(event: Event) {
  const el = event.currentTarget as HTMLInputElement
  const themes = el.getAttribute('data-toggle-theme') as string // already checked we had this attr
  const themesList = themes.split(',').map((s) => s.trim())

  const themeIdx = el.checked ? 1 : 0
  console.debug(`Toggled data-theme=${themesList[themeIdx]}`)
  document.documentElement.setAttribute('data-theme', themesList[themeIdx])
  localStorage.setItem(LS_KEY, themesList[themeIdx])
}

function chooseThemeHandler(event: Event) {
  const el = event.currentTarget as HTMLSelectElement
  const newTheme = el.value

  console.debug(`Set data-theme=${newTheme}`)
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem(LS_KEY, newTheme)
}
