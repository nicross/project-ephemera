content.demo.falls.audio = (() => {
  let bus

  return {
    bus: () => bus,
    load: function () {
      bus = engine.mixer.createBus()

      bus.gain.value = engine.const.zeroGain
      engine.fn.rampLinear(bus.gain, 1, 1/16)

      this.frequencies.load()
      this.enemies.load()

      return this
    },
    unload: function () {
      engine.fn.rampLinear(bus.gain, engine.const.zeroGain, 1/16)
      bus = undefined

      this.enemies.unload()
      this.frequencies.unload()

      return this
    },
    update: function () {
      this.frequencies.update()
      this.enemies.update()

      return this
    },
  }
})()
