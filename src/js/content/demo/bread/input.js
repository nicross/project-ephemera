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

      touches = new Set(
        [
          ...this.mouse.touches(),
          ...this.gamepad.touches(),
          ...this.keyboard.touches(),
        ].slice(0, touchLimit)
      )

      return this
    },
  }
})()
