content.demo.bread.input = (() => {
  const touches = new Set()

  return {
    load: function () {
      this.gamepad.load()
      this.keyboard.load()
      this.mouse.load()

      return this
    },
    unload: function () {
      touches.clear()

      this.gamepad.unload()
      this.keyboard.unload()
      this.mouse.unload()

      return this
    },
    touches: () => new Set(touches),
    update: function () {
      this.gamepad.update()
      this.keyboard.update()
      this.mouse.update()

      return this
    },
  }
})()
