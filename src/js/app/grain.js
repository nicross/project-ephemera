app.grain = (() => {
  let isActive = false,
    touch = 0,
    value = 0

  return {
    activate: function () {
      if (isActive) {
        return this
      }

      isActive = true
      touch = 1
      value = 1

      this.audio.activate(value)
      this.video.activate(value)

      return this
    },
    isActive: () => isActive,
    set: function (amount = 0) {
      touch = amount

      return this
    },
    touch: function (amount = 1) {
      if (isActive) {
        touch = engine.fn.clamp(value + amount)
      }

      return this
    },
    update: function () {
      if (!isActive) {
        return this
      }

      value = engine.fn.accelerateValue(value, touch, 16)
      touch = engine.fn.accelerateValue(touch, 0, 1)

      this.audio.update(value)
      this.video.update(value)

      return this
    },
    value: () => value,
  }
})()

engine.loop.on('frame', () => app.grain.update())

engine.ready(() => {
  app.screenManager.on('enter', () => app.grain.touch(engine.fn.randomFloat(0.333, 0.666)))
  app.screenManager.on('exit-splash', () => app.grain.activate())
  app.screenManager.on('exit-game', () => app.grain.audio.unduck())

  app.screenManager.on('enter-game', ({demo}) => {
    if (!demo.allowHum) {
      app.grain.audio.duck()
    }
  })

  content.grain.setAdapter(app.grain)
})
