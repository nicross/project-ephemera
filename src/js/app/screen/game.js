app.screen.game = app.screenManager.invent({
  // Attributes
  id: 'game',
  parentSelector: '.a-app--game',
  rootSelector: '.a-game',
  transitions: {
    back: function () {
      this.change('demos')
    },
  },
  // State
  state: {
    demo: undefined,
  },
  // Hooks
  onEnter: function ({demo}) {
    this.state.demo = demo
    demo.load()
  },
  onExit: function () {
    this.state.demo.unload()
    this.state.demo = undefined
  },
  onFrame: function () {
    const ui = app.controls.ui()

    if (ui.back) {
      return app.screenManager.dispatch('back')
    }

    this.state.demo.update()
  },
})
