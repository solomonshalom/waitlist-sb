import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4'

const config = {
  theme: 'system',
  muted: false,
  exploded: false,
  one: {
    travel: 26,
    text: 'ok',
    key: 'o',
    hue: 114,
    saturation: 1.4,
    brightness: 1.2,
    buttonElement: document.querySelector('#one'),
    textElement: document.querySelector('#one .key__text'),
  },
  two: {
    travel: 26,
    text: 'go',
    key: 'g',
    hue: 0,
    saturation: 0,
    brightness: 1.4,
    buttonElement: document.querySelector('#two'),
    textElement: document.querySelector('#two .key__text'),
  },
  three: {
    travel: 18,
    text: 'create.',
    key: 'Enter',
    hue: 0,
    saturation: 0,
    brightness: 0.4,
    buttonElement: document.querySelector('#three'),
    textElement: document.querySelector('#three .key__text'),
  },
}

const clickAudio = new Audio(
  'https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3'
)
clickAudio.muted = config.muted

// ❌ Removed the Pane (no user-facing config UI)
// const ctrl = new Pane({ title: 'config', expanded: false })

const update = () => {
  document.documentElement.dataset.theme = config.theme
}

update()

let recorder
const ids = ['one', 'two', 'three']

const recordKey = (config) => (event) => {
  config.key = event.key
}

for (const id of ids) {
  config[id].buttonElement.style.setProperty('--travel', config[id].travel)
  config[id].buttonElement.style.setProperty('--saturate', config[id].saturation)
  config[id].buttonElement.style.setProperty('--hue', config[id].hue)
  config[id].buttonElement.style.setProperty('--brightness', config[id].brightness)

  config[id].buttonElement.addEventListener('pointerdown', () => {
    if (!config.muted) {
      clickAudio.currentTime = 0
      clickAudio.play()
    }
  })
}

// handle the key bindings
window.addEventListener('keydown', (event) => {
  for (const id of ids) {
    if (event.key === config[id].key) {
      config[id].buttonElement.dataset.pressed = true
      if (!config.muted) {
        clickAudio.currentTime = 0
        clickAudio.play()
      }
    }
  }
})
window.addEventListener('keyup', (event) => {
  for (const id of ids) {
    if (event.key === config[id].key)
      config[id].buttonElement.dataset.pressed = false
  }
})

document.querySelector('.keypad').style.setProperty('opacity', 1)

document
  .querySelector('form')
  .addEventListener('submit', (event) => event.preventDefault())