content.demo.falls.time = (() => {
  let time = 0

  return {
    get: () => time,
    load: function () {
      return this
    },
    unload: function () {
      time = 0

      return this
    },
    update: function () {
      time += engine.loop.delta()

      return this
    },
  }
})()
