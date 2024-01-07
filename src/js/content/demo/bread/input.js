content.demo.bread.input = (() => {
  const touchLimit = 8

  let touches = new Set()

  return {
    load: function () {
      this.gamepad.load()
      this.keyboard.load()
      this.mouse.load()

      return this
    },
    mode: function () {
      return this.gamepad.mode()
        || this.keyboard.mode()
        || this.mouse.mode()
    },
    unload: function () {
      touches = new Set()

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

      touches = [
        ...this.mouse.touches(),
        ...this.gamepad.touches(),
        ...this.keyboard.touches(),
      ]

      if (touches.length > touchLimit) {
        touches = touches.slice(touches.length - touchLimit - 1, touches.length - 1)
      }

      touches = new Set(touches)

      return this
    },
  }
})()
