app.screen.splash = app.screenManager.invent({
  // Attributes
  id: 'splash',
  parentSelector: '.a-app--splash',
  rootSelector: '.a-splash',
  transitions: {
    interact: function () {
      // Skip boot sequence into demo
      if (app.debug && true) {
        return this.change('game', {
          demo: content.demo.falls,
        })
      }

      this.change('boot')
    },
  },
  // Hooks
  onReady: function () {
    const root = this.rootElement

    root.addEventListener('click', () => {
      app.screenManager.dispatch('interact')
    })

    root.querySelector('.a-splash--version').innerHTML = `v${app.version()}`
  },
  onFrame: function () {
    const ui = app.controls.ui()

    if (ui.confirm || ui.enter || ui.space || ui.start || ui.focus === 0) {
      app.screenManager.dispatch('interact')
    }
  },
})
