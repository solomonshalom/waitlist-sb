const storageKey = 'theme-preference'

const onClick = () => {
  // Always set to light mode on toggle
  theme.value = 'light'
  setPreference()
}

const getColorPreference = () => {
  // Always return light regardless of storage or system preference
  return 'light'
}

const setPreference = () => {
  localStorage.setItem(storageKey, 'light')
  reflectPreference()
}

const reflectPreference = () => {
  document.firstElementChild
    .setAttribute('data-new-ui-theme', 'light')

  document
    .querySelector('#theme-toggle')
    ?.setAttribute('aria-label', 'light')
}

const theme = {
  value: 'light',
}

reflectPreference()

window.onload = () => {
  reflectPreference()
  
  // Optional: You can keep the toggle button functionality
  // but it will only toggle between light and light (effectively doing nothing)
  document
    .querySelector('#theme-toggle')
    ?.addEventListener('click', onClick)
}

// Override system preference changes to always stay in light mode
window
  .matchMedia('(prefers-color-scheme: light)')
  .addEventListener('change', () => {
    theme.value = 'light'
    setPreference()
  })