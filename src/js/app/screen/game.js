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
  onReady: function () {
    this.canvasElement = this.rootElement.querySelector('.a-game--canvas')

    window.addEventListener('orientationchange', () => this.recalculateCanvas())
    window.addEventListener('resize', () => this.recalculateCanvas())
    this.recalculateCanvas()

    content.video.setCanvas(this.canvasElement)
  },
  onEnter: function ({demo}) {
    this.recalculateCanvas()
    
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
  // Methods
  recalculateCanvas: function () {
    this.canvasElement.height = this.canvasElement.clientHeight
    this.canvasElement.width = this.canvasElement.clientWidth
  },
})
