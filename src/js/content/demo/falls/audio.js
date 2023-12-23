content.demo.falls.audio = (() => {
  let bus

  return {
    bus: () => bus,
    load: function () {
      bus = engine.mixer.createBus()

      return this
    },
    unload: function () {
      bus.disconnect()
      bus = undefined

      return this
    },
    update: function () {
      return this
    },
  }
})()
