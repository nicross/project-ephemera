content.demo.falls.audio = (() => {
  let bus

  return {
    bus: () => bus,
    load: function () {
      bus = engine.mixer.createBus()

      this.frequencies.load()

      return this
    },
    unload: function () {
      bus.disconnect()
      bus = undefined

      this.frequencies.unload()

      return this
    },
    update: function () {
      this.frequencies.update()

      return this
    },
  }
})()
