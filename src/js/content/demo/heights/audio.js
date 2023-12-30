content.demo.heights.audio = (() => {
  let bus

  return {
    bus: () => bus,
    load: function () {
      bus = engine.mixer.createBus()

      this.fairies.load()
      this.footsteps.load()
      this.moon.load()
      this.trail.load()
      this.wind.load()

      return this
    },
    unload: function () {
      engine.fn.rampLinear(bus.gain, engine.const.zeroGain, 1/16)
      bus = undefined

      this.fairies.unload()
      this.footsteps.unload()
      this.moon.unload()
      this.trail.unload()
      this.wind.unload()

      return this
    },
    update: function () {
      this.fairies.update()
      this.moon.update()
      this.trail.update()
      this.wind.update()

      return this
    },
  }
})()
