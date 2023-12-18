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
  state: {},
  // Hooks
  onEnter: function () {

  },
  onExit: function () {

  },
  onFrame: function () {
    const ui = app.controls.ui()

    if (ui.back) {
      return app.screenManager.dispatch('back')
    }
  },
})
