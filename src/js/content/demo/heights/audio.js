content.demo.heights.audio = (() => {
  let bus

  return {
    bus: () => bus,
    load: function () {
      bus = engine.mixer.createBus()

      bus.gain.value = engine.const.zeroGain
      engine.fn.rampLinear(bus.gain, 1, 1/2)

      engine.const.speedOfSound = 999

      this.fairies.load()
      this.footsteps.load()
      this.jump.load()
      this.moon.load()
      this.trail.load()
      this.windAmbient.load()
      this.windDirectional.load()

      return this
    },
    unload: function () {
      engine.fn.rampLinear(bus.gain, engine.const.zeroGain, 1/16)
      bus = undefined

      engine.const.speedOfSound = engine.const.defaultSpeedOfSound

      this.fairies.unload()
      this.footsteps.unload()
      this.jump.unload()
      this.moon.unload()
      this.trail.unload()
      this.windAmbient.unload()
      this.windDirectional.unload()

      return this
    },
    update: function () {
      this.fairies.update()
      this.jump.update()
      this.moon.update()
      this.trail.update()
      this.windAmbient.update()
      this.windDirectional.update()

      return this
    },
  }
})()
