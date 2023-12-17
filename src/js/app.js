const app = (() => {
  const readyContext = {}

  const ready = new Promise((resolve, reject) => {
    readyContext.resolve = resolve
    readyContext.reject = reject
  })

  let isActive = false,
    root

  function onResize() {
    // Constrain to 4:3 aspect ratio
    if (window.innerHeight > window.innerWidth * 3/4) {
      root.style.height = (3/4 * window.innerWidth) + 'px'
      root.style.width = '100%'
    } else {
      root.style.height = '100%'
      root.style.width = (4/3 * window.innerHeight) + 'px'
    }
  }

  return {
    activate: function () {
      isActive = true

      root = document.querySelector('.a-app')
      root.classList.add('a-app-active')

      window.addEventListener('orientationchange', onResize)
      window.addEventListener('resize', onResize)
      onResize()

      readyContext.resolve()

      return this
    },
    component: {},
    height: () => root.clientHeight,
    isActive: () => isActive,
    isElectron: () => typeof ElectronApi != 'undefined',
    name: () => 'syngen-template',
    quit: function () {
      if (this.isElectron()) {
        ElectronApi.quit()
      }

      return this
    },
    ready: async (callback) => {
      return typeof callback == 'function'
        ? ready.then(callback)
        : readyContext
    },
    screen: {},
    utility: {},
    width: () => root.clientWidth,
    version: () => '0.0.0', // Replaced via Gulpfile.js
  }
})()
