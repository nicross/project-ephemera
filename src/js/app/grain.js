app.grain = (() => {
  let isActive = false,
    value = 0

  return {
    activate: function () {
      if (isActive) {
        return this
      }

      isActive = true
      value = 1

      this.audio.activate()
      this.video.activate()

      return this
    },
    isActive: () => isActive,
    touch: function (amount = 1) {
      if (isActive) {
        value = engine.fn.clamp(value + amount)
      }

      return this
    },
    update: function () {
      if (!isActive) {
        return this
      }

      value = engine.fn.accelerateValue(value, 0, 1)

      this.audio.update(value)
      this.video.update(value)

      return this
    },
    value: () => value,
  }
})()

engine.loop.on('frame', () => app.grain.update())

engine.ready(() => {
  app.screenManager.on('enter', () => app.grain.touch(engine.fn.randomFloat(0.5, 0.75)))
  app.screenManager.on('enter-boot', () => app.grain.activate())
})
