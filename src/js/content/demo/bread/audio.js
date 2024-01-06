content.demo.bread.audio = (() => {
  let bus

  return {
    bus: () => bus,
    load: function () {
      bus = engine.mixer.createBus()

      bus.gain.value = engine.const.zeroGain
      engine.fn.rampLinear(bus.gain, 1, 1/16)

      this.fft.load()
      this.touches.load()

      return this
    },
    unload: function () {
      engine.fn.rampLinear(bus.gain, engine.const.zeroGain, 1/16)
      bus = undefined

      this.fft.unload()
      this.touches.unload()

      return this
    },
    update: function () {
      this.touches.update()
      this.fft.update()

      return this
    },
  }
})()
