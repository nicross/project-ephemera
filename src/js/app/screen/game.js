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
    window.addEventListener('orientationchange', () => this.recalculateCanvas())
    window.addEventListener('resize', () => this.recalculateCanvas())
  },
  onEnter: function ({demo}) {
    this.buildCanvas()

    this.state.demo = demo
    demo.load()
  },
  onExit: function () {
    this.state.demo.unload()
    this.state.demo = undefined
  },
  onFrame: function () {
    const ui = app.controls.ui()

    if (ui.exitGame) {
      return app.screenManager.dispatch('back')
    }

    this.state.demo.update()
  },
  // Methods
  buildCanvas: function () {
    if (this.canvasElement) {
      this.canvasElement.remove()
    }

    this.canvasElement = document.createElement('canvas')
    this.canvasElement.classList.add('a-game--canvas')

    this.rootElement.appendChild(this.canvasElement)
    this.recalculateCanvas()

    content.video.setCanvas(this.canvasElement)
  },
  recalculateCanvas: function () {
    if (!this.canvasElement) {
      return
    }

    this.canvasElement.height = this.canvasElement.clientHeight
    this.canvasElement.width = this.canvasElement.clientWidth
  },
})
